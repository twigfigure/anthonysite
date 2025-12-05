export type ManhuaStatus = 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';

export interface Manhua {
  id: string;
  user_id: string;
  title: string;
  cover_image_url: string | null;
  description: string | null;
  status: ManhuaStatus;
  current_chapter: number;
  total_chapters: number | null;
  rating: number | null; // 1-10 scale
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ManhuaSource {
  id: string;
  manhua_id: string;
  website_name: string;
  website_url: string;
  latest_chapter: number;
  last_updated: string | null;
  last_checked: string;
  created_at: string;
}

export interface ManhuaWithSources extends Manhua {
  sources: ManhuaSource[];
}

export interface CreateManhuaInput {
  title: string;
  cover_image_url?: string | null;
  description?: string | null;
  status?: ManhuaStatus;
  current_chapter?: number;
  total_chapters?: number | null;
  rating?: number | null;
  notes?: string | null;
}

export interface UpdateManhuaInput {
  title?: string;
  cover_image_url?: string | null;
  description?: string | null;
  status?: ManhuaStatus;
  current_chapter?: number;
  total_chapters?: number | null;
  rating?: number | null;
  notes?: string | null;
}

export interface CreateSourceInput {
  manhua_id: string;
  website_name: string;
  website_url: string;
  latest_chapter?: number;
  last_updated?: string | null;
}

export interface UpdateSourceInput {
  website_name?: string;
  website_url?: string;
  latest_chapter?: number;
  last_updated?: string | null;
  last_checked?: string;
}

export const STATUS_LABELS: Record<ManhuaStatus, string> = {
  reading: 'Reading',
  completed: 'Completed',
  on_hold: 'On Hold',
  dropped: 'Dropped',
  plan_to_read: 'Plan to Read',
};

export const STATUS_COLORS: Record<ManhuaStatus, string> = {
  reading: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  on_hold: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  dropped: 'bg-red-500/20 text-red-400 border-red-500/30',
  plan_to_read: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};
