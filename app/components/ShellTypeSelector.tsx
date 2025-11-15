'use client';

import { shellTypes, ShellType } from '../util/validators';

interface ShellTypeSelectorProps {
  selectedTypes: ShellType[];
  onChange: (types: ShellType[]) => void;
  mode?: 'single' | 'multiple';
}

const shellTypeLabels: Record<ShellType, string> = {
  shrimp: 'Shrimp',
  crab: 'Crab',
  lobster: 'Lobster',
  prawn: 'Prawn',
  crayfish: 'Crayfish',
  squid_pen: 'Squid Pen',
};

const shellTypeEmojis: Record<ShellType, string> = {
  shrimp: '🦐',
  crab: '🦀',
  lobster: '🦞',
  prawn: '🦐',
  crayfish: '🦞',
  squid_pen: '🦑',
};

export default function ShellTypeSelector({
  selectedTypes,
  onChange,
  mode = 'single',
}: ShellTypeSelectorProps) {
  const handleToggle = (type: ShellType) => {
    if (mode === 'single') {
      onChange([type]);
    } else {
      if (selectedTypes.includes(type)) {
        onChange(selectedTypes.filter((t) => t !== type));
      } else {
        onChange([...selectedTypes, type]);
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Shell Type{mode === 'multiple' ? 's' : ''}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {shellTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => handleToggle(type)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-ocean-500 bg-ocean-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-ocean-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-2xl">{shellTypeEmojis[type]}</span>
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-ocean-700' : 'text-gray-700'
                }`}>
                  {shellTypeLabels[type]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
