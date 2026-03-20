"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'PERSONAL',
    gender: 'MALE',
    caste: '',
    gotra: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  if (status === "loading") {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div className="container" style={{ padding: '6rem 24px', textAlign: 'center' }}>
          <h1>Please Sign In</h1>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>You must be signed in to manage your family tree.</p>
        </div>
      </main>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/persons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMessage('Successfully added to the directory!');
        setFormData({ name: '', type: 'PERSONAL', gender: 'MALE', caste: '', gotra: '', description: '' });
      } else {
        setMessage('Failed to add person. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 24px', flex: 1 }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
          Your Dashboard
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '3rem', fontSize: '1.25rem' }}>
          Welcome back, {session?.user?.name || 'User'}. Start building your lineage below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '800px' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Add a New Entity</h2>
            
            {message && (
              <div style={{ 
                padding: '1rem', marginBottom: '2rem', borderRadius: 'var(--radius-sm)',
                backgroundColor: message.includes('Success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                color: message.includes('Success') ? '#2E7D32' : 'var(--color-primary-dark)'
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Entity Type</label>
                  <select 
                    name="type" value={formData.type} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                  >
                    <option value="PERSONAL">Standard Person</option>
                    <option value="SAINT">Saint / Guru</option>
                    <option value="KING">King / Royalty</option>
                    <option value="GOD">Deity / God</option>
                    <option value="FAMOUS_PERSON">Famous Historical Figure</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Gender</label>
                  <select 
                    name="gender" value={formData.gender} onChange={handleChange}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other / Divine</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Caste / Varna (Optional)</label>
                  <input 
                    type="text" name="caste" value={formData.caste} onChange={handleChange} placeholder="e.g. Brahmin, Kshatriya..."
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Gotra (Optional)</label>
                  <input 
                    type="text" name="gotra" value={formData.gotra} onChange={handleChange} placeholder="e.g. Kashyapa, Bharadwaja..."
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Historical / Biological Description</label>
                <textarea 
                  name="description" rows={4} value={formData.description} onChange={handleChange}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', resize: 'vertical' }} 
                />
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ justifyContent: 'center', marginTop: '1rem' }}>
                {isSubmitting ? 'Saving...' : 'Add Entity to Database'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
