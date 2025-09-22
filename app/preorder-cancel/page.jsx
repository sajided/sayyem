import Link from "next/link";

export default async function Page(){
  return (
    <div className="mx-auto max-w-3xl py-10 px-4">
      <div className="rounded-2xl border border-black/10 p-6 shadow-sm dark:border-white/10">
        <h1 className="text-2xl font-semibold">Payment Cancelled</h1>
        <p className="mt-3 text-sm opacity-80">
          Your UddoktaPay payment was cancelled. Your pre‑order is saved as <span className="font-medium">unpaid</span>.
          You can try paying the advance again from the order page, or choose a different method if available.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/" className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">Home</Link>
          <Link href="/track" className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">Track Order</Link>
        </div>
      </div>
    </div>
  )
}