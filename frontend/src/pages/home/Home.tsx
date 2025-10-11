import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <section className="grid gap-6 md:grid-cols-2 items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color:'var(--brand-primary)' }}>
          Simple medical product checkout for clinics & guests
        </h1>
        <p className="text-gray-600">
          Browse products, add to cart, and pay via Stripe — or request manual/PO through our sales team.
        </p>
        <div className="mt-4 flex gap-2">
          <Link to="/products" className="btn-primary">Browse Products</Link>
          <Link to="/checkout" className="btn-outline">Checkout</Link>
        </div>
      </div>
      <div className="card">
        <div className="text-sm text-gray-500 mb-1">At a glance</div>
        <ul className="space-y-2 text-sm">
          <li><span className="badge">Guest checkout</span> No account required</li>
          <li><span className="badge">Clinics</span> Contract pricing & addresses</li>
          <li><span className="badge">Stripe</span> Secure payments</li>
        </ul>
      </div>
    </section>
  )
}
