import { api } from './api';

export type Contact = {
  id: number;
  name: string;
  email?: string | null;
  whatsappId?: string | null;
  instagramId?: string | null;
};

export async function getContacts(): Promise<Contact[]> {
  return api.get<Contact[]>('/dev/messages/contacts');
}
