import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  id,
  disabled = false
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center cursor-pointer select-none ${
        disabled ? 'opacity-55 pointer-events-none' : ''
      }`}
    >
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 peer-checked:after:border-brand-600"></div>
    </label>
  );
};
