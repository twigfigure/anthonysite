// Admin Dashboard Types

export interface PromptTemplate {
  id: string;
  name: string;
  template_type: 'avatar' | 'splash_art' | 'kingdom' | 'equipment' | 'custom';
  base_prompt: string;
  variables: Record<string, string>; // { "kingdom": "Kingdom name", "class": "Hunter class" }
  negative_prompt?: string;
  settings: {
    width: number;
    height: number;
    style?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ImageAsset {
  id: string;
  name: string;
  category: string;
  tags: string[];
  image_url: string;
  thumbnail_url?: string;
  prompt_used: string;
  template_id?: string;
  width: number;
  height: number;
  file_size: number;
  notes?: string;
  created_at: string;
}

export interface GuildWithOwner {
  id: string;
  user_id: string;
  name: string;
  region: string;
  level: number;
  gold: number;
  crystals: number;
  influence: number;
  world_level: number;
  max_hunters: number;
  created_at: string;
  owner_email?: string;
  hunter_count?: number;
}

export type AdminTab = 'backstory' | 'portals' | 'guilds' | 'database' | 'assets';