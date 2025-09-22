
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Tab({ active, onClick, children }){
  return (
    <button onClick={onClick}
      className={"px-3 py-2 rounded-lg text-sm " + (active ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent")}>
      {children}
    </button>
  );
}

function OrderCard({ o }){
  return (
    <div className="rounded-2xl border border-black/10 p-4 shadow-sm bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] opacity-70">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</div>
          <div className="font-mono text-[11px]">{o.id}</div>
        </div>
        <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs dark:border-white/10">{(o.status||"").replaceAll("_"," ")||"—"}</span>
      </div>

      <div className="mt-3 grid gap-3 text-sm">
        <div className="font-medium">{o.type === "preorder" ? (o.productTitle || (o.items?.[0]?.title) || "Preorder") : o.name}</div>
        <div className="opacity-70 text-xs">{o.city ? (o.city) : null}</div>

        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            {Array.isArray(o.items) && o.items.map((it, idx)=>(
              <div key={idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.title||'Item'} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-xs opacity-50">No image</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium line-clamp-2">{it.title || "—"}</div>
                    {it.slug && <div className="text-[11px] opacity-70">{it.slug}</div>}
                  </div>
                </div>
                <div className="text-right text-sm whitespace-nowrap">× {it.qty}</div>
              </div>
            ))}
{(!Array.isArray(o.items) || o.items.length === 0) && (o.type === "preorder") && (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
        {o.productImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={o.productImage} alt={o.productTitle||'Item'} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-xs opacity-50">No image</div>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-medium line-clamp-2">{o.productTitle || "—"}</div>
        {o.slug && <div className="text-[11px] opacity-70">{o.slug}</div>}
      </div>
    </div>
    <div className="text-right text-sm whitespace-nowrap">× {o.items?.[0]?.qty || o.qty || 1}</div>
  </div>
)}

          </div>
        </div>

        {o.type==="preorder" && o.slug && <div className="mt-2 text-xs"><a href={`/product/${o.slug}`} className="underline">View product page</a></div>}
        <div className="grid grid-cols-3 items-center gap-2 text-sm">
          <div className="truncate"><span className="opacity-70">Total:</span> ৳{o.total}</div>
          <div className="truncate text-emerald-600 dark:text-emerald-400 text-xs"><span className="opacity-70">Paid:</span> ৳{o.paid}</div>
          <div className="truncate text-xs opacity-70"><span className="">Due:</span> ৳{o.due}</div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage(){
  const [tab, setTab] = useState("regular"); // 'regular' | 'preorder'
  const [phoneRegular, setPhoneRegular] = useState("");
  const [phonePre, setPhonePre] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsRegular, setResultsRegular] = useState([]);
  const [resultsPre, setResultsPre] = useState([]);
  const [message, setMessage] = useState("");

  async function searchRegular(){
    setLoading(true); setMessage("");
    try{
      const r = await fetch("/api/track/regular", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ phone: phoneRegular }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Request failed");
      setResultsRegular(j.data || []);
      if ((j.data||[]).length === 0) setMessage("No regular orders found.");
    } catch(e){ setMessage(e.message); }
    finally { setLoading(false); }
  }

  async function searchPreorder(){
    setLoading(true); setMessage("");
    try{
      const r = await fetch("/api/track/preorder", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ phone: phonePre }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Request failed");
      setResultsPre(j.data || []);
      if ((j.data||[]).length === 0) setMessage("No pre‑orders found.");
    } catch(e){ setMessage(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Track your order</h1>

      <div className="mt-4 rounded-xl border border-black/10 p-1 inline-flex dark:border-white/10">
        <Tab active={tab==="regular"} onClick={()=>setTab("regular")}>Regular Order</Tab>
        <Tab active={tab==="preorder"} onClick={()=>setTab("preorder")}>Pre‑order</Tab>
      </div>

      {tab === "regular" && (
        <section className="mt-6 rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
          <label className="text-xs">Phone number</label>
          <div className="mt-1 flex gap-2">
            <input value={phoneRegular} onChange={e=>setPhoneRegular(e.target.value)}
              placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
              className="flex-1 rounded-xl border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-black/60" />
            <button onClick={searchRegular} disabled={loading}
              className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black">
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {resultsRegular.map(o=> <OrderCard key={o.id} o={o} />)}
          </div>
          {message && <div className="mt-3 text-sm opacity-70">{message}</div>}
        </section>
      )}

      {tab === "preorder" && (
        <section className="mt-6 rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
          <label className="text-xs">Phone number</label>
          <div className="mt-1 flex gap-2">
            <input value={phonePre} onChange={e=>setPhonePre(e.target.value)}
              placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
              className="flex-1 rounded-xl border border-black/10 px-3 py-2 dark:border-white/10 dark:bg-black/60" />
            <button onClick={searchPreorder} disabled={loading}
              className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black">
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {resultsPre.map(o=> <OrderCard key={o.id} o={o} />)}
          </div>
          {message && <div className="mt-3 text-sm opacity-70">{message}</div>}
        </section>
      )}

      <div className="mt-6 text-sm opacity-70">
        Having trouble? <Link href="/contact" className="underline">Contact support</Link>
      </div>
    </div>
  );
}