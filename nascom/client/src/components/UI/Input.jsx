import React from 'react';

export default function Input({ label, type = 'text', value, onChange, placeholder = '', error = '', className = '', required = false, icon: Icon }) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-300 flex items-center gap-1 select-none">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 rounded-xl text-slate-100 placeholder-slate-500 text-sm glass-input`}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium pl-1">{error}</span>}
    </div>
  );
}
