// =============================================================
// src/pages/system/Unauthorized.tsx — shown on RBAC fail
// =============================================================
export default function Unauthorized(){
return (
<div className="grid min-h-[40vh] place-items-center text-center">
<div>
<div className="text-2xl font-semibold">Access denied</div>
<p className="text-gray-600">You don’t have permission to view this page.</p>
</div>
</div>
)
}