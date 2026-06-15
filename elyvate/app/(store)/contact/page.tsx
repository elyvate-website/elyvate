export default function ContactPage() {
  return (
    <div className="section-pad pt-28 pb-20">
      <div className="container-xl max-w-xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-semibold text-ink-primary mb-2">Contact Us</h1>
          <p className="text-ink-secondary text-sm">We typically respond within 24 hours.</p>
        </div>
        <div className="card p-8 space-y-4">
          <div>
            <label className="label">Your Name</label>
            <input className="input" placeholder="John Doe" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input" placeholder="you@email.com" />
          </div>
          <div>
            <label className="label">Order ID (optional)</label>
            <input className="input font-mono" placeholder="e.g. A1B2C3D4" />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input min-h-[140px] resize-none" placeholder="How can we help you?" />
          </div>
          <button className="btn-primary w-full py-3.5">Send Message</button>
          <p className="text-xs text-ink-muted text-center">Or email us directly at <a href="mailto:support@elyvate.com" className="text-brand-600 hover:underline">support@elyvate.com</a></p>
        </div>
      </div>
    </div>
  )
}
