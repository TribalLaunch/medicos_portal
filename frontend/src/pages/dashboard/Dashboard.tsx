// =============================================================
// src/pages/dashboard/Dashboard.tsx — simple KPIs (stub)
// =============================================================
export default function Dashboard(){
return (
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
{[['Collections (MTD)','$24,830'],['Open Orders','18'],['AR < 30d','$7,420']].map(([title,value])=> (
<div key={title} className="card">
<div className="text-sm text-gray-500">{title}</div>
<div className="text-3xl font-semibold">{value}</div>
</div>
))}
</div>
)
}