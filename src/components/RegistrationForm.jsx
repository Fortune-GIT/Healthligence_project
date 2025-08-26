import React, { useEffect, useMemo, useState } from "react";
import FormField, { FloatingInput, TinyBox } from "./FormField";
import FileUpload from "./FileUpload";
import {
  validateField,
  computeDOBFromAge,
  computeAgeFromDOB,
} from "../utils/validation";
import { Camera, Calendar } from "./Icons";

const genders = ["Female", "Male", "Others"];
const commPrefs = ["Odia", "English", "Hindi"];

export default function RegistrationForm({ onSuccess }) {
  const [values, setValues] = useState({
    mobile: "",
    firstName: "",
    lastName: "",
    gender: "Female",
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

  const set = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  useEffect(() => {
    if (values.age && !values.dob) {
      const dob = computeDOBFromAge(values.age);
      if (dob) {
        set("dob", dob);
        const [Y, M = "", D = ""] = dob.split("-");
        set("dobYY", Y ?? "");
        set("dobMM", M ?? "");
        set("dobDD", D ?? "");
      }
    }
  }, [values.age]);

  useEffect(() => {
    if (values.dob) {
      const age = computeAgeFromDOB(values.dob);
      if (age) set("age", age);
    }
  }, [values.dob]);

  useEffect(() => {
    const { dobYY, dobMM, dobDD } = values;
    if (dobYY && dobMM && dobDD) {
      set("dob", `${dobYY}-${dobMM}-${dobDD}`);
    } else if (!dobYY && !dobMM && !dobDD) {
      set("dob", "");
    }
  }, [values.dobYY, values.dobMM, values.dobDD]);

  const validateRequired = () => {
    const next = { ...errors };
    next.mobile = validateField("mobile", values.mobile);
    next.firstName = validateField("firstName", values.firstName);
    next.lastName = validateField("lastName", values.lastName);

    if (!values.age && !values.dob) {
      next.age = "Provide age or DOB.";
      next.dob = "Provide DOB or age.";
    } else {
      if (values.age) next.age = validateField("age", values.age);
      if (values.dob) next.dob = validateField("dob", values.dob);
    }

    next.pin = validateField("pin", values.pin);
    next.nextKin = validateField("nextKin", values.nextKin);
    next.email = validateField("email", values.email);

    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  const canSubmit = useMemo(() => {
    const minimal =
      values.mobile &&
      values.firstName &&
      values.lastName &&
      values.pin &&
      values.nextKin &&
      (values.age || values.dob);

    const hasId = idProofs.length > 0;
    const noErrors = Object.values(errors).every((e) => !e);
    return minimal && hasId && noErrors;
  }, [values, errors, idProofs]);

  const onBlurField =
    (name) =>
    (e) =>
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, e.target.value),
      }));

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

    onSuccess?.({
      ...values,
      consent,
      comm,
      kycVerified,
      idProofs,
      addressProofs,
      uhid: `IGH-${rand(7)}`,
      billNo: `FB${rand(8)}`,
      txnId: `TRX${rand(10)}`,
    });
  };

  return (
    <div className="container mx-auto px-8 py-6">
      
        {/* top tabs */}
        <div className="flex items-center border-b border-slate-200 bg-white">
          <div className="tab tab-active">New Patient Registration</div>
          <div className="tab flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              1
            </span>
            Incoming ABHA Consent
          </div>
          <div className="ml-auto p-3">
            <button type="button" className="btn" aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        <form className="p-5" onSubmit={handleSubmit} noValidate>
          {/* pills */}
          <div className="mb-4">
            <div className="pillbar">
              <button type="button" className="pill pill-active">Regular</button>
              <button type="button" className="pill">Quick</button>
              <button type="button" className="pill">Import from ABHA</button>
              <button type="button" className="pill pill-disabled">Scan Documents</button>
            </div>
          </div>

          {/* ===== Identification Details ===== */}
          <div className="mb-2">
            <div className="badge">Identification Details</div>
          </div>

          {/* Centered row that mirrors the Figma “Hug 84px / gap 12px / space-between / width 1102px” */}
          <div className="id-row">
            {/* avatar */}
            <div className="id-cell id-avatar">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200">
                <img
                  src="https://i.pravatar.cc/100?img=32"
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
                <span className="avatar-badge">
                  <Camera />
                </span>
              </div>
            </div>

            {/* mobile */}
            <div className="id-cell id-mobile">
              <FloatingInput
                label="Enter Mobile Number *"
                value={values.mobile}
                onChange={(v) => set("mobile", v)}
                onBlur={onBlurField("mobile")}
                error={errors.mobile}
              />
            </div>

            {/* gender */}
            <div className="id-cell id-gender">
              <FormField label="Gender*">
                <div className="segmented">
                  {genders.map((g, i) => {
                    const active = values.gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        className={`segmented-item ${
                          active ? "segmented-item-active" : ""
                        } ${i === 0 ? "rounded-l-md" : ""} ${
                          i === genders.length - 1 ? "rounded-r-md" : ""
                        }`}
                        onClick={() => set("gender", g)}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </FormField>
            </div>

            {/* age */}
            <div className="id-cell id-age">
              <FormField label="Age*" error={errors.age}>
                <div className="flex items-end gap-2">
                  <TinyBox
                    label="YY"
                    value={values.ageYY}
                    onChange={(v) => {
                      set("ageYY", v);
                      set("age", v);
                    }}
                    inputMode="numeric"
                    maxLength={3}
                  />
                  <TinyBox
                    label="MM"
                    value={values.ageMM}
                    onChange={(v) => set("ageMM", v)}
                    inputMode="numeric"
                    maxLength={2}
                  />
                  <TinyBox
                    label="DD"
                    value={values.ageDD}
                    onChange={(v) => set("ageDD", v)}
                    inputMode="numeric"
                    maxLength={2}
                  />
                </div>
              </FormField>
            </div>

            {/* DOB */}
            <div className="id-cell id-dob">
              <FormField label="Date of Birth*" error={errors.dob}>
                <div className="flex items-end gap-3">
                  <div className="flex items-end gap-2">
                    <TinyBox
                      label="YY"
                      value={values.dobYY}
                      onChange={(v) => set("dobYY", v)}
                      inputMode="numeric"
                      maxLength={4}
                    />
                    <TinyBox
                      label="MM"
                      value={values.dobMM}
                      onChange={(v) => set("dobMM", v)}
                      inputMode="numeric"
                      maxLength={2}
                    />
                    <TinyBox
                      label="DD"
                      value={values.dobDD}
                      onChange={(v) => set("dobDD", v)}
                      inputMode="numeric"
                      maxLength={2}
                    />
                  </div>

                  <span className="pb-0.5 text-sm text-slate-500">OR</span>

                  <div className="relative">
                    <input
                      className="input w-36 text-center"
                      placeholder="YYYY-MM-DD"
                      value={values.dob}
                      onChange={(e) => set("dob", e.target.value)}
                      onBlur={onBlurField("dob")}
                      aria-label="DOB full"
                    />
                    <Calendar className="icon-muted pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </FormField>
            </div>
          </div>

          {/* ===== Contact Details (unchanged grid) ===== */}
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12">
              <div className="badge">Contact Details</div>
            </div>

            <div className="col-span-3">
              <FloatingInput
                label="Address Line 1 *"
                value={values.address1}
                onChange={(v) => set("address1", v)}
              />
            </div>

            <div className="col-span-3">
              <FloatingInput
                label="Address Line 2 *"
                value={values.address2}
                onChange={(v) => set("address2", v)}
              />
            </div>

            <div className="col-span-2">
              <FloatingInput
                label="PIN*"
                value={values.pin}
                onChange={(v) => set("pin", v)}
                onBlur={onBlurField("pin")}
                error={errors.pin}
              />
            </div>

            <div className="col-span-2">
              <FloatingInput
                label="Select Area*"
                value={values.area}
                onChange={(v) => set("area", v)}
              />
            </div>

            <div className="col-span-2">
              <FloatingInput
                label="City"
                value={values.city}
                onChange={(v) => set("city", v)}
              />
            </div>

            <div className="col-span-2">
              <FloatingInput
                label="District*"
                value={values.district}
                onChange={(v) => set("district", v)}
              />
            </div>

            <div className="col-span-3">
              <FloatingInput
                label="State*"
                value={values.state}
                onChange={(v) => set("state", v)}
                rightAddon={
                  <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600">
                    IN
                  </div>
                }
              />
            </div>

            <div className="col-span-5">
              <FloatingInput
                label="Primary Registered Number*"
                value={values.primaryRegNo}
                onChange={(v) => set("primaryRegNo", v)}
              />
            </div>

            <div className="col-span-5">
              <FloatingInput
                label="Email"
                value={values.email}
                onChange={(v) => set("email", v)}
                onBlur={onBlurField("email")}
                error={errors.email}
              />
            </div>

            <div className="col-span-3">
              <FloatingInput
                label="Next Kin Contact No. *"
                value={values.nextKin}
                onChange={(v) => set("nextKin", v)}
                onBlur={onBlurField("nextKin")}
                error={errors.nextKin}
              />
            </div>

            <div className="col-span-3">
              <FloatingInput
                label="Attendant Name"
                value={values.attendantName}
                onChange={(v) => set("attendantName", v)}
              />
            </div>

            <div className="col-span-4">
              <FloatingInput
                label="Attendant Relationship"
                value={values.attendantRel}
                onChange={(v) => set("attendantRel", v)}
              />
            </div>

            {/* KYC */}
            <div className="col-span-12">
              <div className="badge">KYC Documents ( Optional )</div>
            </div>

            <div className="col-span-6">
              <select className="select mb-2 w-64" aria-label="Doc type">
                <option>Doc Type</option>
                <option>Aadhar card</option>
                <option>PAN card</option>
                <option>Driving licence</option>
                <option>Passport</option>
              </select>
            </div>

            <FileUpload title=" " type="id" onChange={setIdProofs} />

            <div className="col-span-6">
              <FileUpload title=" " type="address" onChange={setAddressProofs} />
              <div className="mt-2 text-xs text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={kycVerified}
                    onChange={(e) => setKycVerified(e.target.checked)}
                  />
                  KYC Verified
                </label>
              </div>
            </div>

            {/* Preferences */}
            <div className="col-span-12">
              <div className="badge">Preferences</div>
            </div>

            <div className="col-span-6">
              <div className="flex items-center gap-4">
                <span className="text-sm">Consent for Medical Research</span>
                <button
                  type="button"
                  className="toggle"
                  data-on={consent}
                  onClick={() => setConsent((v) => !v)}
                  aria-label="Consent toggle"
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                These cookies are essential in order to use the website and use
                its features.
              </div>
            </div>

            <div className="col-span-6">
              <label className="mb-1 block text-xs text-slate-600">
                Communication Preferences
              </label>
              <select
                className="select w-40"
                value={comm}
                onChange={(e) => setComm(e.target.value)}
              >
                {commPrefs.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-xs text-slate-500">
                Default Communication Language
              </div>
            </div>
          </div>

          <div className="footer-strip mt-8 -mx-5">
            <div className="flex items-center justify-between">
              <div className="text-sm">Registration Charges : 200</div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canSubmit}
                >
                  Collect Payment &amp; Register
                </button>
                <button type="button" className="btn">Cancel</button>
              </div>
            </div>
          </div>
        </form>
    </div>
  );
}
