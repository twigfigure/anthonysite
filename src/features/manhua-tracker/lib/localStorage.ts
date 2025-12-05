import type {
  Manhua,
  ManhuaSource,
  ManhuaWithSources,
  CreateManhuaInput,
  UpdateManhuaInput,
  CreateSourceInput,
  UpdateSourceInput,
} from '../types';

const STORAGE_KEY = 'peakscroll_manhua';
const SOURCES_KEY = 'peakscroll_sources';

function generateId(): string {
  return crypto.randomUUID();
}

function getManhuaFromStorage(): Manhua[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveManhuaToStorage(manhua: Manhua[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manhua));
}

function getSourcesFromStorage(): ManhuaSource[] {
  const data = localStorage.getItem(SOURCES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveSourcesToStorage(sources: ManhuaSource[]): void {
  localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
}

export const localManhuaService = {
  getAllManhua(): ManhuaWithSources[] {
    const manhuaList = getManhuaFromStorage();
    const sources = getSourcesFromStorage();

    return manhuaList
      .map(manhua => ({
        ...manhua,
        sources: sources.filter(s => s.manhua_id === manhua.id),
      }))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  getManhuaById(id: string): ManhuaWithSources | null {
    const manhuaList = getManhuaFromStorage();
    const manhua = manhuaList.find(m => m.id === id);
    if (!manhua) return null;

    const sources = getSourcesFromStorage().filter(s => s.manhua_id === id);
    return { ...manhua, sources };
  },

  createManhua(input: CreateManhuaInput): ManhuaWithSources {
    const manhuaList = getManhuaFromStorage();
    const now = new Date().toISOString();

    const newManhua: Manhua = {
      id: generateId(),
      user_id: 'local',
      title: input.title,
      cover_image_url: input.cover_image_url || null,
      description: input.description || null,
      status: input.status || 'plan_to_read',
      current_chapter: input.current_chapter || 0,
      total_chapters: input.total_chapters || null,
      rating: input.rating || null,
      notes: input.notes || null,
      created_at: now,
      updated_at: now,
    };

    manhuaList.push(newManhua);
    saveManhuaToStorage(manhuaList);

    return { ...newManhua, sources: [] };
  },

  updateManhua(id: string, input: UpdateManhuaInput): ManhuaWithSources | null {
    const manhuaList = getManhuaFromStorage();
    const index = manhuaList.findIndex(m => m.id === id);
    if (index === -1) return null;

    const updated: Manhua = {
      ...manhuaList[index],
      ...input,
      updated_at: new Date().toISOString(),
    };

    manhuaList[index] = updated;
    saveManhuaToStorage(manhuaList);

    const sources = getSourcesFromStorage().filter(s => s.manhua_id === id);
    return { ...updated, sources };
  },

  deleteManhua(id: string): void {
    const manhuaList = getManhuaFromStorage().filter(m => m.id !== id);
    saveManhuaToStorage(manhuaList);

    // Also delete associated sources
    const sources = getSourcesFromStorage().filter(s => s.manhua_id !== id);
    saveSourcesToStorage(sources);
  },
};

export const localSourceService = {
  addSource(input: CreateSourceInput): ManhuaSource {
    const sources = getSourcesFromStorage();
    const now = new Date().toISOString();

    const newSource: ManhuaSource = {
      id: generateId(),
      manhua_id: input.manhua_id,
      website_name: input.website_name,
      website_url: input.website_url,
      latest_chapter: input.latest_chapter || 0,
      last_updated: input.last_updated || null,
      last_checked: now,
      created_at: now,
    };

    sources.push(newSource);
    saveSourcesToStorage(sources);

    return newSource;
  },

  updateSource(id: string, input: UpdateSourceInput): ManhuaSource | null {
    const sources = getSourcesFromStorage();
    const index = sources.findIndex(s => s.id === id);
    if (index === -1) return null;

    const updated: ManhuaSource = {
      ...sources[index],
      ...input,
      last_checked: new Date().toISOString(),
    };

    sources[index] = updated;
    saveSourcesToStorage(sources);

    return updated;
  },

  deleteSource(id: string): void {
    const sources = getSourcesFromStorage().filter(s => s.id !== id);
    saveSourcesToStorage(sources);
  },

  getSourcesForManhua(manhuaId: string): ManhuaSource[] {
    return getSourcesFromStorage()
      .filter(s => s.manhua_id === manhuaId)
      .sort((a, b) => b.latest_chapter - a.latest_chapter);
  },
};
