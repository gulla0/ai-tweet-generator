export interface Transcript {
  id: string;
  title: string;
  date: string;
  content: string;
  createdAt: string;
}

export interface Tweet {
  id: string;
  transcriptId: string;
  category: string;
  content: string;
  createdAt: string;
} 