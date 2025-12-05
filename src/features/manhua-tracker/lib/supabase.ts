import { supabase } from '@/lib/supabase';
import type {
  Manhua,
  ManhuaSource,
  ManhuaWithSources,
  CreateManhuaInput,
  UpdateManhuaInput,
  CreateSourceInput,
  UpdateSourceInput,
} from '../types';

export const manhuaService = {
  async getAllManhua(userId: string): Promise<ManhuaWithSources[]> {
    const { data: manhuaList, error: manhuaError } = await supabase
      .from('manhua')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (manhuaError) throw manhuaError;
    if (!manhuaList || manhuaList.length === 0) return [];

    const manhuaIds = manhuaList.map(m => m.id);
    const { data: sources, error: sourcesError } = await supabase
      .from('manhua_sources')
      .select('*')
      .in('manhua_id', manhuaIds)
      .order('latest_chapter', { ascending: false });

    if (sourcesError) throw sourcesError;

    return manhuaList.map(manhua => ({
      ...manhua,
      sources: (sources || []).filter(s => s.manhua_id === manhua.id),
    }));
  },

  async getManhuaById(id: string): Promise<ManhuaWithSources | null> {
    const { data: manhua, error: manhuaError } = await supabase
      .from('manhua')
      .select('*')
      .eq('id', id)
      .single();

    if (manhuaError) {
      if (manhuaError.code === 'PGRST116') return null;
      throw manhuaError;
    }

    const { data: sources, error: sourcesError } = await supabase
      .from('manhua_sources')
      .select('*')
      .eq('manhua_id', id)
      .order('latest_chapter', { ascending: false });

    if (sourcesError) throw sourcesError;

    return {
      ...manhua,
      sources: sources || [],
    };
  },

  async createManhua(userId: string, input: CreateManhuaInput): Promise<Manhua> {
    const { data, error } = await supabase
      .from('manhua')
      .insert({
        user_id: userId,
        title: input.title,
        cover_image_url: input.cover_image_url || null,
        description: input.description || null,
        status: input.status || 'plan_to_read',
        current_chapter: input.current_chapter || 0,
        total_chapters: input.total_chapters || null,
        rating: input.rating || null,
        notes: input.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateManhua(id: string, input: UpdateManhuaInput): Promise<Manhua> {
    const { data, error } = await supabase
      .from('manhua')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteManhua(id: string): Promise<void> {
    // Delete sources first due to foreign key
    await supabase
      .from('manhua_sources')
      .delete()
      .eq('manhua_id', id);

    const { error } = await supabase
      .from('manhua')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const sourceService = {
  async addSource(input: CreateSourceInput): Promise<ManhuaSource> {
    const { data, error } = await supabase
      .from('manhua_sources')
      .insert({
        manhua_id: input.manhua_id,
        website_name: input.website_name,
        website_url: input.website_url,
        latest_chapter: input.latest_chapter || 0,
        last_updated: input.last_updated || null,
        last_checked: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSource(id: string, input: UpdateSourceInput): Promise<ManhuaSource> {
    const { data, error } = await supabase
      .from('manhua_sources')
      .update({
        ...input,
        last_checked: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSource(id: string): Promise<void> {
    const { error } = await supabase
      .from('manhua_sources')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getSourcesForManhua(manhuaId: string): Promise<ManhuaSource[]> {
    const { data, error } = await supabase
      .from('manhua_sources')
      .select('*')
      .eq('manhua_id', manhuaId)
      .order('latest_chapter', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
