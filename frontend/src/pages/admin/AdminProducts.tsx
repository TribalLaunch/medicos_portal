// =============================================================
// src/pages/admin/AdminProducts.tsx (CRUD + S3 upload)
// =============================================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminListProducts, createProduct, updateProduct, deleteProduct, getUploadUrl } from '../../services/products.service'
import { useState } from 'react'
import FileDropzone from '../../components/admin/FileDropzone'
import type { ProductImage } from '../../lib/validators/product'

export default function AdminProducts(){
  const [q,setQ] = useState(''); const [page,setPage] = useState(1)
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({ queryKey:['admin-products',{q,page}], queryFn:()=>adminListProducts({ q, page, pageSize: 20 }) })

  const createMut = useMutation({ mutationFn: createProduct, onSuccess:()=> qc.invalidateQueries({ queryKey:['admin-products'] }) })
  const updateMut = useMutation({ mutationFn: ({id, payload}:{id:string; payload:any})=> updateProduct(id,payload), onSuccess:()=> qc.invalidateQueries({ queryKey:['admin-products'] }) })
  const deleteMut = useMutation({ mutationFn: (id:string)=> deleteProduct(id), onSuccess:()=> qc.invalidateQueries({ queryKey:['admin-products'] }) })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Admin · Products</h2>
        <input className="input max-w-xs" placeholder="Search" value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value) }} />
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Price (MSRP)</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (<tr><td className="px-4 py-6" colSpan={5}>Loading…</td></tr>)}
            {error && (<tr><td className="px-4 py-6 text-red-600" colSpan={5}>{(error as Error).message}</td></tr>)}
            {data?.data?.map((p:any)=> (
              <tr key={p._id} className="border-t">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.sku}</td>
                <td className="px-4 py-3">${Number(p.priceMSRP).toFixed(2)}</td>
                <td className="px-4 py-3">{p.images?.length ? '✅' : '—'}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="btn-outline" onClick={async ()=>{
                    const name = prompt('Name', p.name); if(!name) return
                    await updateMut.mutateAsync({ id:p._id, payload:{ name } })
                  }}>Edit</button>
                  <button className="btn-outline" onClick={async ()=>{ if(confirm('Delete product?')) await deleteMut.mutateAsync(p._id) }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / upsert product with images */}
      <div className="card">
        <h3 className="font-semibold mb-2">Create / Upsert product</h3>
        <ProductUpsert onSave={async (payload)=>{ await createMut.mutateAsync(payload) }} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button className="btn-outline" disabled={(data?.page ?? 1) <= 1} onClick={()=>setPage((p)=>p-1)}>Prev</button>
        <span className="text-sm text-gray-600">Page {data?.page ?? page}</span>
        <button className="btn-outline" disabled={!data?.hasMore} onClick={()=>setPage((p)=>p+1)}>Next</button>
      </div>
    </section>
  )
}

function ProductUpsert({ onSave }:{ onSave:(p:any)=>Promise<any> }){
  const [sku,setSku]=useState(''); const [name,setName]=useState(''); const [price,setPrice]=useState('');
  const [desc,setDesc]=useState(''); const [manufacturer,setManufacturer]=useState(''); const [category,setCategory]=useState('');
  const [requiresRx,setRequiresRx]=useState(false);
  const [sizing,setSizing]=useState<string>(''); // comma-separated input
  const [images,setImages]=useState<ProductImage[]>([]);
  const [primaryImageIndex,setPrimaryImageIndex]=useState(0);

  async function handleUpload(files: FileList){
    if(!sku){ alert('Enter SKU first.'); return; }
    const file = files[0]; if(!file) return;
    // 1) get presign
    const { uploadUrl, publicUrl, key } = await getUploadUrl({ sku, fileName: file.name, contentType: file.type }) as any;
    // 2) PUT to S3
    const res = await fetch(uploadUrl, { method:'PUT', headers:{ 'Content-Type': file.type }, body: file });
    if(!res.ok){ alert('Upload failed'); return; }
    // 3) add to local list
    const alt = prompt('Alt text for image?', name || sku || 'Product image') || '';
    setImages((prev)=> [...prev, { key, url: publicUrl, alt }]);
    if (images.length === 0) setPrimaryImageIndex(0);
  }

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={async (e)=>{ 
        e.preventDefault();
        const payload = {
          sku,
          name,
          priceMSRP: Number(price),
          description: desc || undefined,
          manufacturer: manufacturer || undefined,
          category: category || undefined,
          requiresPrescription: requiresRx || undefined,
          sizing: sizing ? sizing.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
          images,
          primaryImageIndex,
          active: true,
        };
        await onSave(payload);
        // reset
        setSku(''); setName(''); setPrice(''); setDesc(''); setManufacturer(''); setCategory(''); setRequiresRx(false); setSizing(''); setImages([]); setPrimaryImageIndex(0);
      }}
    >
      <div><label className="text-sm">SKU</label><input className="input mt-1" value={sku} onChange={(e)=>setSku(e.target.value)} required /></div>
      <div><label className="text-sm">Name</label><input className="input mt-1" value={name} onChange={(e)=>setName(e.target.value)} required /></div>
      <div><label className="text-sm">Price (MSRP)</label><input className="input mt-1" type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} required /></div>
      <div className="md:col-span-2"><label className="text-sm">Description</label><textarea className="input mt-1 h-24" value={desc} onChange={(e)=>setDesc(e.target.value)} /></div>
      <div><label className="text-sm">Manufacturer</label><input className="input mt-1" value={manufacturer} onChange={(e)=>setManufacturer(e.target.value)} /></div>
      <div><label className="text-sm">Category</label><input className="input mt-1" value={category} onChange={(e)=>setCategory(e.target.value)} /></div>
      <div className="flex items-center gap-2"><input id="rx" type="checkbox" checked={requiresRx} onChange={(e)=>setRequiresRx(e.target.checked)} /><label htmlFor="rx" className="text-sm">Requires prescription</label></div>
      <div className="md:col-span-2"><label className="text-sm">Sizes (comma-separated)</label><input className="input mt-1" placeholder="Small, Medium, Large" value={sizing} onChange={(e)=>setSizing(e.target.value)} /></div>

      <div className="md:col-span-2">
        <FileDropzone onFiles={handleUpload} />
        {images.length > 0 && (
          <div className="mt-3">
            <div className="text-sm font-medium mb-1">Images</div>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i)=> (
                <button type="button" key={img.key+i} onClick={()=>setPrimaryImageIndex(i)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border ${i===primaryImageIndex?'border-sky-400':'border-gray-200'}`}>
                  <img src={img.url} alt={img.alt || `Image ${i+1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">Primary image index: {primaryImageIndex}</div>
          </div>
        )}
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button className="btn-primary">Save product</button>
      </div>
    </form>
  )
}



// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { adminListProducts, createProduct, updateProduct, deleteProduct, getUploadUrls } from '../../services/products.service'
// import { useState } from 'react'
// import FileDropzone from '../../components/admin/FileDropzone'

// export default function AdminProducts(){
// const [q,setQ] = useState(''); const [page,setPage] = useState(1)
// const qc = useQueryClient()
// const { data, isLoading, error } = useQuery({ queryKey:['admin-products',{q,page}], queryFn:()=>adminListProducts({ q, page, pageSize: 20 }) })


// const createMut = useMutation({ mutationFn: createProduct, onSuccess:()=> qc.invalidateQueries({ queryKey:['admin-products'] }) })
// const updateMut = useMutation({ mutationFn: ({id, payload}:{id:string; payload:any})=> updateProduct(id,payload), onSuccess:()=> qc.invalidateQueries({ queryKey:['admin-products'] }) })
// const deleteMut = useMutation({ mutationFn: (id:string)=> deleteProduct(id), onSuccess:()=> qc.invalidateQueries({ queryKey:['admin-products'] }) })


// async function handleUpload(file: File){
// const { urls } = await getUploadUrls(1) as any
// const signedUrl = urls[0]
// await fetch(signedUrl, { method:'PUT', headers: { 'Content-Type': file.type }, body: file })
// // Extract key from signed URL (assumes key is after '/'+bucket+'/' or in query param 'key')
// const url = new URL(signedUrl)
// const key = url.searchParams.get('key') || url.pathname.replace(/^\//,'').split('/').slice(1).join('/')
// return key
// }

// return (
// <section className="space-y-4">
// <div className="flex items-center justify-between gap-2">
// <h2 className="text-xl font-semibold">Admin · Products</h2>
// <input className="input max-w-xs" placeholder="Search" value={q} onChange={(e)=>{ setPage(1); setQ(e.target.value) }} />
// </div>


// <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
// <table className="min-w-full text-sm">
// <thead className="bg-gray-50">
// <tr>
// <th className="px-4 py-3 text-left">Name</th>
// <th className="px-4 py-3 text-left">SKU</th>
// <th className="px-4 py-3 text-left">Price</th>
// <th className="px-4 py-3 text-left">Image</th>
// <th className="px-4 py-3 text-left">Actions</th>
// </tr>
// </thead>
// <tbody>
// {isLoading && (<tr><td className="px-4 py-6" colSpan={5}>Loading…</td></tr>)}
// {error && (<tr><td className="px-4 py-6 text-red-600" colSpan={5}>{(error as Error).message}</td></tr>)}
// {data?.data?.map((p:any)=> (
// <tr key={p._id} className="border-t">
// <td className="px-4 py-3">{p.name}</td>
// <td className="px-4 py-3">{p.sku}</td>
// <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
// <td className="px-4 py-3">{p.imageKey ? '✅' : '—'}</td>
// <td className="px-4 py-3 flex gap-2">
// <button className="btn-outline" onClick={async ()=>{
// const name = prompt('Name', p.name); if(!name) return
// await updateMut.mutateAsync({ id:p._id, payload:{ name } })
// }}>Edit</button>
// <button className="btn-outline" onClick={async ()=>{ if(confirm('Delete product?')) await deleteMut.mutateAsync(p._id) }}>Delete</button>
// </td>
// </tr>
// ))}
// </tbody>
// </table>
// </div>

// {/* Create new product */}
// <div className="card">
// <h3 className="font-semibold mb-2">Create product</h3>
// <ProductCreate onCreate={async (payload)=>{ await createMut.mutateAsync(payload) }} onUpload={handleUpload} />
// </div>


// <div className="flex items-center justify-end gap-2">
// <button className="btn-outline" disabled={(data?.page ?? 1) <= 1} onClick={()=>setPage((p)=>p-1)}>Prev</button>
// <span className="text-sm text-gray-600">Page {data?.page ?? page}</span>
// <button className="btn-outline" disabled={!data?.hasMore} onClick={()=>setPage((p)=>p+1)}>Next</button>
// </div>
// </section>
// )
// }

// function ProductCreate({ onCreate, onUpload }:{ onCreate:(p:any)=>Promise<any>; onUpload:(f:File)=>Promise<string> }){
// const [name,setName] = useState(''); const [sku,setSku]=useState(''); const [price,setPrice]=useState(''); const [desc,setDesc]=useState(''); const [imageKey,setImageKey]=useState<string|undefined>(undefined)
// return (
// <form className="grid gap-3 md:grid-cols-2" onSubmit={async (e)=>{ e.preventDefault(); await onCreate({ name, sku, price: Number(price), description: desc, imageKey }); setName(''); setSku(''); setPrice(''); setDesc(''); setImageKey(undefined) }}>
// <div><label className="text-sm">Name</label><input className="input mt-1" value={name} onChange={(e)=>setName(e.target.value)} required /></div>
// <div><label className="text-sm">SKU</label><input className="input mt-1" value={sku} onChange={(e)=>setSku(e.target.value)} required /></div>
// <div><label className="text-sm">Price</label><input className="input mt-1" type="number" step="0.01" value={price} onChange={(e)=>setPrice(e.target.value)} required /></div>
// <div className="md:col-span-2"><label className="text-sm">Description</label><textarea className="input mt-1 h-24" value={desc} onChange={(e)=>setDesc(e.target.value)} /></div>
// <div className="md:col-span-2">
// <FileDropzone onFiles={async (files)=>{ const file = files[0]; if(!file) return; const key = await onUpload(file); setImageKey(key) }} />
// {imageKey && <p className="mt-2 text-sm text-green-700">Uploaded. S3 key: <code>{imageKey}</code></p>}
// </div>
// <div className="md:col-span-2 flex justify-end">
// <button className="btn-primary">Create</button>
// </div>
// </form>
// )
// }