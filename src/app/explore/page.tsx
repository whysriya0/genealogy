"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Search, Loader2 } from 'lucide-react';
import ScrollReveal from "@/components/ScrollReveal";

const FEATURED_PORTALS = [
  { name: "Shiva Parivar", desc: "The divine family of Mount Kailash, encompassing Lord Shiva, Devi Parvati, Ganesha, and Kartikeya.", query: "Shiva" },
  { name: "Vishnu Dashavatara", desc: "The ten principal avatars of Lord Vishnu across the cosmic epochs (Yugas).", query: "Vishnu" },
  { name: "Suryavansha (Ramayana)", desc: "The illustrious Solar Dynasty of Lord Rama, tracing lineage back to the Sun God.", query: "Rama" }
];

const DIVINE_CATEGORIES = [
  {
    title: "Trimurti & Tridevi",
    items: [
      { name: "Brahma", tagline: "The Creator", query: "Brahma" },
      { name: "Vishnu", tagline: "The Preserver", query: "Vishnu" },
      { name: "Shiva", tagline: "The Destroyer", query: "Shiva" },
      { name: "Saraswati", tagline: "Goddess of Knowledge", query: "Saraswati" },
      { name: "Lakshmi", tagline: "Goddess of Wealth", query: "Lakshmi" },
      { name: "Parvati", tagline: "Goddess of Power", query: "Parvati" }
    ]
  },
  {
    title: "Divine Avatars",
    items: [
      { name: "Rama", tagline: "7th Avatar of Vishnu", query: "Rama" },
      { name: "Krishna", tagline: "8th Avatar of Vishnu", query: "Krishna" },
      { name: "Narasimha", tagline: "The Lion Avatar", query: "Narasimha" },
      { name: "Vamana", tagline: "The Dwarf Avatar", query: "Vamana" }
    ]
  },
  {
    title: "Celestial Beings",
    items: [
      { name: "Indra", tagline: "King of Heavens", query: "Indra" },
      { name: "Agni", tagline: "God of Fire", query: "Agni" },
      { name: "Vayu", tagline: "God of Wind", query: "Vayu" },
      { name: "Surya", tagline: "The Sun God", query: "Surya" }
    ]
  }
];

export default function ExplorePage() {
  const [persons, setPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResults = async () => {
    if (!searchQuery.trim()) {
      setPersons([]);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: searchQuery });
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
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="floating-dust" />
      <Navbar />

      <div className="container" style={{ padding: '4rem 24px', flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)' }}>
              Explore Divine Lineages
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', maxWidth: '600px', opacity: 0.8 }}>
              Navigate through the sacred families of gods, avatars, and mythological beings.
            </p>
          </div>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
            <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Search specific deities or eras..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-minimal"
            />
          </div>
        </div>

        {searchQuery.trim() ? (
          // Dynamic Search Results View
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '2rem', fontSize: '2rem' }}>Search Results</h2>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {persons.length === 0 ? (
                  <p style={{ color: 'var(--color-text-muted)' }}>No divine entities found matching your search.</p>
                ) : (
                  persons.map((person, i) => (
                    <ScrollReveal key={person.id} delay={i % 6 * 50}>
                      <div className="card-arch" style={{ padding: '2.5rem 2rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', border: '2px dashed var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>
                           <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>ॐ</span>
                        </div>
                        <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)' }}>{person.name}</h3>
                        <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '1.5rem' }}>{person.type.replace('_', ' ')}</span>
                        <p style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', flex: 1, marginBottom: '2rem', lineHeight: 1.6, opacity: 0.8 }}>
                          {person.description ? (person.description.length > 80 ? person.description.substring(0, 80) + '...' : person.description) : "Sacred lineage entry."}
                        </p>
                        <Link href={`/tree/${person.id}`} className="btn-secondary" style={{ width: '100%', textAlign: 'center' }} prefetch={false}>
                          View Tree
                        </Link>
                      </div>
                    </ScrollReveal>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          // Immersive Curated Gallery View
          <>
            <section style={{ marginBottom: '6rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {FEATURED_PORTALS.map((portal, idx) => (
                  <ScrollReveal key={portal.name} delay={idx * 150}>
                    <div 
                       onClick={() => setSearchQuery(portal.query)}
                       className="card-horizontal-portal"
                       style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>{portal.name}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{portal.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            {DIVINE_CATEGORIES.map((category, catIdx) => (
              <section key={category.title} style={{ marginBottom: '6rem' }}>
                <div className="section-divider">
                  <span className="section-divider-icon">✺</span>
                </div>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-accent)', marginBottom: '3rem' }}>
                  {category.title}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
                  {category.items.map((item, itemIdx) => (
                    <ScrollReveal key={item.name} delay={itemIdx * 100}>
                      <div 
                         onClick={() => setSearchQuery(item.query)}
                         className="card-arch"
                         style={{ cursor: 'pointer' }}
                      >
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', border: '2px dotted var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--color-secondary)', boxShadow: 'inset 0 0 15px rgba(255,153,51,0.2)' }}>
                           <span style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)' }}>ॐ</span>
                        </div>
                        <h3 style={{ fontSize: '2.25rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-main)' }}>{item.name}</h3>
                        <p style={{ color: 'var(--color-primary-dark)', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.5px' }}>{item.tagline}</p>
                        
                        <div className="hover-reveal">
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Click to reveal lineage</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
