import React, { useEffect, useMemo, useState } from "react";
import FormField, { FloatingInput, TinyBox } from "./FormField";
import FileUpload from "./FileUpload";
import SuccessScreen from "./SuccessScreen";
import { validateField } from "../utils/validation";
import { Camera } from "./Icons";

const genders = ["Female", "Male", "Others"];
const commPrefs = ["Odia", "English", "Hindi"];
const INNER_W = "w-full max-w-[1189px]";

/* ---------- Age <-> DOB helpers ---------- */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const pad2 = (n) => String(n).padStart(2, "0");

function formatISO(d) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}
function daysInMonth(year, monthZeroBased) {
  return new Date(year, monthZeroBased + 1, 0).getDate();
}
function dobFromAgeParts(yy = 0, mm = 0, dd = 0) {
  const y = parseInt(yy || 0, 10);
  const m = parseInt(mm || 0, 10);
  const d = parseInt(dd || 0, 10);
  const now = new Date();
  return new Date(
    now.getFullYear() - clamp(y, 0, 120),
    now.getMonth() - clamp(m, 0, 11),
    now.getDate() - clamp(d, 0, 31)
  );
}
function agePartsFromDOB(iso) {
  const [Y, M, D] = iso.split("-").map((x) => parseInt(x || 0, 10));
  if (!Y || !M || !D) return { yy: "", mm: "", dd: "" };

  const today = new Date();
  const dob = new Date(Y, M - 1, D);

  let yy = today.getFullYear() - dob.getFullYear();
  let mm = today.getMonth() - dob.getMonth();
  let dd = today.getDate() - dob.getDate();

  if (dd < 0) {
    mm -= 1;
    const prevMonth = mm >= 0 ? mm : 12 + mm;
    const prevYear = mm >= 0 ? today.getFullYear() : today.getFullYear() - 1;
    dd += daysInMonth(prevYear, prevMonth);
  }
  if (mm < 0) {
    yy -= 1;
    mm += 12;
  }

  yy = clamp(yy, 0, 120);
  mm = clamp(mm, 0, 11);
  dd = clamp(dd, 0, 31);
  return { yy: String(yy), mm: String(mm), dd: String(dd) };
}
const onlyDigits = (s) => (s ?? "").replace(/\D/g, "");

/* -------------------------------------------------- */

export default function RegistrationForm() {
  const [values, setValues] = useState({
    mobile: "",
    firstName: "",
    lastName: "",
    gender: "Female",

    // simple "age" to keep your existing validator happy (synced to ageYY)
    age: "",
    dob: "",

    email: "",
    address1: "",
    address2: "",
    pin: "",
    area: "",
    city: "",
    district: "",
    state: "",
    primaryRegNo: "",
    nextKin: "",
    attendantRel: "",
    attendantName: "",

    // UI parts
    ageYY: "",
    ageMM: "",
    ageDD: "",
    dobYY: "",
    dobMM: "",
    dobDD: "",
  });

  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(true);
  const [comm, setComm] = useState("Odia");
  const [idProofs, setIdProofs] = useState([]);
  const [addressProofs, setAddressProofs] = useState([]);
  const [kycVerified, setKycVerified] = useState(false);
  const [kycDocType, setKycDocType] = useState("");

  // success screen
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const set = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  /* ---------- Age parts -> DOB (and sync "age") ---------- */
  useEffect(() => {
    const { ageYY, ageMM, ageDD } = values;
    const hasAny = !!ageYY || !!ageMM || !!ageDD;

    // keep simple "age" (0–120) in sync with Year
    if (ageYY !== values.age) set("age", ageYY || "");
    if (!hasAny) return;

    const iso = formatISO(dobFromAgeParts(ageYY, ageMM, ageDD));
    if (iso !== values.dob) set("dob", iso);

    const [y, m, d] = iso.split("-");
    if (y !== values.dobYY) set("dobYY", y);
    if (m !== values.dobMM) set("dobMM", m);
    if (d !== values.dobDD) set("dobDD", d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.ageYY, values.ageMM, values.ageDD]);

  /* ---------- DOB parts -> Age parts (and sync "age") ---------- */
  useEffect(() => {
    const { dobYY, dobMM, dobDD } = values;
    if (!dobYY && !dobMM && !dobDD) return;

    if (dobYY && dobMM && dobDD) {
      const iso = `${dobYY}-${dobMM}-${dobDD}`;
      if (iso !== values.dob) set("dob", iso);

      const p = agePartsFromDOB(iso);
      if (p.yy !== values.ageYY) set("ageYY", p.yy);
      if (p.mm !== values.ageMM) set("ageMM", p.mm);
      if (p.dd !== values.ageDD) set("ageDD", p.dd);
      if (p.yy !== values.age) set("age", p.yy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.dobYY, values.dobMM, values.dobDD]);

  /* ---------- direct DOB string change -> sync age ---------- */
  useEffect(() => {
    if (!values.dob) return;
    const p = agePartsFromDOB(values.dob);
    if (p.yy !== values.ageYY) set("ageYY", p.yy);
    if (p.mm !== values.ageMM) set("ageMM", p.mm);
    if (p.dd !== values.ageDD) set("ageDD", p.dd);
    if (p.yy !== values.age) set("age", p.yy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.dob]);

  /* ---------- validation ---------- */
  const onBlurField =
    (name) =>
    (e) =>
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, e.target.value),
      }));

  const validateRequired = () => {
    const next = { ...errors };
    next.mobile = validateField("mobile", values.mobile);
    next.firstName = validateField("firstName", values.firstName);
    next.lastName = validateField("lastName", values.lastName);

    // need age or full dob
    if (!values.age && !(values.dobYY && values.dobMM && values.dobDD)) {
      next.age = "Provide age or DOB.";
      next.dob = "Provide DOB or age.";
    } else {
      if (values.age) next.age = validateField("age", values.age);
      if (values.dobYY && values.dobMM && values.dobDD) {
        // ✅ use slashes to satisfy regex: YY/MM/DD or YYYY/MM/DD
        next.dob = validateField(
          "dob",
          `${values.dobYY}/${values.dobMM}/${values.dobDD}`
        );
      } else next.dob = "";
    }

    next.pin = validateField("pin", values.pin);
    next.nextKin = validateField("nextKin", values.nextKin);
    next.email = validateField("email", values.email);

    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  const canSubmit = useMemo(() => {
    const hasAgeOrDob =
      !!values.age ||
      (!!values.dobYY && !!values.dobMM && !!values.dobDD);

    const minimal =
      values.mobile &&
      values.firstName &&
      values.lastName &&
      values.pin &&
      values.nextKin &&
      hasAgeOrDob;

    const hasId = idProofs.length > 0;
    const noErrors = Object.values(errors).every((e) => !e);
    return minimal && hasId && noErrors;
  }, [values, errors, idProofs]);

  /* ---------- AGE & DOB INPUTS: type freely, clamp on blur ---------- */
  // AGE
  const onAgeYY = (v) => set("ageYY", onlyDigits(v).slice(0, 3));
  const onAgeYYBlur = () => {
    if (values.ageYY === "") return;
    const n = clamp(parseInt(values.ageYY, 10), 0, 120);
    set("ageYY", String(isNaN(n) ? "" : n));
  };
  const onAgeMM = (v) => set("ageMM", onlyDigits(v).slice(0, 2));
  const onAgeMMBlur = () => {
    if (values.ageMM === "") return;
    const n = clamp(parseInt(values.ageMM, 10), 0, 11); // 0–11 months
    set("ageMM", String(isNaN(n) ? "" : n));
  };
  const onAgeDD = (v) => set("ageDD", onlyDigits(v).slice(0, 2));
  const onAgeDDBlur = () => {
    if (values.ageDD === "") return;
    const n = clamp(parseInt(values.ageDD, 10), 0, 31);
    set("ageDD", String(isNaN(n) ? "" : n));
  };

  // DOB
  const onDobYY = (v) => set("dobYY", onlyDigits(v).slice(0, 4));
  const onDobYYBlur = () => {
    if (values.dobYY === "") return;
    const year = clamp(
      parseInt(values.dobYY, 10),
      1900,
      new Date().getFullYear()
    );
    set("dobYY", String(isNaN(year) ? "" : year));
  };
  const onDobMM = (v) => set("dobMM", onlyDigits(v).slice(0, 2));
  const onDobMMBlur = () => {
    if (values.dobMM === "") return;
    const n = clamp(parseInt(values.dobMM, 10), 1, 12);
    set("dobMM", isNaN(n) ? "" : pad2(n));
  };
  const onDobDD = (v) => set("dobDD", onlyDigits(v).slice(0, 2));
  const onDobDDBlur = () => {
    if (values.dobDD === "") return;
    const year = parseInt(values.dobYY, 10) || new Date().getFullYear();
    const monthIdx = (parseInt(values.dobMM, 10) || 1) - 1; // 0-based
    const maxDay = daysInMonth(year, clamp(monthIdx, 0, 11));
    const n = clamp(parseInt(values.dobDD, 10), 1, maxDay);
    set("dobDD", isNaN(n) ? "" : pad2(n));
  };

  /* ---------- submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateRequired()) return;
    if (idProofs.length === 0) {
      alert("Please upload at least one ID proof.");
      return;
    }

    const rand = (len) =>
      Array.from(crypto.getRandomValues(new Uint32Array(len)))
        .map((n) => (n % 36).toString(36))
        .join("")
        .toUpperCase();

    const payload = {
      ...values,
      consent,
      comm,
      kycVerified,
      idProofs,
      addressProofs,
      kycDocType,
      uhid: `IGH-${rand(7)}`,
      billNo: `FB${rand(8)}`,
      txnId: `TRX${rand(10)}`,
    };
    setResult(payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SuccessScreen
        uhid={result.uhid}
        billNo={result.billNo}
        txnId={result.txnId}
        onClose={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-6">
      {/* header */}
      <div className="flex items-center border-b border-slate-200 pb-2">
        <div className="tab tab-active">New Patient Registration</div>
        <div className="tab flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            1
          </span>
          Incoming ABHA Consent
        </div>
        <div className="ml-auto pr-2">
          <button type="button" className="btn-icon bg-muted-2" aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      {/* pills */}
      <div className={`${INNER_W} mt-2 mb-5`}>
        <div className="pillbar w-fit rounded-lg bg-muted p-1">
          <button type="button" className="pill pill-active">Regular</button>
          <button type="button" className="pill">Quick</button>
          <button type="button" className="pill">Import from ABHA</button>
          <button type="button" className="pill pill-disabled">Scan Documents</button>
        </div>
      </div>

      {/* ===== Identification Details ===== */}
      <div className={`mb-2 ${INNER_W}`}>
        <div className="badge">Identification Details</div>
      </div>

      {/* grid */}
      <div
        className={`${INNER_W} grid items-start gap-3`}
        style={{ gridTemplateColumns: "56px minmax(440px,1fr) 630px" }}
      >
        {/* avatar */}
        <div className="row-span-2">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
            <img
              src="https://i.pravatar.cc/100?img=32"
              alt="avatar"
              className="h-full w-full object-cover"
            />
            <span className="absolute -right-1 -bottom-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-slate-200">
              <Camera className="h-4 w-4 text-slate-600" />
            </span>
          </div>
        </div>

        {/* MOBILE + NAMES */}
        <div className="grid gap-3">
          <FloatingInput
            label="Enter Mobile Number *"
            value={values.mobile}
            onChange={(v) => set("mobile", v)}
            onBlur={onBlurField("mobile")}
            error={errors.mobile}
          />
          <div className="grid gap-3" style={{ gridTemplateColumns: "232px minmax(200px,1fr)" }}>
            <FloatingInput
              label="First Name*"
              value={values.firstName}
              onChange={(v) => set("firstName", v)}
              onBlur={onBlurField("firstName")}
              error={errors.firstName}
            />
            <FloatingInput
              label="Last Name*"
              value={values.lastName}
              onChange={(v) => set("lastName", v)}
              onBlur={onBlurField("lastName")}
              error={errors.lastName}
            />
          </div>
        </div>

        {/* RIGHT GROUP */}
        <div className="w-[630px]">
          <div
            className="grid items-end gap-6"
            style={{ gridTemplateColumns: "232px 180px auto 180px" }}
          >
            {/* Gender */}
            <div className="w-[232px]">
              <FormField label="Gender*">
                <div className="segmented">
                  {genders.map((g, i) => {
                    const active = values.gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        className={`segmented-item ${active ? "segmented-item-active" : ""} ${i===0?"rounded-l-md":""} ${i===genders.length-1?"rounded-r-md":""}`}
                        onClick={() => set("gender", g)}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </FormField>
            </div>

            {/* Age (YY/MM/DD) */}
            <div className="w-[180px]">
              <FormField label="Age*" error={errors.age}>
                <div className="flex items-end gap-2">
                  <TinyBox label="YY" value={values.ageYY} onChange={onAgeYY} onBlur={onAgeYYBlur} inputMode="numeric" maxLength={3} />
                  <TinyBox label="MM" value={values.ageMM} onChange={onAgeMM} onBlur={onAgeMMBlur} inputMode="numeric" maxLength={2} />
                  <TinyBox label="DD" value={values.ageDD} onChange={onAgeDD} onBlur={onAgeDDBlur} inputMode="numeric" maxLength={2} />
                </div>
              </FormField>
            </div>

            {/* OR */}
            <div className="self-center text-center text-[11px] font-medium text-slate-500">
              OR
            </div>

            {/* DOB (YY/MM/DD) */}
            <div className="w-[180px]">
              <FormField label="Date of Birth*" error={errors.dob}>
                <div className="flex items-end gap-2">
                  <TinyBox label="YY" value={values.dobYY} onChange={onDobYY} onBlur={onDobYYBlur} inputMode="numeric" maxLength={4} />
                  <TinyBox label="MM" value={values.dobMM} onChange={onDobMM} onBlur={onDobMMBlur} inputMode="numeric" maxLength={2} />
                  <TinyBox label="DD" value={values.dobDD} onChange={onDobDD} onBlur={onDobDDBlur} inputMode="numeric" maxLength={2} />
                </div>
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Contact Details ===== */}
      <div className={`mt-6 ${INNER_W}`}>
        <div className="badge">Contact Details</div>

        <div
          className="mt-2 grid gap-4"
          style={{
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr 1fr 1fr 56px",
          }}
        >
          <FloatingInput label="Address Line 1 *" value={values.address1} onChange={(v) => set("address1", v)} />
          <FloatingInput label="Address Line 2 *" value={values.address2} onChange={(v) => set("address2", v)} />
          <FloatingInput label="PIN*" value={values.pin} onChange={(v) => set("pin", v)} onBlur={onBlurField("pin")} error={errors.pin} />
          <FloatingInput label="Select Area*" value={values.area} onChange={(v) => set("area", v)} />
          <FloatingInput label="City" value={values.city} onChange={(v) => set("city", v)} />
          <FloatingInput label="District*" value={values.district} onChange={(v) => set("district", v)} />
          <FloatingInput label="State*" value={values.state} onChange={(v) => set("state", v)} />
          <div className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600">
            IN
          </div>
        </div>

        <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <FloatingInput label="Primary Registered Number*" value={values.primaryRegNo} onChange={(v) => set("primaryRegNo", v)} />
          <FloatingInput label="Next Kin Contact No. *" value={values.nextKin} onChange={(v) => set("nextKin", v)} onBlur={onBlurField("nextKin")} error={errors.nextKin} />
          <FloatingInput label="Email" value={values.email} onChange={(v) => set("email", v)} onBlur={onBlurField("email")} error={errors.email} />
        </div>

        <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <FloatingInput label="Attendant Name" value={values.attendantName} onChange={(v) => set("attendantName", v)} />
          <FloatingInput label="Attendant Relationship" value={values.attendantRel} onChange={(v) => set("attendantRel", v)} />
        </div>
      </div>

      {/* ===== KYC Documents (single line) ===== */}
      <div className={`${INNER_W} mt-6`}>
        <div className="badge">KYC Documents ( Optional )</div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <select
            className="select w-40"
            aria-label="Doc type"
            value={kycDocType}
            onChange={(e) => setKycDocType(e.target.value)}
          >
            <option value="">Doc Type</option>
            <option value="aadhar">Aadhar card</option>
            <option value="pan">PAN card</option>
            <option value="dl">Driving licence</option>
            <option value="passport">Passport</option>
          </select>

          {/* Uploaders (no internal Doc Type selects) */}
          <FileUpload title="Upload Identity Proof" type="id" onChange={setIdProofs} />
          <FileUpload title="Upload Address Proof" type="address" onChange={setAddressProofs} />

          <label className="ml-auto inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="accent-blue-600" checked={kycVerified} onChange={(e) => setKycVerified(e.target.checked)} />
            KYC Verified
          </label>
        </div>
      </div>

      {/* ===== Preferences ===== */}
      <div className={`${INNER_W} mt-6`}>
        <div className="badge">Preferences</div>

        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[600px]">
            <label className="inline-flex items-center gap-2 text-sm text-slate-800">
              <input type="checkbox" className="accent-blue-600" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              Consent for Medical Research
            </label>
            <div className="mt-2 text-xs text-slate-500">
              These cookies are essential in order to use the website and use its features.
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-600">Communication Preferences</label>
            <select className="select w-40" value={comm} onChange={(e) => setComm(e.target.value)}>
              {commPrefs.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="mt-2 text-xs text-slate-500">Default Communication Language</div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className={`mt-8 border-t border-slate-200 pt-4 ${INNER_W}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm">Registration Charges : 200</div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Collect Payment &amp; Register
            </button>
            <button type="button" className="btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
