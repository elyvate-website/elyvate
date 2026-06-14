import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react'

const features = [
  { icon: Truck,        label: 'Free Worldwide Shipping', sub: 'On all orders' },
  { icon: ShieldCheck,  label: 'Secure Payment',          sub: '100% protected' },
  { icon: RefreshCw,    label: '30-Day Returns',          sub: 'Hassle free' },
  { icon: Headphones,   label: '24/7 Support',            sub: 'Always here' },
]

export default function FeaturesBar() {
  return (
    <section className="section-pad py-10 border-y border-surface-200 bg-surface-50">
      <div className="container-xl grid grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">{label}</p>
              <p className="text-xs text-ink-muted">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
