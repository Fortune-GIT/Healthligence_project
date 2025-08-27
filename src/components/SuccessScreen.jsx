import React from "react";

export default function SuccessScreen({ uhid, billNo, txnId, onClose }) {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="tab tab-active">Service Order Status</div>
        <button
          type="button"
          className="btn-icon"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* status */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
          Patient Registration Successful.
          <span className="inline-block text-green-600">✔</span>
        </div>

        <div className="mt-4 text-sm text-slate-700">
          <div>
            <span className="font-medium">UHID No :</span> {uhid}
          </div>
          <div>
            <span className="font-medium">Bill No :</span> {billNo}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Transaction Ref No {txnId}
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn">
            View Profile
          </button>
          <button type="button" className="btn">
            Print Receipt
          </button>
          <button type="button" className="btn">
            Print UHID Card
          </button>
        </div>
      </div>
    </div>
  );
}
