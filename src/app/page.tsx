import Link from 'next/link';
import { ArrowRight, TreeDeciduous, Users, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ScrollReveal from '@/components/ScrollReveal';
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
        <div className={styles.lightRays}></div>
        <div className={styles.mandalaOverlay}></div>
        
        <div className={`container ${styles.heroLayout}`}>
          <ScrollReveal className={`${styles.heroContent} animate-fade-in`}>
            <div className={styles.badge}>
              <Sparkles size={16} /> Beta Release
            </div>
            <h1 className={styles.heroTitle} style={{ fontFamily: 'var(--font-display)' }}>
              <span className={styles.gradientText}>वंशवृक्ष</span> <br />
              <span style={{ fontSize: '0.6em', color: 'var(--color-text-main)' }}>The Living Heritage of Lineages</span>
            </h1>
            <div className={styles.heroDivider}>
               <span className={styles.heroDividerIcon}>✺</span>
            </div>
            <p className={styles.heroSubtitle}>
              From gods to generations — build, explore, and preserve your lineage through the sacred parampara of India.
            </p>
            <div className={styles.heroActions}>
              <Link href="/explore" className="btn-primary">
                Explore Divine Lineages
              </Link>
              <Link href="/dashboard" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', borderColor: 'var(--color-secondary)' }}>
                Create Your Family Tree
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal className={`${styles.heroVisual} animate-fade-in`} delay={200}>
            <div className={styles.centerpiecePlaceholder}>
              {/* Note: The image blends beautifully with a dark background or container behind it */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(10, 14, 26, 0.8) 0%, transparent 70%)', zIndex: -1, pointerEvents: 'none' }}></div>
              <img src="/banyan_tree_centerpiece.png" alt="Sacred Banyan Tree Illustration" className={styles.centerpieceImage} />
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Search Bar Section */}
      <section className={`${styles.searchSection} traditional-section border-rangoli-bottom`}>
        <div className="container">
          <ScrollReveal>
            <div className={`${styles.searchBox} glass-panel`}>
              <h2>Search Your Roots</h2>
              <div className={styles.searchFields}>
                <input type="text" placeholder="Gothra (e.g., Vashistha)" />
                <input type="text" placeholder="Region (e.g., Andhra Pradesh)" />
                <button className="btn-primary">Search Directory</button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider"><span className="section-divider-icon">✺</span></div>

      {/* Features Grid */}
      <section className={`${styles.featuresSection} border-rangoli-top border-rangoli-bottom`} id="features">
        <div className="container">
          <ScrollReveal className={styles.sectionHeader}>
            <h2 className={`${styles.sectionTitle} ${styles.gradientText}`}>Bridging Heritage & Technology</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>Advanced tools for the modern Indian family historian.</p>
          </ScrollReveal>
          
          <div className={styles.featuresGrid}>
            <ScrollReveal className={`${styles.featureCard} glass-panel`} delay={100}>
              <div className={styles.featureIcon}>
                <Users size={28} />
              </div>
              <h3>Complex Relationships</h3>
              <p>Easily map multiple spouses, adoptive parents, and extended Indian families including Gotra and Caste details.</p>
              {rama && (
                <Link href={`/tree/${rama.id}`} className="btn-secondary" style={{ marginTop: '1.5rem', padding: '8px 20px', fontSize: '0.875rem' }} prefetch={false}>
                  Explore Rama&apos;s Tree
                </Link>
              )}
            </ScrollReveal>

            <ScrollReveal className={`${styles.featureCard} glass-panel`} delay={200}>
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
            </ScrollReveal>

            <ScrollReveal className={`${styles.featureCard} glass-panel`} delay={300}>
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Divine Heritage Section */}
      <section className={`${styles.heritageSection} traditional-section`}>
        <div className="container">
          <div className={styles.splitContent}>
            <ScrollReveal className={styles.textContent}>
              <h2 style={{ color: 'var(--color-accent)' }}>Tracing the Parampara</h2>
              <p>From the first Rishis to the modern era, our digital archive is dedicated to preserving every strand of Indian heritage.</p>
              <ul className={styles.featureList}>
                <li>3000+ Sacred Lineages</li>
                <li>Vamsha & Gothra Tracking</li>
                <li>Temple Archive Integration</li>
              </ul>
              <Link href="/explore" className="btn-primary">Begin Your Search</Link>
            </ScrollReveal>
            <ScrollReveal className={styles.visualContent} delay={200}>
              <div className={styles.miniLineageGraph}>
                <svg className={styles.lineageConnections} viewBox="0 0 400 350" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="goldGradientLineage" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FF9933" />
                    </linearGradient>
                  </defs>
                  
                  {/* Marriage line between Shiva and Parvati */}
                  <path d="M 140 52 L 260 52" className={styles.lineagePath} />
                  
                  {/* Marriage Node Dot */}
                  <circle cx="200" cy="52" r="5" fill="#D4AF37" opacity="0.9" filter="drop-shadow(0 0 5px #FF9933)" />

                  {/* Path downwards to Child 1 (Ganesha) */}
                  <path d="M 200 52 L 200 125 Q 200 140, 185 140 L 115 140 Q 100 140, 100 155 L 100 210" className={styles.lineagePath} style={{ animationDelay: '1s' }} />
                  
                  {/* Path downwards to Child 2 (Kartikeya) */}
                  <path d="M 200 52 L 200 125 Q 200 140, 215 140 L 285 140 Q 300 140, 300 155 L 300 210" className={styles.lineagePath} style={{ animationDelay: '1s' }} />
                </svg>

                <div className={`${styles.lineageNode} ${styles.posShiva}`}>
                   <div className={styles.nodeIcon}>ॐ</div>
                   <span>Shiva</span>
                </div>
                <div className={`${styles.lineageNode} ${styles.posParvati}`}>
                   <div className={styles.nodeIcon}>❀</div>
                   <span>Parvati</span>
                </div>
                <div className={`${styles.lineageNode} ${styles.posGanesha}`}>
                   <div className={styles.nodeIcon}>✨</div>
                   <span>Ganesha</span>
                </div>
                <div className={`${styles.lineageNode} ${styles.posKartikeya}`}>
                   <div className={styles.nodeIcon}>🔱</div>
                   <span>Kartikeya</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>© 2026 Vamsha: Indian Genealogy Portal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
