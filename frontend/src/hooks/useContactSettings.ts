import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface ContactSettings {
  id: number;
  phoneNumber: string;
  whatsappNumber: string;
  emailAddress: string;
  updatedAt: string;
}

export const useContactSettings = () => {
  return useQuery<ContactSettings>(['contact-settings'], async () => {
    const { data } = await api.get<ContactSettings>('/api/contact-settings');
    return data;
  });
};

export const useUpdateContactSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ContactSettings>) => {
      const { data } = await api.put<ContactSettings>('/api/contact-settings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-settings'] });
    },
  });
};