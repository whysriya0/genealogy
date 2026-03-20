import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TreeDeciduous, Users, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const vishnu = await prisma.person.findFirst({ where: { name: "Lord Vishnu" } });
  const rama = await prisma.person.findFirst({ where: { name: "Lord Sri Rama" } });
  const vashistha = await prisma.person.findFirst({ where: { name: "Guru Vashistha" } });

  return (
    <main className={styles.main}>
      <Navbar />

      <header className={styles.hero}>
        <div className="container">
          <div className={`${styles.heroContent} animate-fade-in`}>
            <div className={styles.badge}>
              <Sparkles size={16} /> Beta Release
            </div>
            <h1 className={styles.heroTitle}>
              Discover Your <span className={styles.gradientText}>Divine</span> & Mortal Lineage
            </h1>
            <p className={styles.heroSubtitle}>
              The ultimate Indian genealogy portal. Map your family tree, discover historical roots, trace the past lives of deities, and follow the parampara of saints. 
            </p>
            <div className={styles.heroActions}>
              <Link href="/dashboard" className="btn-primary">
                Start Your Tree <ArrowRight size={20} />
              </Link>
              <Link href="/explore" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center' }}>
                Explore Directory
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements representing heritage/connections */}
        <div className={styles.heroBlobs}>
          <div className={styles.blob1}></div>
          <div className={styles.blob2}></div>
        </div>
      </header>

      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} glass-panel`}>
              <div className={styles.featureIcon}>
                <Users size={28} />
              </div>
              <h3>Complex Relationships</h3>
              <p>Easily map multiple spouses, adoptive parents, and extended Indian families including Gotra and Caste details.</p>
              {rama && (
                <Link href={`/tree/${rama.id}`} className="btn-secondary" style={{ marginTop: '1.5rem', padding: '8px 20px', fontSize: '0.875rem' }} prefetch={false}>
                  Explore Rama's Tree
                </Link>
              )}
            </div>
            <div className={`${styles.featureCard} glass-panel`} style={{animationDelay: '0.2s'}}>
              <div className={styles.featureIcon}>
                <Sparkles size={28} />
              </div>
              <h3>Divine Avatars</h3>
              <p>Document the past lives of Gods, tracing reincarnations and divine manifestations across different Yugas.</p>
              {vishnu && (
                <Link href={`/tree/${vishnu.id}`} className="btn-secondary" style={{ marginTop: '1.5rem', padding: '8px 20px', fontSize: '0.875rem' }} prefetch={false}>
                  Explore Divine Tree
                </Link>
              )}
            </div>
            <div className={`${styles.featureCard} glass-panel`} style={{animationDelay: '0.4s'}}>
              <div className={styles.featureIcon}>
                <TreeDeciduous size={28} />
              </div>
              <h3>Guru Parampara</h3>
              <p>Chart the spiritual lineage of Saints and Gurus, maintaining the sacred master-disciple relationships.</p>
              {vashistha && (
                <Link href={`/tree/${vashistha.id}`} className="btn-secondary" style={{ marginTop: '1.5rem', padding: '8px 20px', fontSize: '0.875rem' }} prefetch={false}>
                  Explore Parampara
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
