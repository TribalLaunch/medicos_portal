// =============================================================
// src/components/admin/FileDropzone.tsx (simple file picker)
// =============================================================
import { useRef } from 'react'


export default function FileDropzone({ onFiles }: { onFiles: (files: FileList) => void }){
const ref = useRef<HTMLInputElement|null>(null)
return (
<div className="rounded-2xl border border-dashed p-4 text-center bg-white">
<p className="text-sm text-gray-600">Upload product image (PNG/JPG)</p>
<div className="mt-2 flex justify-center">
<button type="button" className="btn-outline" onClick={()=>ref.current?.click()}>Choose file</button>
<input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e)=>{ if(e.target.files) onFiles(e.target.files) }} />
</div>
</div>
)
}