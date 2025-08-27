import React from "react";
import { User, Printer, IdCard, FileText } from "lucide-react"; 

/* print helpers (clean window) */
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
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji';
                 margin: 24px; color:#0f172a; }
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
  const createdAt = new Date();

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
    <div className="mx-auto max-w-[1208px] px-6 py-8">
      {/* Top tabs row + close */}
      <div className="relative flex items-center border-b border-slate-200 pb-2">
        <div className="tab tab-active">New Patient Registration</div>
        <div className="tab flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            1
          </span>
          Incoming ABHA Consent
        </div>
        <button
          type="button"
          className="ml-auto h-8 w-8 rounded-md text-slate-600 hover:bg-slate-100"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Status Card */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-700">Service Order Status</div>

        <div className="mt-2 flex items-center gap-2 text-[18px] font-semibold text-slate-900">
          Patient Registration Successful.
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
            ✓
          </span>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2 text-sm">
          <div>
            <span className="text-slate-600">UHID No : </span>
            <span className="font-semibold">{uhid}</span>
          </div>
          <div>
            <span className="text-slate-600">Bill No : </span>
            <span className="font-semibold">{billNo}</span>
          </div>
          <div className="pt-1 text-xs text-slate-500">
            Created at {createdAt.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" })}{" "}
            {createdAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} by System
          </div>
          <div className="text-xs text-slate-500">Transaction Ref No {txnId}</div>
        </div>
      </div>

      {/* Buttons row – centered */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-3 rounded-lg">
          <button type="button" className="btn" onClick={() => alert("Profile view placeholder")}>
            <User className="h-4 w-4" /> View Profile
          </button>

          <button type="button" className="btn" onClick={printReceipt}>
            <FileText className="h-4 w-4" /> Print Receipt
          </button>

          <button type="button" className="btn" onClick={printUHID}>
            <IdCard className="h-4 w-4" /> Print UHID Card
          </button>

          <button type="button" className="btn" onClick={printUHID}>
            <Printer className="h-4 w-4" /> Print UHID Card
          </button>
        </div>
      </div>
    </div>
  );
}
