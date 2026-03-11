import { backendAPI } from './api';

export interface WhatsAppConfig {
  whatsapp_api_token: string;
  whatsapp_phone_number_id: string;
}

export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  return backendAPI.get<WhatsAppConfig>('/configs/whatsapp');
}

export async function updateWhatsAppConfig(config: Partial<WhatsAppConfig>): Promise<void> {
  return backendAPI.post<void>('/configs', config);
}
