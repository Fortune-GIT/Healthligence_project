export const patterns = {
  mobile: /^[0-9]{10}$/,
  name: /^[A-Za-z]{2,}([\s'-][A-Za-z]{2,})*$/,
  age: /^(?:1[01][0-9]|[1-9]?[0-9]|120)$/,
  dob: /^(?:\d{2}|\d{4})\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
  email: /^[\w.!#$%&'*+/=?^_`{|}~-]+@[\w-]+(\.[\w-]+)+$/,
  pin: /^[0-9]{6}$/,
};

export function validateField(name, value) {
  if (!value && ['mobile','firstName','lastName','pin','nextKin','ageOrDob'].includes(name)) {
    return 'This field is required.';
  }
  switch(name){
    case 'mobile': return patterns.mobile.test(value) ? '' : 'Enter a valid 10-digit number.';
    case 'firstName':
    case 'lastName': return patterns.name.test(value) ? '' : 'Use alphabets only, min 2 characters.';
    case 'age': return patterns.age.test(String(value)) ? '' : 'Age 0–120.';
    case 'dob': return patterns.dob.test(value) ? '' : 'Use YY/MM/DD or YYYY/MM/DD.';
    case 'email': return value ? (patterns.email.test(value) ? '' : 'Invalid email.') : '';
    case 'pin': return patterns.pin.test(value) ? '' : 'PIN must be 6 digits.';
    case 'nextKin': return patterns.mobile.test(value) ? '' : 'Enter a valid 10-digit number.';
    default: return '';
  }
}

export function computeDOBFromAge(age){
  if (!patterns.age.test(String(age))) return '';
  const today = new Date();
  const y = today.getFullYear() - parseInt(age,10);
  const m = String(today.getMonth()+1).padStart(2,'0');
  const d = String(today.getDate()).padStart(2,'0');
  return `${y}/${m}/${d}`;
}

export function computeAgeFromDOB(dobStr){
  if (!patterns.dob.test(dobStr)) return '';
  const parts = dobStr.split('/');
  let y = parseInt(parts[0],10);
  if (parts[0].length === 2){ y += (y > 25 ? 1900 : 2000); }
  const m = parseInt(parts[1],10)-1;
  const d = parseInt(parts[2],10);
  const dob = new Date(y,m,d);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) age--;
  return String(age);
}
