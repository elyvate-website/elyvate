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
    <section className="relative w-full aspect-square sm:aspect-[16/10] lg:aspect-[21/9] max-h-[680px] overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] bg-[#070a0f]">
      {/* Desktop background image */}
      {bgImage && (
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          priority
          className="hidden sm:block object-cover object-center"
        />
      )}

      {/* Mobile background image */}
      {bgImageMobile && (
        <Image
          src={bgImageMobile}
          alt="Hero background"
          fill
          priority
          className="sm:hidden object-cover object-center"
        />
      )}

      {/* Subtle darkening for text legibility */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="text-brand-300 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          New Collection
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-semibold text-white leading-[1.1] mb-4 max-w-2xl">
          {headline}
        </h1>
        <p className="hidden sm:block text-white/70 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
          {subheadline}
        </p>
        <Link
          href={ctaLink}
          className="bg-white text-ink-primary px-8 py-3.5 rounded-full font-semibold text-sm
                     hover:scale-105 active:scale-95 transition-transform duration-200 shadow-xl mt-2 sm:mt-0"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  )
}
