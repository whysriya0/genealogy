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
  dagreGraph.setGraph({ rankdir: direction, nodesep: 150, ranksep: 200, align: 'DL' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 120 });
  });

  edges.forEach((edge) => {
    if (edge.type === 'consort') {
      dagreGraph.setEdge(edge.source, edge.target, { weight: 0, minlen: 1 });
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
        x: nodeWithPosition.x - 125,
        y: nodeWithPosition.y - 60,
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

  // Define Nodes Array
  const rawNodes: any[] = [];
  const rawEdges: any[] = [];

  rawNodes.push({
    id: person.id,
    type: 'entity',
    data: { ...person, tags: ["Subject"] },
  });

  // Map Parents (Object = Parent, Subject = Me)
  // Wait, if I am the object, subject is the parent
  const parentRels = person.relationshipsAsObject.filter(r => r.type === "PARENT_OF");
  parentRels.forEach(rel => {
    rawNodes.push({ id: rel.subject.id, type: 'entity', data: { ...rel.subject } });
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
    rawNodes.push({ id: rel.object.id, type: 'entity', data: { ...rel.object } });
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
    rawNodes.push({ id: spouse.id, type: 'entity', data: { ...spouse } });
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
      <div className="container" style={{ padding: '2rem 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }} prefetch={false}>
            <ArrowLeft size={20} /> Back to Directory
          </Link>
          <ShareButton />
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
            वंश-परम्परा
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>Tracing the sacred lineage of <strong>{person.name}</strong></p>
        </div>
 
        <div style={{ flex: 1, minHeight: '70vh', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
           <LineageGraphWrapper initialNodes={nodes} initialEdges={edges} />
        </div>
      </div>
    </main>
  );
}
