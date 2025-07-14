import { useContactSettings } from '../hooks/useContactSettings';

export default function ContactButtons() {
  const { data, isLoading } = useContactSettings();

  if (isLoading) return null;
  if (!data) return null;

  const { phoneNumber, whatsappNumber, emailAddress } = data;

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="flex gap-4 flex-wrap">
      {phoneNumber && (
        <a href={`tel:${phoneNumber}`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Call Us
        </a>
      )}
      {whatsappNumber && (
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          WhatsApp
        </a>
      )}
      {emailAddress && (
        <a href={`mailto:${emailAddress}`} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Email Us
        </a>
      )}
    </div>
  );
}