"use client";

import React, { useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EntityNode from './EntityNode';
import { EmergenceEdge, ConsortEdge } from './LineageEdges';
import { useRouter } from 'next/navigation';

// Group label node — a subtle text banner for "Manasaputras (Mind-born Sons)" etc.
function GroupLabelNode({ data }: { data: any }) {
  return (
    <div style={{
      padding: '4px 18px',
      borderRadius: '20px',
      background: 'rgba(212, 175, 55, 0.08)',
      border: '1px dashed rgba(212, 175, 55, 0.3)',
      textAlign: 'center',
      fontSize: '0.7rem',
      fontWeight: 600,
      color: '#8B6914',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = {
  entity: EntityNode,
  groupLabel: GroupLabelNode,
};

const edgeTypes = {
  emergence: EmergenceEdge,
  consort: ConsortEdge,
};

interface LineageGraphProps {
  initialNodes: any[];
  initialEdges: any[];
}

export default function LineageGraphWrapper(props: LineageGraphProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onNodeClick = React.useCallback((event: any, node: any) => {
    if (node.type === 'groupLabel') return; // Don't navigate on label clicks
    router.push(`/tree/${node.id}`);
  }, [router]);

  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ opacity: 0.4, color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>Loading lineage...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '88vh', background: 'radial-gradient(ellipse at 50% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 50%), var(--color-bg)' }}>
      <ReactFlow
        nodes={props.initialNodes}
        edges={props.initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        attributionPosition="bottom-right"
        nodesDraggable={false}
        minZoom={0.15}
        maxZoom={3}
        defaultEdgeOptions={{ style: { stroke: 'rgba(180, 160, 120, 0.4)', strokeWidth: 1.5 } }}
      >
        <Background gap={40} size={0.5} color="rgba(212, 175, 55, 0.1)" />
        <Controls showInteractive={false} />

        <Panel position="top-right" style={{ background: 'rgba(255,255,255,0.5)', padding: '8px 12px', borderRadius: '10px', backdropFilter: 'blur(8px)', border: '1px solid rgba(212, 175, 55, 0.1)', margin: '8px', opacity: 0.8 }}>
          <ul style={{ listStyle: 'none', fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}><span style={{ width: '14px', height: '1.5px', background: 'rgba(180,160,120,0.5)', marginRight: '6px' }}></span>Biological</li>
            <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}><span style={{ width: '14px', height: '0', borderTop: '1.5px dashed #B8860B', marginRight: '6px' }}></span>Emergence</li>
            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: '14px', height: '1.5px', background: '#C2185B', marginRight: '6px' }}></span>Consort</li>
          </ul>
        </Panel>
      </ReactFlow>
    </div>
  );
}
