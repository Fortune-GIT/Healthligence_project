
import React from 'react';
import { Screen, Printer, IdCard, Check } from './Icons';

export default function SuccessScreen({ data }){
  return (
    <div className="max-w-[1208px] mx-auto my-8">
      <div className="card">
        <div className="flex border-b border-slate-200 bg-white">
          <div className="tab">New Patient Registration</div>
          <div className="tab tab-active flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">1</span>
            Incoming ABHA Consent
          </div>
          <div className="ml-auto p-3"><button className="btn">✕</button></div>
        </div>

        <div className="p-6">
          <div className="border border-dashed border-slate-200 rounded-md p-4">
            <div className="text-xs text-slate-600 mb-2 font-semibold">Service Order Status</div>
            <h3 className="font-semibold text-xl flex items-center gap-2">
              Patient Registration Succesfull.
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white"><Check/></span>
            </h3>
            <div className="mt-3 text-slate-600"><span className="font-medium">UHID No :</span> <span className="font-semibold">{data.uhid}</span></div>
            <div className="mt-1 text-slate-600"><span className="font-medium">Bill No :</span> <span className="font-semibold">{data.billNo}</span></div>
            <div className="mt-3 text-xs text-slate-500">Created at {new Date().toLocaleString()}</div>
            <div className="text-xs text-slate-500">Transaction Ref No : <strong>{data.txnId}</strong></div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="btn border-blue-600 text-blue-700"><Screen /> View Profile</button>
            <button className="btn"><Printer /> Print Receipt</button>
            <button className="btn"><IdCard /> Print UHID Card</button>
            <button className="btn"><IdCard /> Print UHID Card</button>
          </div>
        </div>
      </div>
    </div>
  )
}
