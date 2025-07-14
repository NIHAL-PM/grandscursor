import { render, screen } from '@testing-library/react';
import ContactButtons from './ContactButtons';
import * as hooks from '../hooks/useContactSettings';

jest.mock('../hooks/useContactSettings');

const mockData = {
  id: 1,
  phoneNumber: '+1234567890',
  whatsappNumber: '+1234567890',
  emailAddress: 'test@example.com',
  updatedAt: '2024-07-14T00:00:00Z'
};

describe('ContactButtons', () => {
  it('renders all buttons with valid data', () => {
    (hooks.useContactSettings as jest.Mock).mockReturnValue({ data: mockData, isLoading: false });
    render(<ContactButtons />);
    expect(screen.getByText(/Call Us/i)).toHaveAttribute('href', 'tel:+1234567890');
    expect(screen.getByText(/WhatsApp/i)).toHaveAttribute('href', expect.stringContaining('wa.me'));
    expect(screen.getByText(/Email Us/i)).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('renders nothing while loading', () => {
    (hooks.useContactSettings as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    const { container } = render(<ContactButtons />);
    expect(container).toBeEmptyDOMElement();
  });
});