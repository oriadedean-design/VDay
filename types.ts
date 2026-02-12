export type AppStage = 'hero' | 'game' | 'prize-intro' | 'date-selection' | 'final';

export interface WordleLevel {
  word: string;
  hint: string;
}

export interface DateOption {
  id: string;
  title: string;
  description: string;
  icon: 'dinner' | 'home';
}