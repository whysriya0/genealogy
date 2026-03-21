import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import LineageGraphWrapper from "@/components/LineageGraph";
import dagre from 'dagre';

export const dynamic = 'force-dynamic';

// Node sizes: large=180w, medium=150w, small=130w
const NODE_DIMS: Record<string, { w: number; h: number }> = {
  large: { w: 200, h: 70 },
  medium: { w: 170, h: 60 },
  small: { w: 150, h: 55 },
  label: { w: 220, h: 30 },
};

function getLayoutedElements(nodes: any[], edges: any[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, nodesep: 40, ranksep: 100 });

  nodes.forEach((node) => {
    const size = node.data?.size || 'medium';
    const dim = NODE_DIMS[size] || NODE_DIMS.medium;
    dagreGraph.setNode(node.id, { width: dim.w, height: dim.h });
  });

  edges.forEach((edge) => {
    if (edge.type === 'consort') {
      dagreGraph.setEdge(edge.source, edge.target, { weight: 2, minlen: 0 });
    } else {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const size = node.data?.size || 'medium';
    const dim = NODE_DIMS[size] || NODE_DIMS.medium;
    return {
      ...node,
      targetPosition: direction === 'TB' ? 'top' : 'left',
      sourcePosition: direction === 'TB' ? 'bottom' : 'right',
      position: {
        x: nodeWithPosition.x - dim.w / 2,
        y: nodeWithPosition.y - dim.h / 2,
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

  const sanitizePerson = (p: any) => ({
    name: p.name,
    type: p.type,
    description: p.description,
  });

  const rawNodes: any[] = [];
  const rawEdges: any[] = [];

  // Subject node — LARGE with emphasis
  rawNodes.push({
    id: person.id,
    type: 'entity',
    data: { ...sanitizePerson(person), size: 'large', tags: ["Subject"] },
  });

  // Parents — MEDIUM (context)
  const parentRels = person.relationshipsAsObject.filter(r => r.type === "PARENT_OF");
  parentRels.forEach(rel => {
    rawNodes.push({ id: rel.subject.id, type: 'entity', data: { ...sanitizePerson(rel.subject), size: 'medium' } });
    rawEdges.push({
      id: `e-${rel.subject.id}-${person.id}`,
      source: rel.subject.id,
      target: person.id,
      type: (rel as any).isBiological === false ? 'emergence' : 'smoothstep',
      data: { label: (rel as any).label },
      animated: (rel as any).isBiological === false,
    });
  });

  // Children — SMALL (uniform)
  const childRels = person.relationshipsAsSubject.filter(r => r.type === "PARENT_OF");

  // If there are 3+ children, add a grouping label node
  if (childRels.length >= 3) {
    const allSameLabel = childRels.every(r => (r as any).label === (childRels[0] as any).label);
    const groupLabel = allSameLabel && (childRels[0] as any).label
      ? (childRels[0] as any).label === 'Mind-born Son' ? 'Manasaputras (Mind-born Sons)' : (childRels[0] as any).label + 's'
      : `${childRels.length} Children`;

    const groupId = `group-${person.id}-children`;
    rawNodes.push({
      id: groupId,
      type: 'groupLabel',
      data: { label: groupLabel },
    });
    // Edge from subject to group label
    rawEdges.push({
      id: `e-${person.id}-${groupId}`,
      source: person.id,
      target: groupId,
      type: (childRels[0] as any).isBiological === false ? 'emergence' : 'smoothstep',
    });
    // Edges from group label to each child
    childRels.forEach(rel => {
      rawNodes.push({ id: rel.object.id, type: 'entity', data: { ...sanitizePerson(rel.object), size: 'small' } });
      rawEdges.push({
        id: `e-${groupId}-${rel.object.id}`,
        source: groupId,
        target: rel.object.id,
        type: (rel as any).isBiological === false ? 'emergence' : 'smoothstep',
      });
    });
  } else {
    childRels.forEach(rel => {
      rawNodes.push({ id: rel.object.id, type: 'entity', data: { ...sanitizePerson(rel.object), size: 'small' } });
      rawEdges.push({
        id: `e-${person.id}-${rel.object.id}`,
        source: person.id,
        target: rel.object.id,
        type: (rel as any).isBiological === false ? 'emergence' : 'smoothstep',
        data: { label: (rel as any).label },
        animated: (rel as any).isBiological === false,
      });
    });
  }

  // Spouses — MEDIUM
  const spouseRels = [
    ...person.relationshipsAsSubject.filter(r => r.type === "SPOUSE_OF").map(r => ({ spouse: r.object, rel: r, isSource: true })),
    ...person.relationshipsAsObject.filter(r => r.type === "SPOUSE_OF").map(r => ({ spouse: r.subject, rel: r, isSource: false }))
  ];

  spouseRels.forEach(({ spouse, rel, isSource }) => {
    rawNodes.push({ id: spouse.id, type: 'entity', data: { ...sanitizePerson(spouse), size: 'medium' } });
    rawEdges.push({
      id: `e-${rel.id}`,
      source: isSource ? person.id : spouse.id,
      target: isSource ? spouse.id : person.id,
      type: 'consort'
    });
  });

  // Avatars / Incarnations (PAST_LIFE_OF)  —  Subject = Source deity, Object = Avatar
  const avatarRels = person.relationshipsAsSubject.filter(r => r.type === "PAST_LIFE_OF");
  if (avatarRels.length > 0) {
    const groupId = `group-${person.id}-avatars`;
    const groupLabel = avatarRels.length === 10 ? 'Dashavatara (Ten Avatars)' : `${avatarRels.length} Avatars`;
    rawNodes.push({ id: groupId, type: 'groupLabel', data: { label: groupLabel, size: 'label' } });
    rawEdges.push({
      id: `e-${person.id}-${groupId}`,
      source: person.id,
      target: groupId,
      type: 'emergence',
      data: { label: 'Incarnations' },
    });
    avatarRels.forEach(rel => {
      rawNodes.push({ id: rel.object.id, type: 'entity', data: { ...sanitizePerson(rel.object), size: 'small' } });
      rawEdges.push({
        id: `e-${groupId}-${rel.object.id}`,
        source: groupId,
        target: rel.object.id,
        type: 'emergence',
        data: { label: 'Avatar' },
      });
    });
  }

  // Also if this entity IS an avatar (someone's past life), show the source deity
  const sourceDeityRels = person.relationshipsAsObject.filter(r => r.type === "PAST_LIFE_OF");
  sourceDeityRels.forEach(rel => {
    rawNodes.push({ id: rel.subject.id, type: 'entity', data: { ...sanitizePerson(rel.subject), size: 'large' } });
    rawEdges.push({
      id: `e-${rel.subject.id}-${person.id}-avatar`,
      source: rel.subject.id,
      target: person.id,
      type: 'emergence',
      data: { label: 'Avatar' },
      animated: true,
    });
  });

  // De-duplicate nodes
  const uniqueNodesMap = new Map();
  rawNodes.forEach(n => uniqueNodesMap.set(n.id, n));
  const uniqueNodes = Array.from(uniqueNodesMap.values());

  const { nodes, edges } = getLayoutedElements(uniqueNodes, rawEdges);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <div style={{ padding: '0 2%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }} prefetch={false}>
              <ArrowLeft size={16} /> Back
            </Link>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', margin: 0, lineHeight: 1 }}>
                वंश-परम्परा
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0, marginTop: '2px' }}>Sacred lineage of <strong>{person.name}</strong></p>
            </div>
          </div>
          <ShareButton />
        </div>

        <div style={{ flex: 1, minHeight: '88vh', width: '100%', position: 'relative', overflow: 'hidden' }}>
           <LineageGraphWrapper initialNodes={nodes} initialEdges={edges} />
        </div>
      </div>
    </main>
  );
}
