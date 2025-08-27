import React from "react";

/* Simple print helpers that open a clean print window */
function openPrintWindow(title, bodyHtml, onReadyDelayMs = 150) {
  const win = window.open("", "_blank", "noreferrer");
  if (!win) return;

  win.document.open();
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; margin: 24px; color:#0f172a; }
          .card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
          .title { font-weight:700; font-size:16px; margin-bottom:12px; }
          .row { display:flex; gap:16px; margin:8px 0; }
          .label { width:120px; color:#334155; }
          .value { font-weight:600; }
          .center { text-align:center; }
          .badge { display:inline-block; padding:4px 10px; border:1px solid #e5e7eb; border-radius:999px; font-size:12px; color:#475569; }
        </style>
      </head>
      <body>${bodyHtml}</body>
    </html>
  `);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
    win.close();
  }, onReadyDelayMs);
}

export default function SuccessScreen({ uhid, billNo, txnId, onClose }) {
  const printReceipt = () => {
    const html = `
      <div class="card">
        <div class="title">Patient Registration Receipt</div>
        <div class="row"><div class="label">UHID No:</div><div class="value">${uhid}</div></div>
        <div class="row"><div class="label">Bill No:</div><div class="value">${billNo}</div></div>
        <div class="row"><div class="label">Amount:</div><div class="value">₹200</div></div>
        <div class="row"><div class="label">Txn Ref:</div><div class="value">${txnId}</div></div>
        <div class="center" style="margin-top:16px;"><span class="badge">Thank you</span></div>
      </div>
    `;
    openPrintWindow("Receipt", html);
  };

  const printUHID = () => {
    const html = `
      <div class="card" style="width:360px">
        <div class="title center">UHID Card</div>
        <div class="row"><div class="label">UHID:</div><div class="value">${uhid}</div></div>
        <div class="row"><div class="label">Issued:</div><div class="value">${new Date().toLocaleDateString()}</div></div>
        <div class="center" style="margin-top:16px;"><span class="badge">Healthligence</span></div>
      </div>
    `;
    openPrintWindow("UHID Card", html);
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      {/* header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="tab tab-active">Service Order Status</div>
        <button type="button" className="btn-icon" aria-label="Close" onClick={onClose}>✕</button>
      </div>

      {/* status */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-lg font-semibold text-green-700">
          Patient Registration Successful. <span className="inline-block text-green-600">✔</span>
        </div>

        <div className="mt-4 text-sm text-slate-700">
          <div><span className="font-medium">UHID No :</span> {uhid}</div>
          <div><span className="font-medium">Bill No :</span> {billNo}</div>
          <div className="text-xs text-slate-500 mt-2">Transaction Ref No {txnId}</div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn" onClick={() => alert('Profile view placeholder')}>View Profile</button>
          <button type="button" className="btn" onClick={printReceipt}>Print Receipt</button>
          <button type="button" className="btn" onClick={printUHID}>Print UHID Card</button>
        </div>
      </div>
    </div>
  );
}
