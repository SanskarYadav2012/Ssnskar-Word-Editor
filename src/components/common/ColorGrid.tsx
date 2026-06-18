import { useState } from 'react';

interface ColorGridProps {
  colors: string[];
  onPick: (color: string) => void;
  allowCustom?: boolean;
}

export function ColorGrid({ colors, onPick, allowCustom = true }: ColorGridProps) {
  const [custom, setCustom] = useState('#1d56d6');
  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPick(color)}
            className="h-6 w-6 rounded border border-app-border transition-transform hover:scale-110"
            style={{
              backgroundColor: color === 'transparent' ? 'transparent' : color,
              backgroundImage:
                color === 'transparent'
                  ? 'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%)'
                  : undefined,
              backgroundSize: color === 'transparent' ? '8px 8px' : undefined,
              backgroundPosition: color === 'transparent' ? '0 0,4px 4px' : undefined,
            }}
          />
        ))}
      </div>
      {allowCustom && (
        <div className="mt-2 flex items-center gap-2 border-t border-app-border pt-2">
          <input
            type="color"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="h-7 w-9 cursor-pointer rounded border border-app-border bg-transparent"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPick(custom)}
            className="flex-1 rounded-md bg-app-accent px-2 py-1 text-xs font-medium text-white hover:bg-app-accent-strong"
          >
            Apply custom
          </button>
        </div>
      )}
    </div>
  );
}
