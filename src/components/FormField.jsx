import React from 'react';
export default function FormField({ label, required=false, children, error='', className='' }){
  return (
    <div className={className}>
      <label className="block text-xs text-slate-600 mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  )
}
