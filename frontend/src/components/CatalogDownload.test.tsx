import { render, screen } from '@testing-library/react';
import CatalogDownload from './CatalogDownload';
import * as hooks from '../hooks/useCatalog';

jest.mock('../hooks/useCatalog');

const mockCatalog = {
  id: 1,
  fileUrl: '/uploads/catalogs/test.pdf',
  fileName: 'test.pdf',
  version: 'v1',
  uploadedAt: '2024-07-14T00:00:00Z',
  isCurrent: true
};

describe('CatalogDownload', () => {
  it('renders download button when catalog exists', () => {
    (hooks.useCurrentCatalog as jest.Mock).mockReturnValue({ data: mockCatalog, isLoading: false });
    render(<CatalogDownload />);
    expect(screen.getByText(/Download Product Catalog/i)).toHaveAttribute('href', mockCatalog.fileUrl);
  });

  it('renders nothing while loading', () => {
    (hooks.useCurrentCatalog as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    const { container } = render(<CatalogDownload />);
    expect(container).toBeEmptyDOMElement();
  });
});