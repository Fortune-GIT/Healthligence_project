
import React, { useEffect, useMemo, useState } from 'react';
import FormField from './FormField';
import FileUpload from './FileUpload';
import { validateField, computeDOBFromAge, computeAgeFromDOB } from '../utils/validation';
import { Camera } from './Icons';
import avatar from '../../assets/avatar.jpg';

const genders = ['Female','Male','Others'];
const commPrefs = ['Odia','English','Hindi'];

export default function RegistrationForm({ onSuccess }){
  const [values, setValues] = useState({
    mobile:'', firstName:'', lastName:'', gender:'Female', age:'', dob:'', email:'',
    address1:'', address2:'', pin:'', area:'', city:'', district:'', state:'',
    primaryRegNo:'', nextKin:'', attendantRel:'', attendantName:''
  });
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(true);
  const [comm, setComm] = useState('Odia');
  const [idProofs, setIdProofs] = useState([]);
  const [addressProofs, setAddressProofs] = useState([]);
  const [kycVerified, setKycVerified] = useState(false);

  const set = (name, val) => setValues(v => ({...v, [name]:val}));

  useEffect(()=>{ if (values.age && !values.dob){ const dob = computeDOBFromAge(values.age); if (dob) set('dob', dob);} }, [values.age]);
  useEffect(()=>{ if (values.dob){ const age = computeAgeFromDOB(values.dob); if (age) set('age', age);} }, [values.dob]);

  const validateRequired = () => {
    const next = {...errors};
    next.mobile = validateField('mobile', values.mobile);
    next.firstName = validateField('firstName', values.firstName);
    next.lastName = validateField('lastName', values.lastName);
    if (!values.age && !values.dob){
      next.age = 'Provide age or DOB.'; next.dob = 'Provide DOB or age.';
    } else {
      if (values.age) next.age = validateField('age', values.age);
      if (values.dob) next.dob = validateField('dob', values.dob);
    }
    next.pin = validateField('pin', values.pin);
    next.nextKin = validateField('nextKin', values.nextKin);
    next.email = validateField('email', values.email);
    setErrors(next);
    return Object.values(next).every(e=>!e);
  };

  const canSubmit = useMemo(()=>{
    const minimal = values.mobile && values.firstName && values.lastName && values.pin && values.nextKin && (values.age || values.dob);
    const hasId = idProofs.length > 0;
    const noErrors = Object.values(errors).every(e=>!e);
    return minimal && hasId && noErrors;
  }, [values, errors, idProofs]);

  const onBlurField = (name) => (e) => setErrors(prev => ({...prev, [name]:validateField(name, e.target.value)}));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateRequired()) return;
    if (idProofs.length === 0){ alert('Please upload at least one ID proof.'); return; }
    const rand = (len) => Array.from(crypto.getRandomValues(new Uint32Array(len))).map(n => (n%36).toString(36)).join('').toUpperCase();
    onSuccess?.({ ...values, consent, comm, kycVerified, idProofs, addressProofs,
      uhid:`IGH-${rand(7)}`, billNo:`FBZ${rand(8)}`, txnId:`TRX${rand(10)}` });
  };

  return (
    <div className="max-w-[1208px] mx-auto my-8">
      <div className="card">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white">
          <div className="tab tab-active">New Patient Registration</div>
          <div className="tab flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">1</span>
            Incoming ABHA Consent
          </div>
          <div className="ml-auto p-3"><button className="btn">✕</button></div>
        </div>

        <form className="p-5" onSubmit={handleSubmit} noValidate>
          <div className="flex gap-2 mb-4">
            <div className="pill pill-active">Regular</div>
            <div className="pill">Quick</div>
            <div className="pill">Import from ABHA</div>
            <div className="pill">Scan Documents</div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12"><div className="badge">Identification Details</div></div>

            <div className="col-span-1">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 relative">
                <img src={avatar.jpg} alt="avatar" className="w-full h-full object-cover" />
                <span className="absolute -bottom-1 -right-1 bg-white rounded-full border border-slate-200 p-1"><Camera /></span>
              </div>
            </div>

            <div className="col-span-4">
              <label className="block text-xs text-slate-600 mb-1">Enter Mobile Number *</label>
              <input className="input" placeholder="Enter Mobile Number" value={values.mobile} onChange={e=>set('mobile', e.target.value)} onBlur={onBlurField('mobile')} />
            </div>

            <FormField label="Gender" className="col-span-5">
              <div className="flex items-center gap-4 text-sm">
                {genders.map(g => (
                  <label key={g} className="inline-flex items-center gap-2">
                    <input type="radio" name="gender" checked={values.gender===g} onChange={()=>set('gender', g)} /> {g}
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="First Name*" className="col-span-3" error={errors.firstName}>
              <input className="input" value={values.firstName} onChange={e=>set('firstName', e.target.value)} onBlur={onBlurField('firstName')} />
            </FormField>
            <FormField label="Last Name*" className="col-span-3" error={errors.lastName}>
              <input className="input" value={values.lastName} onChange={e=>set('lastName', e.target.value)} onBlur={onBlurField('lastName')} />
            </FormField>

            <FormField label="Age*" className="col-span-2" error={errors.age}>
              <div className="flex items-center gap-2">
                <input className="input w-20 text-center" type="number" min="0" max="120" value={values.age} onChange={e=>set('age', e.target.value)} onBlur={onBlurField('age')} placeholder="YY" />
                <span className="input w-16 text-center bg-slate-50">MM</span>
                <span className="input w-16 text-center bg-slate-50">DD</span>
              </div>
            </FormField>

            <FormField label="Date of Birth*" className="col-span-3" error={errors.dob}>
              <div className="flex items-center gap-2">
                <span className="input w-16 text-center bg-slate-50">YY</span>
                <span className="input w-16 text-center bg-slate-50">MM</span>
                <span className="input w-16 text-center bg-slate-50">DD</span>
                <span className="text-slate-500 text-sm">OR</span>
                <input className="input w-32 text-center" value={values.dob} onChange={e=>set('dob', e.target.value)} onBlur={onBlurField('dob')} placeholder="YY/MM/DD" />
              </div>
            </FormField>

            <div className="col-span-12"><div className="badge">Contact Details</div></div>

            <FormField label="Address Line 1 *" className="col-span-3">
              <input className="input" value={values.address1} onChange={e=>set('address1', e.target.value)} />
            </FormField>
            <FormField label="Address Line 2 *" className="col-span-3">
              <input className="input" value={values.address2} onChange={e=>set('address2', e.target.value)} />
            </FormField>
            <FormField label="PIN*" className="col-span-2" error={errors.pin}>
              <input className="input" value={values.pin} onChange={e=>set('pin', e.target.value)} onBlur={onBlurField('pin')} />
            </FormField>
            <FormField label="Select Area*" className="col-span-2">
              <input className="input" value={values.area} onChange={e=>set('area', e.target.value)} />
            </FormField>
            <FormField label="City" className="col-span-2">
              <input className="input" value={values.city} onChange={e=>set('city', e.target.value)} />
            </FormField>
            <FormField label="District*" className="col-span-2">
              <input className="input" value={values.district} onChange={e=>set('district', e.target.value)} />
            </FormField>
            <div className="col-span-3">
              <label className="block text-xs text-slate-600 mb-1">State*</label>
              <div className="flex items-center gap-2">
                <input className="input" value={values.state} onChange={e=>set('state', e.target.value)} />
                <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600">IN</div>
              </div>
            </div>

            <FormField label="Primary Registered Number*" className="col-span-5">
              <input className="input" value={values.primaryRegNo} onChange={e=>set('primaryRegNo', e.target.value)} />
            </FormField>
            <FormField label="Email" className="col-span-5" error={errors.email}>
              <input className="input" value={values.email} onChange={e=>set('email', e.target.value)} onBlur={onBlurField('email')} />
            </FormField>

            <FormField label="Next Kin Contact No. *" className="col-span-3" error={errors.nextKin}>
              <input className="input" value={values.nextKin} onChange={e=>set('nextKin', e.target.value)} onBlur={onBlurField('nextKin')} />
            </FormField>
            <FormField label="Attendant Name" className="col-span-3">
              <input className="input" value={values.attendantName} onChange={e=>set('attendantName', e.target.value)} />
            </FormField>
            <FormField label="Attendant Relationship" className="col-span-4">
              <input className="input" value={values.attendantRel} onChange={e=>set('attendantRel', e.target.value)} />
            </FormField>

            <div className="col-span-12"><div className="badge">KYC Documents ( Optional )</div></div>
            <div className="col-span-6">
              <select className="select w-64 mb-2">
                <option>Doc Type</option><option>Aadhar card</option><option>PAN card</option><option>Driving licence</option><option>Passport</option>
              </select>
            </div>
            <FileUpload title=" " type="id" onChange={setIdProofs} />
            <div className="col-span-6">
              <FileUpload title=" " type="address" onChange={setAddressProofs} />
              <div className="mt-2 text-xs text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={kycVerified} onChange={e=>setKycVerified(e.target.checked)} /> KYC Verified
                </label>
              </div>
            </div>

            <div className="col-span-12"><div className="badge">Preferences</div></div>
            <div className="col-span-6">
              <div className="flex items-center gap-4">
                <span className="text-sm">Consent for Medical Research</span>
                <button type="button" className="toggle" data-on={consent} onClick={()=>setConsent(v=>!v)} aria-label="Consent toggle">
                  <span className="toggle-knob"></span>
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-2">These cookies are essential in order to use the website and use its features.</div>
            </div>
            <div className="col-span-6">
              <label className="block text-xs text-slate-600 mb-1">Communication Preferences</label>
              <select className="select w-40" value={comm} onChange={e=>setComm(e.target.value)}>
                {commPrefs.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="text-xs text-slate-500 mt-2">Default Communication Language</div>
            </div>
          </div>

          <div className="footer-strip mt-8 -mx-5">
            <div className="flex items-center justify-between">
              <div className="text-sm">Registration Charges : 200</div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={!canSubmit}>Collect Payment & Register</button>
                <button type="button" className="btn">Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
