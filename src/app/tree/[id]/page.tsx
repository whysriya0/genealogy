import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  const renderNode = (p: any, role: string) => (
    <Link href={`/tree/${p.id}`} key={p.id} className="tree-node" prefetch={false}>
      <div className="node-role">{role}</div>
      <div className="node-name">{p.name}</div>
      <div className="node-type">{p.type.replace('_', ' ')}</div>
    </Link>
  );

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <div className="container" style={{ padding: '2rem 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }} prefetch={false}>
            <ArrowLeft size={20} /> Back to Directory
          </Link>
          <ShareButton />
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Lineage of {person.name}</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{person.description}</p>
        </div>

        {/* Tree Container */}
        <div className="tree-container">
          
          {/* Top Level: Ancestors/Gurus/Past Lives */}
          <div className="tree-row">
            {(parents.length > 0 || gurus.length > 0 || pastLives.length > 0) ? (
              <div className="tree-group">
                {pastLives.map(p => renderNode(p, "Past Life"))}
                {gurus.map(p => renderNode(p, "Guru"))}
                {parents.map(p => renderNode(p, "Parent"))}
              </div>
            ) : (
              <div className="empty-node">Origins Unknown</div>
            )}
          </div>

          {/* Connection Line Down */}
          <div className="tree-line-vertical"></div>

          {/* Middle Level: Central Person and Spouses */}
          <div className="tree-row tree-middle-row">
            <div className="tree-node central-node">
              <div className="node-role">Subject</div>
              <div className="node-name">{person.name}</div>
              <div className="node-type">{person.type.replace('_', ' ')}</div>
              {(person.caste || person.gotra) && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
                  {person.caste} {person.gotra ? `• ${person.gotra}` : ''}
                </div>
              )}
            </div>

            {spouses.length > 0 && (
              <div className="spouses-group">
                <div className="tree-line-horizontal" />
                {spouses.map(p => renderNode(p, "Spouse"))}
              </div>
            )}
          </div>

          {/* Connection Line Down */}
          {children.length > 0 && <div className="tree-line-vertical"></div>}

          {/* Bottom Level: Descendants/Disciples */}
          <div className="tree-row">
            {(children.length > 0 || disciples.length > 0 || futureLives.length > 0) && (
               <div className="tree-group descendants-group">
                 {children.map(p => renderNode(p, "Child"))}
                 {disciples.map(p => renderNode(p, "Disciple"))}
                 {futureLives.map(p => renderNode(p, "Reincarnation"))}
               </div>
            )}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .tree-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: rgba(var(--color-surface), 0.5);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        
        .tree-row {
          display: flex;
          justify-content: center;
          width: 100%;
          position: relative;
        }

        .tree-middle-row {
          align-items: center;
          gap: 2rem;
        }

        .tree-group {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .spouses-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .descendants-group {
          position: relative;
          padding-top: 1rem;
        }

        .descendants-group::before {
          content: "";
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--color-primary-light);
        }
        
        .tree-node {
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          min-width: 180px;
          text-align: center;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .descendants-group .tree-node::before {
          content: "";
          position: absolute;
          top: -1rem;
          left: 50%;
          width: 2px;
          height: 1rem;
          background: var(--color-primary-light);
        }

        .tree-node:hover {
          transform: translateY(-5px);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }

        .central-node {
          border-color: var(--color-primary);
          background: linear-gradient(135deg, rgba(var(--color-surface), 1), rgba(var(--color-secondary), 0.05));
          transform: scale(1.1);
          box-shadow: var(--shadow-md);
        }
        
        .central-node:hover {
           transform: scale(1.15);
        }

        .node-role {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .node-name {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--color-text-main);
        }

        .node-type {
          font-size: 0.75rem;
          background: rgba(var(--color-primary), 0.1);
          color: var(--color-primary-dark);
          padding: 2px 8px;
          border-radius: 9999px;
          font-weight: 600;
        }

        .tree-line-vertical {
          width: 2px;
          height: 40px;
          background: var(--color-primary-light);
          margin: 0.5rem 0;
        }

        .tree-line-horizontal {
          width: 40px;
          height: 2px;
          background: var(--color-primary-light);
        }

        .empty-node {
          padding: 1rem 2rem;
          border: 1px dashed var(--color-border);
          border-radius: var(--radius-full);
          color: var(--color-text-muted);
          font-size: 0.875rem;
        }
      `}} />
    </main>
  );
}
