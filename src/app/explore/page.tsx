import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const persons = await prisma.person.findMany({
    where: {
      type: { in: ['GOD', 'KING', 'SAINT', 'FAMOUS_PERSON'] }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 24px', flex: 1 }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
          Explore the Divine Directory
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '800px' }}>
          Browse public figures, historical icons, deities, and saints that have been added to the Vamsha network by our community.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {persons.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', gridColumn: '1 / -1', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Public Entities Found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Sign in and be the first to start documenting our rich heritage.</p>
            </div>
          ) : (
            persons.map((person) => (
              <div key={person.id} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)' }}>{person.name}</h3>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '9999px', 
                    backgroundColor: 'rgba(var(--color-primary), 0.1)', color: 'var(--color-primary-dark)', 
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' 
                  }}>
                    {person.type.replace('_', ' ')}
                  </span>
                  {person.caste && (
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '9999px', 
                      backgroundColor: 'rgba(var(--color-secondary), 0.15)', color: 'var(--color-secondary-dark)', 
                      fontSize: '0.75rem', fontWeight: 600
                    }}>
                      {person.caste}
                    </span>
                  )}
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
                    : "No historical or biographical description provided yet."}
                </p>
                
                <Link href={`/tree/${person.id}`} className="btn-secondary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center', display: 'inline-flex', alignItems: 'center' }} prefetch={false}>
                  {person.type === 'GOD' ? "View God's Tree" : 
                   person.type === 'KING' ? "View Royal Lineage" : 
                   person.type === 'SAINT' ? "View Guru Parampara" : 
                   "View Family Tree"}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
