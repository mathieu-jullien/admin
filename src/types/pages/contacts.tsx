export interface Contact {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  status?: 'new' | 'read' | 'answered';
}

export interface ContactStats {
  currentWeek: number;
  previousWeek: number;
  variation: number;
  recentContacts: Contact[];
}
