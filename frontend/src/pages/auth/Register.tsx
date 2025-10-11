// =============================================================
// src/pages/auth/Register.tsx (optional for MVP)
// =============================================================
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { RegisterSchema } from '../../lib/validators/auth'
import * as auth from '../../services/auth.services'

export default function RegisterPage(){
  const { register, handleSubmit, formState:{errors}, reset } = useForm<{name:string;email:string;password:string, customer_name:string}>({ resolver: zodResolver(RegisterSchema) })
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="mb-4 text-xl font-semibold">Create account</h1>
        <form className="space-y-3" onSubmit={handleSubmit(async (v)=>{ await auth.register(v); reset(); alert('Account created. You may now sign in.') })}>
          <div>
            <label className="text-sm">Name</label>
            <input className="input mt-1" {...register('name')} />
            
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm">Business Name</label>
            <input className="input mt-1" {...register('customer_name')} />
            
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>
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
          <button className="btn-primary w-full">Create account</button>
        </form>
        <div className="mt-3 text-sm">
          <Link to="/login" className="text-sky-700 hover:underline">← Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}