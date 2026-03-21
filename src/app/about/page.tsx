import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 24px', flex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
          About वंशवृक्ष
        </h1>
        
        <div className="card-heritage" style={{ padding: '3rem', fontSize: '1.125rem', lineHeight: 1.8, backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
            Welcome to <strong>वंशवृक्ष (Vanshvriksha) – The Living Heritage of Lineages</strong>. Our platform is elegantly crafted to capture the profound and culturally significant relationships found throughout Indian history, mythology, and modern family structures.
          </p>
          
          <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>Why We Built This</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
            Western genealogy tools often fail to capture the nuances of Indian heritage. They assume a simple parent-child-spouse structure. However, Indian history involves:
          </p>
          <ul style={{ paddingLeft: '2rem', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Divine Avatars:</strong> Tracking the past lives and reincarnations of deities across different Yugas.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Guru Parampara:</strong> Charting the spiritual lineage of Saints and Disciples, which is often considered as important as blood relations.</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Complex Households:</strong> Properly representing historical kings with multiple consorts or intricate adoptive relationships.</li>
            <li><strong>Cultural Metadata:</strong> Preserving the Varna, Jati, and Gotra information that has historically defined alliances and communities.</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--color-primary-dark)' }}>Getting Started</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
            To begin tracing your own lineage, simply <strong>Sign In</strong> using your preferred account. You can then effortlessly navigate to your Dashboard to connect with your roots and add stories, social links, and family members. 
          </p>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Join our community-driven tapestry of history, where your personal tree intertwines with the grand legacy of sages, kings, and deities.
          </p>
        </div>
      </div>
    </main>
  );
}
