// =============================================================
// src/pages/auth/Login.tsx — wired to backend
// =============================================================
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginDto } from '../../lib/validators/auth'
import { useLogin } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'


export default function LoginPage(){
const { register, handleSubmit, formState:{ errors } } = useForm<LoginDto>({ resolver: zodResolver(LoginSchema) })
const { mutateAsync, isPending, error } = useLogin()
const navigate = useNavigate()
async function onSubmit(values: LoginDto){ await mutateAsync(values); navigate('/dashboard') }
return (
<div className="grid min-h-[60vh] place-items-center px-4">
<div className="card w-full max-w-md">
<h1 className="mb-4 text-xl font-semibold">Sign in</h1>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
<div>
<label className="text-sm">Email</label>
<input className="input mt-1" type="email" {...register('email')} />
{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
</div>
<div>
<label className="text-sm">Password</label>
<input className="input mt-1" type="password" {...register('password')} />
{errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
</div>
{error && <p className="text-sm text-red-600">{error.message}</p>}
<button disabled={isPending} className="btn-primary w-full">{isPending? 'Signing in…' : 'Sign in'}</button>
</form>
<div className="mt-3 flex justify-between text-sm">
<Link to="/forgot-password" className="text-sky-700 hover:underline">Forgot password?</Link>
<Link to="/register" className="text-sky-700 hover:underline">Register</Link>
</div>
</div>
</div>
)
}