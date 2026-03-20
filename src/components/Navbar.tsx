"use client";

import Link from 'next/link';
import { TreeDeciduous } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import styles from '../app/page.module.css';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
         <Link href="/" className={styles.logo}>
            <TreeDeciduous size={32} color="var(--color-primary)" />
            <span className={styles.logoText}>Vamsha</span>
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
