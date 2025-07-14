import { useState } from 'react';
import { useCatalogList, useUploadCatalog, useUpdateCatalog, useDeleteCatalog } from '../hooks/useCatalog';

export default function CatalogManager() {
  const { data: catalogs, isLoading } = useCatalogList();
  const uploadMutation = useUploadCatalog();
  const updateMutation = useUpdateCatalog();
  const deleteMutation = useDeleteCatalog();

  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await uploadMutation.mutateAsync({ file, version });
    setFile(null);
    setVersion('');
  };

  return (
    <div>
      <h2>Catalog Manager</h2>
      <form onSubmit={handleUpload} style={{ marginBottom: '1rem' }}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        <input type="text" placeholder="Version (optional)" value={version} onChange={(e) => setVersion(e.target.value)} />
        <button type="submit" disabled={uploadMutation.isPending}>Upload</button>
      </form>

      {isLoading && <p>Loading...</p>}
      {catalogs && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>File</th>
              <th>Version</th>
              <th>Uploaded</th>
              <th>Current</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogs.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>
                  <a href={cat.fileUrl} target="_blank" rel="noopener noreferrer">
                    {cat.fileName}
                  </a>
                </td>
                <td>{cat.version || '-'}</td>
                <td>{new Date(cat.uploadedAt).toLocaleString()}</td>
                <td>{cat.isCurrent ? 'Yes' : 'No'}</td>
                <td>
                  {!cat.isCurrent && (
                    <button onClick={() => updateMutation.mutate({ id: cat.id, isCurrent: true })}>Set Current</button>
                  )}
                  <button onClick={() => deleteMutation.mutate(cat.id)} style={{ marginLeft: '0.5rem' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}