import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TreeDeciduous } from "lucide-react";
import ShareButton from "@/components/ShareButton";

export const dynamic = 'force-dynamic';

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      relationshipsAsSubject: { include: { object: true } },
      relationshipsAsObject: { include: { subject: true } }
    }
  });

  if (!person) {
    return notFound();
  }

  // Categorize relationships
  const parents = person.relationshipsAsObject.filter(r => r.type === "PARENT_OF").map(r => r.subject);
  const children = person.relationshipsAsSubject.filter(r => r.type === "PARENT_OF").map(r => r.object);
  
  const spouses = [
    ...person.relationshipsAsSubject.filter(r => r.type === "SPOUSE_OF").map(r => r.object),
    ...person.relationshipsAsObject.filter(r => r.type === "SPOUSE_OF").map(r => r.subject)
  ];

  const gurus = person.relationshipsAsObject.filter(r => r.type === "GURU_OF").map(r => r.subject);
  const disciples = person.relationshipsAsSubject.filter(r => r.type === "GURU_OF").map(r => r.object);

  const pastLives = person.relationshipsAsObject.filter(r => r.type === "PAST_LIFE_OF").map(r => r.subject);
  const futureLives = person.relationshipsAsSubject.filter(r => r.type === "PAST_LIFE_OF").map(r => r.object);

  const renderNode = (p: { id: string, name: string, type: string }, role: string, extraClass = "") => (
    <Link 
      href={`/tree/${p.id}`} 
      key={p.id} 
      className={`tree-node-circle ${p.type === 'GOD' ? 'divine' : ''} ${extraClass}`} 
      prefetch={false}
    >
      <div className="node-title">{role}</div>
      <div className="node-name">{p.name}</div>
      <div style={{ fontSize: '0.6rem', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
        {p.type.replace('_', ' ')}
      </div>
    </Link>
  );

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <div className="container" style={{ padding: '2rem 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <Link href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }} prefetch={false}>
            <ArrowLeft size={20} /> Back to Directory
          </Link>
          <ShareButton />
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', marginBottom: '1rem' }}>
            वंश-परम्परा
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Tracing the sacred lineage of <strong>{person.name}</strong></p>
        </div>
 
        <div className="tree-container">
          {/* Ancestors Level */}
          {(parents.length > 0 || gurus.length > 0 || pastLives.length > 0) && (
            <div className="tree-row-banyan">
              {pastLives.map(p => renderNode(p, "Past Life"))}
              {gurus.map(p => renderNode(p, "Guru"))}
              {parents.map(p => renderNode(p, "Parent"))}
            </div>
          )}

          {/* Central Level */}
          <div className="tree-row-banyan" style={{ zIndex: 20 }}>
            {renderNode(person, "Subject", "central")}
            
            {spouses.length > 0 && (
              <div style={{ display: 'flex', gap: '2rem', marginLeft: '2rem' }}>
                {spouses.map(p => renderNode(p, "Spouse"))}
              </div>
            )}
          </div>

          {/* Descendants Level */}
          {(children.length > 0 || disciples.length > 0 || futureLives.length > 0) && (
            <div className="tree-row-banyan">
              {children.map(p => renderNode(p, "Child"))}
              {disciples.map(p => renderNode(p, "Disciple"))}
              {futureLives.map(p => renderNode(p, "Reincarnation"))}
            </div>
          )}

          {/* Background Motif */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, pointerEvents: 'none' }}>
             <TreeDeciduous size={600} color="var(--color-accent)" />
          </div>
        </div>
      </div>

    </main>
  );
}
