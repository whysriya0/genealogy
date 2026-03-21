"use client";

import React, { useMemo, useEffect } from 'react';
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
  dagreGraph.setGraph({ rankdir: direction, nodesep: 150, ranksep: 200 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 250, height: 120 }); // rough dimensions of EntityNode
  });

  edges.forEach((edge) => {
    // Treat consort edges differently so they stay on same rank if possible
    if (edge.type === 'consort') {
      // Not typically supported by plain dagre to keep on exact same Y, but we pass anyway
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
        x: nodeWithPosition.x - 125, // offset by half width
        y: nodeWithPosition.y - 60,  // offset by half height
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
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
      <ReactFlow
        nodes={props.initialNodes}
        edges={props.initialEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
        className="touchdevice-flow"
        nodesDraggable={false}
      >
        <Background gap={24} size={2} color="rgba(212, 175, 55, 0.2)" />
        <Controls showInteractive={false} />
        
        <Panel position="top-left" style={{ background: 'rgba(255,255,255,0.8)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(4px)', border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>Legend</h3>
          <ul style={{ listStyle: 'none', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><span style={{ width: '24px', height: '2px', background: '#b1b1b7', marginRight: '10px' }}></span> Biological Lineage</li>
            <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}><span style={{ width: '24px', height: '0', borderTop: '2px dashed var(--color-primary)', marginRight: '10px' }}></span> Symbolic / Emergence</li>
            <li style={{ display: 'flex', alignItems: 'center' }}><span style={{ width: '24px', height: '2px', background: '#E91E63', marginRight: '10px', filter: 'drop-shadow(0 0 2px rgba(233, 30, 99, 0.5))' }}></span> Consort / Alliance</li>
          </ul>
        </Panel>
      </ReactFlow>
    </div>
  );
}
