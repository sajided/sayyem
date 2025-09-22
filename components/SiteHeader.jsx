'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/CartContext'
import MobileNav from '@/components/MobileNav'

export default function SiteHeader() {
          const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useCart()
  useEffect(() => {
    const saved = localStorage.getItem('theme:dark');
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const d = saved ? saved === '1' : prefer;
    setDark(d);
    document.documentElement.classList.toggle('dark', d);
  }, []);
  function toggle(){
    setDark(d => { const next=!d; localStorage.setItem('theme:dark', next?'1':'0'); document.documentElement.classList.toggle('dark', next); return next; })
  }
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-black/30">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* Hamburger on small screens */}
            <button onClick={()=>setMobileOpen(true)} className="mr-1 inline-flex items-center justify-center rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10 md:hidden" aria-label="Open menu">
              ☰
            </button>
            <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16" className="rounded-sm shadow">
    <rect width="24" height="16" fill="#006a4e" />
    <circle cx="10" cy="8" r="4" fill="#f42a41" />
  </svg>
  <span>ToyRush BD</span>
</Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden gap-6 md:flex text-sm">
            <Link href="/shop" className="hover:underline">Shop</Link>
            <Link href="/track" className="hover:underline">Track</Link>
            <Link href="/policies/terms" className="hover:underline">Terms</Link>
            <Link href="/policies/privacy" className="hover:underline">Privacy</Link>
            <Link href="/policies/shipping-returns" className="hover:underline">Shipping & Returns</Link>
            <a href="/categories" className="text-sm hover:underline">Categories</a>
          
</nav>

          <div className="flex items-center gap-2"><button onClick={()=>cart.setOpen(true)} className="relative rounded-lg border border-black/10 bg-white/70 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-black/60" aria-label="Open cart">
              Cart
              {cart.count>0 && <span className="ml-2 inline-flex min-w-[1.25rem] justify-center rounded-full bg-black px-2 text-xs text-white dark:bg-white dark:text-black">{cart.count}</span>}
            </button>
            <button onClick={toggle} className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Toggle theme" aria-pressed={dark}>
              {dark ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={()=>setMobileOpen(false)} />
      </header>
  )
}
