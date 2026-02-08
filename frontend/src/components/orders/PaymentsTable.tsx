import type { OrderPayment } from "../../services/orders.service";
import { getPaymentId } from "../../services/orders.service";

export default function PaymentsTable({
  payments,
  onViewReceipt,
}: {
  payments?: OrderPayment[];
  onViewReceipt?: (payment: OrderPayment) => void;
}) {
  const list = payments || [];
  if (list.length === 0) return <div className="text-sm text-gray-600">No payments recorded.</div>;

  function fmtMoney(n?: number) {
  const v = Number(n ?? 0);
  return `$${v.toFixed(2)}`;
}

function fmtDate(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
}

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Source</th>
            <th>Reference</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p, idx) => {
            const pid = getPaymentId(p);
            const canReceipt = p.method === "card" && !!pid;

            return (
              <tr key={pid || idx}>
                 <td className="whitespace-nowrap">{fmtDate(p.paidAt)}</td>
                 <td className="whitespace-nowrap">{p.method}</td>
                 <td className="font-medium whitespace-nowrap">{fmtMoney(p.amount)}</td>
                 <td>{p.source}</td>
                 <td className="text-sm text-gray-600 whitespace-nowrap">{p.reference || "-"}</td>
                <td>
                  {canReceipt && onViewReceipt ? (
                    <button className="btn-outline" type="button" onClick={() => onViewReceipt(p)}>
                      View
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400 whitespace-nowrap">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// import type { OrderPayment } from "../../services/orders.service";

// function fmtMoney(n?: number) {
//   const v = Number(n ?? 0);
//   return `$${v.toFixed(2)}`;
// }

// function fmtDate(d?: string) {
//   if (!d) return "-";
//   const dt = new Date(d);
//   return isNaN(dt.getTime()) ? String(d) : dt.toLocaleString();
// }

// export default function PaymentsTable({
//   payments,
//   onViewReceipt,
// }: {
//   payments?: OrderPayment[];
//   onViewReceipt?: (payment: OrderPayment) => void;
// }) {
//   const list = payments || [];
//   if (list.length === 0) return <div className="text-sm text-gray-600">No payments recorded.</div>;

//   const sorted = [...list].sort((a, b) => (b.paidAt || "").localeCompare(a.paidAt || ""));

//   return (
//     <div className="overflow-x-auto">
//       <table className="table w-full">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Method</th>
//             <th>Amount</th>
//             <th>Source</th>
//             <th>Reference</th>
//             <th>Receipt</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sorted.map((p) => {
//             const canReceipt = p.method === "card" && !!p._id; // receipt route needs paymentId
//             return (
//               <tr key={p._id}>
//                 <td>{fmtDate(p.paidAt)}</td>
//                 <td>{p.method}</td>
//                 <td className="font-medium">{fmtMoney(p.amount)}</td>
//                 <td>{p.source}</td>
//                 <td className="text-sm text-gray-600">{p.reference || "-"}</td>
//                 <td>
//                   {canReceipt && onViewReceipt ? (
//                     <button type="button" className="btn-outline" onClick={() => onViewReceipt(p)}>
//                       View
//                     </button>
//                   ) : (
//                     <span className="text-sm text-gray-400">—</span>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }