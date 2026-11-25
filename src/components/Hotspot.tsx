import type { HotspotConfig } from '../types/game';

interface HotspotProps {
  config: HotspotConfig;
  onSelect: (id: HotspotConfig['id']) => void;
  disabled?: boolean;
}

export function Hotspot({ config, onSelect, disabled = false }: HotspotProps) {
  return (
    <button
      type="button"
      className="cabin-hotspot"
      style={{
        left: `${config.left}%`,
        top: `${config.top}%`,
        width: `${config.width}%`,
        height: `${config.height}%`,
        zIndex: config.zIndex ?? 2,
      }}
      onClick={() => {
        if (!disabled) onSelect(config.id);
      }}
      aria-label={`Inspect ${config.label}`}
      disabled={disabled}
    >
      <span className="cabin-hotspot-tooltip" aria-hidden="true">
        {config.label}
      </span>
    </button>
  );
}

