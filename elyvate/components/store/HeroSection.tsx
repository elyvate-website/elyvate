import Link from 'next/link'
import Image from 'next/image'
import { HeroSection as HeroType } from '@/lib/supabase'

export default function HeroSection({ hero }: { hero: HeroType | null }) {
  const headline    = hero?.headline    ?? 'Elevate Your Space'
  const subheadline = hero?.subheadline ?? 'Premium ambient lighting & projection gadgets that transform any room into an experience.'
  const ctaText     = hero?.cta_text    ?? 'Shop Now'
  const ctaLink     = hero?.cta_link    ?? '/products'
  const bgImage       = hero?.bg_image        ?? null
  const bgImageMobile = hero?.bg_image_mobile || bgImage

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-[#070a0f]">
      {/* Desktop background image */}
      {bgImage && (
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          priority
          className="hidden sm:block object-cover object-center opacity-80"
        />
      )}

      {/* Mobile background image */}
      {bgImageMobile && (
        <Image
          src={bgImageMobile}
          alt="Hero background"
          fill
          priority
          className="sm:hidden object-cover object-center opacity-80"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container-xl section-pad pt-24">
        <div className="max-w-xl">
          <span className="inline-block text-brand-400 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            New Collection
          </span>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] mb-6">
            {headline}
          </h1>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
            {subheadline}
          </p>
          <Link href={ctaLink} className="btn-primary text-base px-8 py-4">
            {ctaText}
          </Link>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
