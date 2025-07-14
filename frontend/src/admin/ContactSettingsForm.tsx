import { useState, useEffect } from 'react';
import { useContactSettings, useUpdateContactSettings } from '../hooks/useContactSettings';

export default function ContactSettingsForm() {
  const { data, isLoading } = useContactSettings();
  const updateMutation = useUpdateContactSettings();

  const [form, setForm] = useState({
    phoneNumber: '',
    whatsappNumber: '',
    emailAddress: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        phoneNumber: data.phoneNumber,
        whatsappNumber: data.whatsappNumber,
        emailAddress: data.emailAddress,
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(form);
    alert('Contact settings updated');
  };

  return (
    <div>
      <h2>Contact Settings</h2>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
          <label>
            Phone Number
            <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
          </label>
          <label>
            WhatsApp Number
            <input type="text" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} required />
          </label>
          <label>
            Email Address
            <input type="email" name="emailAddress" value={form.emailAddress} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={updateMutation.isPending}>Save</button>
        </form>
      )}
    </div>
  );
}