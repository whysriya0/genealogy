import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import LineageGraphWrapper from "@/components/LineageGraph";
import dagre from 'dagre';

export const dynamic = 'force-dynamic';

function getLayoutedElements(nodes: any[], edges: any[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  // nodesep = horizontal gap between node edges. ranksep = vertical gap between rows.
  dagreGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 120 });

  nodes.forEach((node) => {
    // Fixed width 160px + 10px padding each side = ~180px rendered. Height ~60px.
    dagreGraph.setNode(node.id, { width: 180, height: 60 });
  });

  edges.forEach((edge) => {
    if (edge.type === 'consort') {
      // weight:2 = high priority, minlen:0 = same rank as spouse
      dagreGraph.setEdge(edge.source, edge.target, { weight: 2, minlen: 0 });
    } else {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: direction === 'TB' ? 'top' : 'left',
      sourcePosition: direction === 'TB' ? 'bottom' : 'right',
      position: {
        x: nodeWithPosition.x - 90,  // half of 180
        y: nodeWithPosition.y - 30,  // half of 60
      },
    };
  });

  return { nodes: newNodes, edges };
}

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

  // Next.js Server Components cannot pass Date objects to Client Components.
  // We must sanitize the Prisma output.
  const sanitizePerson = (p: any) => ({
    name: p.name,
    type: p.type,
    description: p.description,
  });

  // Define Nodes Array
  const rawNodes: any[] = [];
  const rawEdges: any[] = [];

  rawNodes.push({
    id: person.id,
    type: 'entity',
    data: { ...sanitizePerson(person), tags: ["Subject"] },
  });

  // Map Parents (Object = Parent, Subject = Me)
  // Wait, if I am the object, subject is the parent
  const parentRels = person.relationshipsAsObject.filter(r => r.type === "PARENT_OF");
  parentRels.forEach(rel => {
    rawNodes.push({ id: rel.subject.id, type: 'entity', data: { ...sanitizePerson(rel.subject) } });
    rawEdges.push({
      id: `e-${rel.subject.id}-${person.id}`,
      source: rel.subject.id,
      target: person.id,
      type: (rel as any).isBiological ? 'smoothstep' : 'emergence',
      data: { label: (rel as any).label },
      animated: !(rel as any).isBiological
    });
  });

  // Map Children (Subject = Me, Object = Child)
  const childRels = person.relationshipsAsSubject.filter(r => r.type === "PARENT_OF");
  childRels.forEach(rel => {
    rawNodes.push({ id: rel.object.id, type: 'entity', data: { ...sanitizePerson(rel.object) } });
    rawEdges.push({
      id: `e-${person.id}-${rel.object.id}`,
      source: person.id,
      target: rel.object.id,
      type: (rel as any).isBiological ? 'smoothstep' : 'emergence',
      data: { label: (rel as any).label },
      animated: !(rel as any).isBiological
    });
  });

  // Map Spouses
  const spouseRels = [
    ...person.relationshipsAsSubject.filter(r => r.type === "SPOUSE_OF").map(r => ({ spouse: r.object, rel: r, isSource: true })),
    ...person.relationshipsAsObject.filter(r => r.type === "SPOUSE_OF").map(r => ({ spouse: r.subject, rel: r, isSource: false }))
  ];
  
  spouseRels.forEach(({ spouse, rel, isSource }) => {
    rawNodes.push({ id: spouse.id, type: 'entity', data: { ...sanitizePerson(spouse) } });
    rawEdges.push({
      id: `e-${rel.id}`,
      source: isSource ? person.id : spouse.id,
      target: isSource ? spouse.id : person.id,
      type: 'consort'
    });
  });

  // Uniqueify nodes just in case of incest/duplicate relationships in mythological trees
  const uniqueNodesMap = new Map();
  rawNodes.forEach(n => uniqueNodesMap.set(n.id, n));
  const uniqueNodes = Array.from(uniqueNodesMap.values());

  // Run layouting algorithm
  const { nodes, edges } = getLayoutedElements(uniqueNodes, rawEdges);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <div style={{ padding: '0 2%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }} prefetch={false}>
              <ArrowLeft size={18} /> Back
            </Link>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', margin: 0, lineHeight: 1 }}>
                वंश-परम्परा
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0, marginTop: '2px' }}>Tracing the sacred lineage of <strong>{person.name}</strong></p>
            </div>
          </div>
          <ShareButton />
        </div>
 
        <div style={{ flex: 1, minHeight: '85vh', width: '100%', position: 'relative', marginTop: '1rem', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', overflow: 'hidden' }}>
           <LineageGraphWrapper initialNodes={nodes} initialEdges={edges} />
        </div>
      </div>
    </main>
  );
}
