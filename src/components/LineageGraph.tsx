"use client";

import React, { useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import EntityNode from './EntityNode';
import { EmergenceEdge, ConsortEdge } from './LineageEdges';
import { useRouter } from 'next/navigation';

const nodeTypes = {
  entity: EntityNode,
};

const edgeTypes = {
  emergence: EmergenceEdge,
  consort: ConsortEdge,
};

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  // nodesep = horizontal gap between node edges. ranksep = vertical gap between rows.
  dagreGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 120 });

  nodes.forEach((node) => {
    // Fixed width 160px + padding = ~180px rendered. Height ~60px.
    dagreGraph.setNode(node.id, { width: 180, height: 60 });
  });

  edges.forEach((edge) => {
    if (edge.type === 'consort') {
      // weight:2 = high priority same-rank edge, minlen:0 = same rank allowed
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
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 30,
      },
    };
  });

  return { nodes: newNodes, edges };
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
    // Navigate to the focus node to explore its lineage deeper
    router.push(`/tree/${node.id}`);
  }, [router]);

  if (!mounted) {
    return (
      <div style={{ width: '100%', height: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.08) 0%, transparent 60%), var(--color-bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
         <div style={{ opacity: 0.5, color: 'var(--color-primary-dark)' }}>Initializing Lineage Canvas...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '85vh', background: 'radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.08) 0%, transparent 60%), var(--color-bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
      <ReactFlow
        nodes={props.initialNodes}
        edges={props.initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        attributionPosition="bottom-right"
        className="touchdevice-flow"
        nodesDraggable={false}
        minZoom={0.2}
        maxZoom={4}
      >
        <Background gap={32} size={1} color="rgba(212, 175, 55, 0.15)" />
        <Controls showInteractive={false} style={{ display: 'flex', flexDirection: 'column' }} />
        
        <Panel position="top-right" style={{ background: 'rgba(255,255,255,0.65)', padding: '12px 16px', borderRadius: '12px', backdropFilter: 'blur(8px)', border: '1px solid rgba(212, 175, 55, 0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)', margin: '16px' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary-dark)', marginBottom: '8px', opacity: 0.8 }}>Legend</h3>
          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--color-text-main)', margin: 0, padding: 0 }}>
            <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}><span style={{ width: '18px', height: '2px', background: '#b1b1b7', marginRight: '8px' }}></span> Biological</li>
            <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'center' }}><span style={{ width: '18px', height: '0', borderTop: '2px dashed var(--color-primary)', marginRight: '8px' }}></span> Emergence</li>
            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: '18px', height: '2px', background: '#E91E63', marginRight: '8px', filter: 'drop-shadow(0 0 2px rgba(233, 30, 99, 0.3))' }}></span> Consort</li>
          </ul>
        </Panel>
      </ReactFlow>
    </div>
  );
}
