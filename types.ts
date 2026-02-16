
export interface StoryPage {
  id: number;
  text: string;
  imageDescription: string;
  imageUrl?: string;
  illustrationType: 'modern' | 'classic' | 'watercolor' | 'sketch';
}

export interface Story {
  title: string;
  author: string;
  pages: StoryPage[];
  theme: 'magical' | 'classic' | 'minimal' | 'dark';
}

export type AppState = 'input' | 'processing' | 'viewing';
