import { Handle, Position } from '@xyflow/react';

export default function EntityNode({ data }: { data: any }) {
  const isDivine = data.type === 'GOD';
  const isCelestial = data.type === 'SAINT' || data.type === 'FAMOUS_PERSON';

  let borderStyle = '1px solid var(--color-border)';
  if (isDivine) borderStyle = '2px solid var(--color-secondary)'; // Gold border
  if (isCelestial) borderStyle = '1px solid rgba(255, 153, 51, 0.6)';

  let bgClass = 'rgba(var(--color-surface), 0.9)';
  if (isDivine) bgClass = 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 225, 0.9))';

  let glowClass = '';
  if (isDivine) glowClass = '0 0 20px rgba(212, 175, 55, 0.3)';
  if (isCelestial) glowClass = '0 0 15px rgba(255, 153, 51, 0.2)';

  return (
    <div 
      className="entity-node"
      style={{
        padding: '12px 20px',
        borderRadius: 'var(--radius-full)',
        background: bgClass,
        border: borderStyle,
        boxShadow: glowClass || '0 4px 10px rgba(0,0,0,0.05)',
        minWidth: '150px',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)'
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
      
      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-primary-dark)', marginBottom: '4px', fontWeight: 600 }}>
        {data.role || data.type}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
        {data.name}
      </div>

      {data.description && (
        <div className="node-tooltip">
          <strong>{data.name}</strong>
          <p>{data.description}</p>
        </div>
      )}
      
      {data.tags && data.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '6px' }}>
          {data.tags.map((tag: string) => (
             <span key={tag} style={{ fontSize: '0.55rem', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-secondary-dark)' }}>{tag}</span>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
    </div>
  );
}
