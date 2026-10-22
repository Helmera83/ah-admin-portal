export default function BrandLogo({ size = 36 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
        {/* Navy Left Block split diagonally */}
        <polygon points="12,12 44,12 12,54" fill="#10223f" />
        <polygon points="44,38 12,88 44,88" fill="#10223f" />
        {/* Teal Top Right Square */}
        <rect x="56" y="12" width="32" height="32" fill="#159e9c" />
        {/* Navy Bottom Right Square */}
        <rect x="56" y="56" width="32" height="32" fill="#10223f" />
      </svg>
      <div>
        <span className="brand-title">Administrative</span>
        <span className="brand-subtitle">Solutions</span>
      </div>
    </div>
  );
}