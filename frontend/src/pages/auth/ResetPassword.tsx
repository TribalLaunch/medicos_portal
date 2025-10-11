// =============================================================
// src/pages/auth/ResetPassword.tsx
// =============================================================
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import * as auth from '../../services/auth.services'


export default function ResetPasswordPage(){
const [sp] = useSearchParams(); const token = sp.get('token') || ''
const [password,setPassword] = useState(''); const [err,setErr]=useState<string|null>(null)
const navigate = useNavigate()
return (
<div className="grid min-h-[60vh] place-items-center px-4"><div className="card w-full max-w-md">
<h1 className="mb-4 text-xl font-semibold">Reset password</h1>
<form className="space-y-3" onSubmit={async (e)=>{ e.preventDefault(); setErr(null); try{ await auth.resetPassword(token,password); navigate('/login') }catch(e:any){ setErr(e.message) } }}>
<div><label className="text-sm">New password</label><input className="input mt-1" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
{err && <p className="text-sm text-red-600">{err}</p>}
<button className="btn-primary w-full">Update password</button>
</form>
</div></div>
)
}