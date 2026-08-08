import React from 'react';

export default function Button({ children, type = 'button', onClick, variant = 'primary', className = '', disabled = false, loading = false, ...rest }) {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none text-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-sky-655 hover:from-blue-500 hover:to-sky-555 text-white shadow-md shadow-blue-505/10 active:scale-[0.98] border border-blue-500/10",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-805 border border-slate-300/60 active:scale-[0.98]",
    danger: "bg-gradient-to-r from-red-655 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md active:scale-[0.98] border border-red-500/10",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-650 hover:text-slate-900"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : children}
    </button>
  );
}
