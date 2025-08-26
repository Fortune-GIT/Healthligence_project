import React, { useRef, useState } from 'react';
import { Upload, Sliders } from './Icons';

const DOC_TYPES = ['Doc Type','Aadhar card','PAN card','Driving licence','Passport'];
const ACCEPT = ['image/jpeg','image/jpg','application/pdf'];

export default function FileUpload({ title='Upload Identity Proof', type='id', onChange }){
  const [selectedType, setSelectedType] = useState(DOC_TYPES[0]);
  const [items, setItems] = useState([]);
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPT.includes(file.type)){
      alert('Only JPG or PDF allowed.');
      inputRef.current.value = '';
      return;
    }
    const item = { id: crypto.randomUUID(), type: selectedType, name: file.name };
    const next = [...items, item];
    setItems(next);
    onChange?.(next);
    inputRef.current.value='';
  };

  const remove = (id) => {
    const next = items.filter(i=>i.id!==id);
    setItems(next);
    onChange?.(next);
  };

  return (
    <div className="col-span-6">
      {title ? <label className="block text-xs text-slate-600 mb-1">{title}</label> : null}
      <div className="flex items-center gap-2 relative">
        <button type="button" className="btn">
          {type === 'id' ? <Upload /> : <Sliders />} {type === 'id' ? 'Upload Identity Proof' : 'Upload Address Proof'}
          <input
            ref={inputRef}
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".jpg,.jpeg,.pdf"
            onChange={handleFile}
            aria-label={type === 'id' ? 'Upload Identity Proof' : 'Upload Address Proof'}
          />
        </button>
        <select className="select w-56" value={selectedType} onChange={(e)=>setSelectedType(e.target.value)}>
          {DOC_TYPES.map(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="mt-3 space-y-2">
        {items.map(i=> (
          <div key={i.id} className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" defaultChecked className="accent-blue-600" aria-label="uploaded okay" />
            <a className="text-blue-600 hover:underline">{i.name}</a>
            <span className="text-slate-500">Uploaded Successfully</span>
            <button
              type="button"
              className="ml-2 text-slate-500 hover:text-red-600"
              onClick={()=>remove(i.id)}
              title="remove"
              aria-label="remove file"
            >🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}
