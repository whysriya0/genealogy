"use client";

import Link from 'next/link';
import { TreeDeciduous, Flower2 } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import styles from '../app/page.module.css';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
         <Link href="/" className={styles.logo}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TreeDeciduous size={32} color="var(--color-secondary)" />
              <Flower2 size={12} color="var(--color-primary)" style={{ position: 'absolute' }} />
            </div>
            <span className={styles.logoText} style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-accent)' }}>वंशवृक्ष</span>
          </Link>
        <div className={styles.navLinks}>
          <Link href="/explore">Explore Trees</Link>
          <Link href="/about">About</Link>
          {status === "loading" ? (
            <span style={{color: "var(--color-text-muted)"}}>Loading...</span>
          ) : session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/dashboard" style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                Dashboard
              </Link>
              <button 
                className="btn-secondary" 
                onClick={() => signOut()}
                style={{ padding: '8px 16px' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary" 
              onClick={() => signIn("google")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
