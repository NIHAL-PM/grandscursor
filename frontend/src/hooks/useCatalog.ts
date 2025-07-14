import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface CatalogFile {
  id: number;
  fileUrl: string;
  fileName: string;
  version?: string | null;
  uploadedAt: string;
  isCurrent: boolean;
}

export const useCurrentCatalog = () => {
  return useQuery<CatalogFile>(['catalog', 'current'], async () => {
    const { data } = await api.get<CatalogFile>('/api/catalog/current');
    return data;
  }, {
    retry: false,
  });
};

export const useUploadCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: { file: File; version?: string }) => {
      const formData = new FormData();
      formData.append('file', file.file);
      if (file.version) formData.append('version', file.version);
      const { data } = await api.post<CatalogFile>('/api/catalog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['catalog', 'current'] });
    },
  });
};

export const useCatalogList = () => {
  return useQuery<CatalogFile[]>(['catalog', 'list'], async () => {
    const { data } = await api.get<CatalogFile[]>('/api/catalog');
    return data;
  });
};

export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isCurrent }: { id: number; isCurrent: boolean }) => {
      const { data } = await api.patch<CatalogFile>(`/api/catalog/${id}`, { isCurrent });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['catalog', 'current'] });
    },
  });
};

export const useDeleteCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/catalog/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['catalog', 'current'] });
    },
  });
};