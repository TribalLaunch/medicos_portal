// =============================================================
// src/pages/auth/ForgotPassword.tsx
// =============================================================
import { useState } from 'react'
import * as auth from '../../services/auth.services'


export default function ForgotPasswordPage(){
const [email,setEmail] = useState(''); const [sent,setSent]=useState(false); const [err,setErr]=useState<string|null>(null)
return (
<div className="grid min-h-[60vh] place-items-center px-4"><div className="card w-full max-w-md">
<h1 className="mb-4 text-xl font-semibold">Forgot password</h1>
{sent ? (<p className="text-sm text-green-700">If an account exists for {email}, a reset email has been sent.</p>) : (
<form className="space-y-3" onSubmit={async (e)=>{e.preventDefault(); setErr(null); try{ await auth.forgotPassword(email); setSent(true)}catch(e:any){ setErr(e.message) } }}>
<div><label className="text-sm">Email</label><input className="input mt-1" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
{err && <p className="text-sm text-red-600">{err}</p>}
<button className="btn-primary w-full">Send reset link</button>
</form>
)}
</div></div>
)
}