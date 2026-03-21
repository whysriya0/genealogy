import React from 'react';
import { BaseEdge, getSmoothStepPath, getBezierPath, EdgeProps } from '@xyflow/react';

// Emergence: Dashed straight vertical line with label pill
export function EmergenceEdge({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style = {}, markerEnd, data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 0,
  });

  const label = data?.label;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, strokeDasharray: '6,4', stroke: '#B8860B', strokeWidth: 1.5, opacity: 0.7 }} />
      {label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect x="-38" y="-10" width="76" height="20" fill="rgba(255, 248, 225, 0.95)" rx="10" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="0.5" />
          <text x="0" y="0" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: 8, fill: '#8B6914', fontWeight: 500, letterSpacing: '0.3px' }}>{label}</text>
        </g>
      )}
    </>
  );
}

// Consort: Short horizontal curved link with ring icon
export function ConsortEdge({
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style = {}, markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: '#C2185B', strokeWidth: 1.5, opacity: 0.6 }} />
      <g transform={`translate(${labelX}, ${labelY})`}>
        <text x="0" y="0" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: 10 }}>💍</text>
      </g>
    </>
  );
}
