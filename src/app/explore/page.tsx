"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Search, Filter, Loader2 } from 'lucide-react';
import ScrollReveal from "@/components/ScrollReveal";

export default function ExplorePage() {
  const [persons, setPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'ALL',
    gender: 'ALL',
    gotra: '',
    caste: ''
  });

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: filters.type,
        gender: filters.gender,
        gotra: filters.gotra,
        caste: filters.caste
      });
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      setPersons(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 24px', flex: 1 }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
          Lineage Directory
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '800px' }}>
          Browse public figures, historical icons, deities, and saints. Use filters to trace specific Gothras or Varnas.
        </p>

        {/* Search & Filter Bar */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
              <input 
                type="text" 
                placeholder="Search by name, description, or lineage..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 3rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                style={{ padding: '10px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.875rem' }}
              >
                <option value="ALL">All Types</option>
                <option value="GOD">Deities</option>
                <option value="KING">Kings / Royalty</option>
                <option value="SAINT">Saints / Gurus</option>
                <option value="FAMOUS_PERSON">Famous Figures</option>
                <option value="PERSONAL">Personal Trees</option>
              </select>

              <input 
                type="text" 
                placeholder="Gothra" 
                value={filters.gotra}
                onChange={(e) => setFilters({...filters, gotra: e.target.value})}
                style={{ width: '150px', padding: '10px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {persons.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', gridColumn: '1 / -1', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Results Found</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              persons.map((person, i) => (
                <ScrollReveal key={person.id} delay={i % 6 * 50}>
                  <div className="glass-panel" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease' }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>{person.name}</h3>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '9999px', 
                        backgroundColor: 'rgba(var(--color-primary), 0.1)', color: 'var(--color-primary-dark)', 
                        fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' 
                      }}>
                        {person.type.replace('_', ' ')}
                      </span>
                      {person.gotra && (
                        <span style={{ 
                          padding: '4px 12px', borderRadius: '9999px', 
                          backgroundColor: 'rgba(107, 92, 82, 0.1)', color: 'var(--color-text-muted)', 
                          fontSize: '0.75rem', fontWeight: 600
                        }}>
                          {person.gotra}
                        </span>
                      )}
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', flex: 1, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      {person.description ? 
                        (person.description.length > 120 ? person.description.substring(0, 120) + '...' : person.description) 
                        : "No detailed historical context available for this entity yet."}
                    </p>
                    
                    <Link href={`/tree/${person.id}`} className="btn-secondary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', display: 'inline-flex', alignItems: 'center' }} prefetch={false}>
                      View Lineage
                    </Link>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
