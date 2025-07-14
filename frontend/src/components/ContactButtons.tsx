import { useContactSettings } from '../hooks/useContactSettings';

export default function ContactButtons() {
  const { data, isLoading } = useContactSettings();

  if (isLoading) return null;
  if (!data) return null;

  const { phoneNumber, whatsappNumber, emailAddress } = data;

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {phoneNumber && (
        <a href={`tel:${phoneNumber}`} className="btn-primary">
          Call Us
        </a>
      )}
      {whatsappNumber && (
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-success">
          WhatsApp
        </a>
      )}
      {emailAddress && (
        <a href={`mailto:${emailAddress}`} className="btn-secondary">
          Email Us
        </a>
      )}
    </div>
  );
}