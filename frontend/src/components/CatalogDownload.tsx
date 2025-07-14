import { useCurrentCatalog } from '../hooks/useCatalog';

export default function CatalogDownload() {
  const { data, isLoading } = useCurrentCatalog();

  if (isLoading) return null;
  if (!data) return null;

  return (
    <a href={data.fileUrl} download className="btn-accent">
      Download Product Catalog
    </a>
  );
}