export interface Memory {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
}

export type AppState = 'intro' | 'memories' | 'proposal' | 'celebration';
