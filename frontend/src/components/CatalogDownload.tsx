import { useCurrentCatalog } from '../hooks/useCatalog';

export default function CatalogDownload() {
  const { data, isLoading } = useCurrentCatalog();

  if (isLoading) return null;
  if (!data) return null;

  return (
    <a href={data.fileUrl} download className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700 transition">
      Download Product Catalog
    </a>
  );
}