'use client'

import { useMemo, useState, useEffect } from 'react'
import { useCart } from '@/components/cart/CartContext'
import { useToast } from '@/components/toast/ToastContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TrustBadges from '@/components/TrustBadges'
import { BLUR_DATA_URL } from '@/lib/blurData'

export default function ProductClient({ product, suggested }) {
  const [idx, setIdx] = useState(0)
  const router = useRouter()
  const cart = useCart()
  const toast = useToast()

  const images = useMemo(() => {
    return (product?.images?.length ? product.images : ['https://i.ibb.co.com/Z1Wqp1m7/85483964-mario1.jpg'])
  }, [product])

  const isSold = product.soldOut || (product.quantity ?? 0) <= 0
  const unitPrice = product.salePrice && product.salePrice>0 ? product.salePrice : (product.price || product.regularPrice)

  function add() {
    const image = images[idx] || images[0]
    cart.add({ slug: product.slug, name: product.name, price: unitPrice, image }, 1)
    toast.show('Added to cart')
    cart.setOpen(true)
  }
  function buyNow(e){ try{ if(e){ e.preventDefault?.(); e.stopPropagation?.(); }
    const image = images[idx] || images[0]
    localStorage.setItem('tr:cart', JSON.stringify([{ slug: product.slug, name: product.name, price: unitPrice, image, qty: 1 }]))
    router.push('/checkout') } catch(err){ try{ window.location.href='/checkout' }catch(_e){} }
  }

  return (
    <div className="py-8 space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {(() => {
          const s = images[idx] || images[0] || null;
          return s ? (
            <div className="relative aspect-square w-full">
              <Image src={s} alt={product.name} fill sizes="(min-width:768px) 50vw, 100vw" className="rounded-2xl object-cover" priority  placeholder="blur" blurDataURL={BLUR_DATA_URL}  className="rounded-2xl object-cover" />
            </div>
          ) : (
            <div className="relative aspect-square w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          );
        })()}
          {images.length > 1 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg border ${i === idx ? 'border-black dark:border-white' : 'border-black/10 dark:border-white/10'}`}
                >
                  <Image src={src} alt="" fill sizes="25vw" className="object-cover"  placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {(product.ratingCount>0) && (
            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <Stars value={product.ratingAvg} size='lg' />
              <span>({product.ratingAvg} / 5 · {product.ratingCount} {product.ratingCount===1?'review':'reviews'})</span>
            </div>
          )}
          <p className="mt-3 text-xl font-medium">{product.salePrice && product.salePrice>0 ? (<><span className='mr-2'>৳{product.salePrice}</span><span className='text-sm text-neutral-500 line-through'>৳{product.regularPrice || product.price}</span></>) : (<>৳{product.price || product.regularPrice}</>)}</p>
          <div className="mt-4 flex gap-2">{!product?.isPreOrder && (
            <button type="button" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); add(); }} disabled={isSold} className="rounded-xl border border-black/10 bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:border-white/10 dark:bg-white dark:text-black">
              Add to cart
            </button>
            )}{!product?.isPreOrder && (<button type="button" onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); buyNow(); }} disabled={isSold} className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium dark:border-white/10 dark:bg-black/60">
              Buy now
            </button>
            )}{isSold && <span className="text-sm text-red-600">Sold out</span>}
          </div>
          <PreorderCTA product={product} />
          <TrustBadges />
          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: String(product.description ?? 'Carefully curated for builders and collectors.').replace(/\r\n/g,'\n').replace(/<\s*br\s*\/?\s*>/gi,'\n').replace(/\n/g,'<br />') }} />
        </div>
      </div>

      {Array.isArray(suggested) && suggested.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {suggested.map((s) => { const effectivePrice = Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0)); const originalPrice = Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0)); const onSale = originalPrice > 0 && effectivePrice > 0 && effectivePrice < originalPrice; const discountPct = onSale ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100) : 0; return (
              <Link key={s._id} href={`/product/${s.slug}`} className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-lg dark:border-white/10 dark:bg-neutral-900">
                <div className="relative block aspect-square w-full overflow-hidden">
                  <Image src={(s.images?.[0]) || "https://i.ibb.co.com/Z1Wqp1m7/85483964-mario1.jpg"} alt={s.name} fill sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw" className="object-cover transition group-hover:scale-105"  placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                  {(Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0)) > 0 && Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0)) > 0 && Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0)) < Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0))) && (<span className="absolute right-2 top-2 rounded-full bg-green-600 text-white text-xs px-2 py-0.5">-{Math.round(((Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0)) - Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0))) / Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0))) * 100)}%</span>)}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-medium"><span className="hover:underline">{s.name}</span></h3>
                  <div className="mt-1 text-sm flex items-baseline gap-2">{(Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0)) > 0 && Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0)) > 0 && Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0)) < Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0))) ? (<> <span className="font-semibold text-red-600 dark:text-red-400">৳{Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0))}</span> <span className="text-neutral-500 line-through">৳{Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0))}</span> </>) : (<span className="text-neutral-700 dark:text-neutral-300">৳{Number((s.salePrice && s.salePrice>0) ? s.salePrice : (s.price ?? 0)) || Number((s.regularPrice && s.regularPrice>0) ? s.regularPrice : (s.price ?? 0))}</span>)}</div>
                </div>
              </Link>
            )})}
          </div>
        </section>
      )}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Customer reviews</h2>
        <ReviewBlock pid={product._id} productName={product.name} />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Questions & Answers</h2>
        <QABlock pid={product._id} />
      </section>

    </div>
  )
}
function ReviewBlock({ pid, productName }){
  const toast = useToast()
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState('')

  async function load(){ try{
    const r = await fetch(`/api/reviews?product=${pid}`, { cache:'no-store' });
    const j = await r.json(); setList(j.reviews || [])
  }catch{} }
  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault();
    setMsg('')
    const r = await fetch('/api/reviews', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ productId: pid, name, rating, text })
    });
    if(r.ok){
      setName(''); setRating(5); setText('');
      toast.show('Thanks! Your review is awaiting approval.'); setMsg('Thanks! Your review is awaiting approval.');
    } else {
      toast.show('Failed to submit. Please try again.'); setMsg('Failed to submit. Please try again.');
    }
  }

  return (
    <div className="mt-3 grid gap-4">
      {list.length === 0 && <div className="text-sm text-neutral-500">No reviews yet.</div>}
      {list.slice(0,6).map((rv,i)=>(
        <div key={i} className="rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="font-medium">{rv.name || 'Anonymous'}</div>
            <Stars value={rv.rating || 0} />
          </div>
          {rv.text && <p className="mt-1 whitespace-pre-wrap">{rv.text}</p>}
        </div>
      ))}

      <form onSubmit={submit} className="rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
        <div className="font-medium">Write a review</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-black/60" />
          <select value={rating} onChange={e=>setRating(Number(e.target.value))} className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-black/60">
            {[5,4,3,2,1].map(n=>(<option key={n} value={n}>{n} star{n>1?'s':''}</option>))}
          </select>
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={`What did you think about ${productName}?`} className="mt-2 h-24 w-full resize-y rounded-xl border border-black/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-black/60" />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/60">Submit</button>
        </div>
        {msg && <div className="mt-2 text-xs text-neutral-600">{msg}</div>}
      </form>
    </div>
  )
}

function QABlock({ pid }){
  const toast = useToast()
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [msg, setMsg] = useState('')

  async function load(){ try{
    const r = await fetch(`/api/questions?product=${pid}`, { cache:'no-store' });
    const j = await r.json(); setList(j.questions || [])
  }catch{} }
  useEffect(()=>{ load() }, [])

  async function submit(e){
    e.preventDefault();
    setMsg('')
    const r = await fetch('/api/questions', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ productId: pid, name, text })
    });
    if(r.ok){
      setName(''); setText(''); toast.show('Thanks! Your question is awaiting approval.'); setMsg('Thanks! Your question is awaiting approval.');
    } else { setMsg('Failed to submit. Please try again.') }
  }

  return (
    <div className="mt-3 grid gap-4">
      {list.length === 0 && <div className="text-sm text-neutral-500">No questions yet.</div>}
      {list.slice(0,6).map((qa,i)=>(
        <div key={i} className="rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
          <div className="font-medium">{qa.name || 'Anonymous'} asked:</div>
          <p className="mt-1 whitespace-pre-wrap">{qa.text}</p>
          {qa.answer && (
            <div className="mt-2 rounded-lg bg-neutral-50 p-2 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              <div className="text-xs font-medium">Answer</div>
              <div className="text-sm whitespace-pre-wrap">{qa.answer}</div>
            </div>
          )}
        </div>
      ))}

      <form onSubmit={submit} className="rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
        <div className="font-medium">Ask a question</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-black/60" />
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ask about size, compatibility, shipping…" className="mt-2 h-24 w-full resize-y rounded-xl border border-black/10 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-black/60" />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-black/60">Submit</button>
        </div>
        {msg && <div className="mt-2 text-xs text-neutral-600">{msg}</div>}
      </form>
    </div>
  )
}

function Stars({ value=0, size='sm' }){
  const pct = Math.max(0, Math.min(100, (Number(value)||0)/5*100));
  const dim = size==='sm' ? 16 : 22;
  const Star = (key) => (
    <svg key={key} viewBox="0 0 24 24" width={dim} height={dim} aria-hidden="true" className="shrink-0">
      <path fill="currentColor" d="M12 2.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.8 6.6 19l1-6.1-4.4-4.3 6.1-.9L12 2.2z" />
    </svg>
  );
  return (
    <span className="relative inline-flex" aria-label={`${value} out of 5`}>
      <span className="flex text-neutral-400 dark:text-neutral-500">
        {[0,1,2,3,4].map(i => Star(i))}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: pct + '%' }}>
        <span className="flex text-yellow-500">
          {[0,1,2,3,4].map(i => Star(i))}
        </span>
      </span>
    </span>
  );
}



/** Pre‑order CTA block (renders only when product.isPreOrder) */
const PreorderCTA = ({ product }) => {
  if (!product?.isPreOrder) return null
  const note = product.preOrderLeadTimeText || 'It will take up to 14–20 working days to arrive at your door step after pre‑ordering.'
  const advance = product.preOrderAdvancePercent ?? 50
  return (
    <div className="mt-3 rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
      <div className="text-xs text-neutral-700 dark:text-neutral-300">{note}</div>
      <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Advance payable now: <span className="font-medium">{advance}%</span> via bKash. Balance due as COD.</div>
      <div className="mt-2 flex gap-3">
  <Link href={`/preorder-checkout/${product.slug}`} className="mt-2 inline-block rounded-xl border border-black/10 bg-black px-4 py-2 text-white hover:opacity-90 dark:border-white/10 dark:bg-white dark:text-black">Pre‑order now</Link>
  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">Learn more</a>
</div>
    </div>
  )
}
