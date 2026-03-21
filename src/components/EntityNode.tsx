import { Handle, Position } from '@xyflow/react';

export default function EntityNode({ data }: { data: any }) {
  const isDivine = data.type === 'GOD';
  const isCelestial = data.type === 'SAINT' || data.type === 'FAMOUS_PERSON';
  const size = data.size || 'medium'; // 'large' | 'medium' | 'small'

  // Size-dependent styling
  const sizeStyles: Record<string, any> = {
    large: { width: '180px', padding: '14px 16px', fontSize: '1.1rem', roleSize: '0.65rem', glow: isDivine ? '0 0 30px rgba(212, 175, 55, 0.45), 0 0 60px rgba(212, 175, 55, 0.15)' : '0 4px 15px rgba(0,0,0,0.08)' },
    medium: { width: '150px', padding: '10px 14px', fontSize: '0.95rem', roleSize: '0.6rem', glow: isDivine ? '0 0 20px rgba(212, 175, 55, 0.3)' : '0 4px 10px rgba(0,0,0,0.05)' },
    small: { width: '130px', padding: '8px 10px', fontSize: '0.85rem', roleSize: '0.55rem', glow: isCelestial ? '0 0 12px rgba(255, 153, 51, 0.15)' : '0 2px 6px rgba(0,0,0,0.04)' },
  };
  const s = sizeStyles[size] || sizeStyles.medium;

  let borderStyle = '1px solid rgba(200, 180, 140, 0.4)';
  if (isDivine) borderStyle = size === 'large' ? '2.5px solid var(--color-secondary)' : '2px solid var(--color-secondary)';
  if (isCelestial) borderStyle = '1px solid rgba(255, 153, 51, 0.5)';

  let bg = 'rgba(255, 255, 255, 0.85)';
  if (isDivine) bg = 'linear-gradient(135deg, rgba(255, 255, 255, 0.97), rgba(255, 248, 225, 0.92))';

  return (
    <div
      className="entity-node"
      style={{
        padding: s.padding,
        borderRadius: '14px',
        background: bg,
        border: borderStyle,
        boxShadow: s.glow,
        width: s.width,
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />

      <div style={{ fontSize: s.roleSize, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-primary-dark)', marginBottom: '2px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.7 }}>
        {data.role || data.type}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: s.fontSize, fontWeight: 700, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {data.name}
      </div>

      {data.tags && data.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
          {data.tags.map((tag: string) => (
            <span key={tag} style={{ fontSize: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', padding: '1px 5px', borderRadius: '3px', color: 'var(--color-secondary-dark)' }}>{tag}</span>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
    </div>
  );
}
