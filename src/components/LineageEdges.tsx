import React from 'react';
import { BaseEdge, getBezierPath, EdgeProps } from '@xyflow/react';

export function EmergenceEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, strokeDasharray: '5,5', stroke: 'var(--color-primary)', strokeWidth: 2 }} />
      {label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect x="-40" y="-12" width="80" height="24" fill="rgba(255, 255, 255, 0.85)" rx="4" stroke="rgba(212, 175, 55, 0.3)" />
          <text 
            x="0" 
            y="0" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            style={{ fontSize: 10, fill: 'var(--color-primary-dark)', fontWeight: 600 }}
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
}

export function ConsortEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: '#E91E63', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(233, 30, 99, 0.3))' }} />
      <g transform={`translate(${labelX}, ${labelY})`}>
         <text x="0" y="0" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: 14 }}>💍</text>
      </g>
    </>
  );
}
