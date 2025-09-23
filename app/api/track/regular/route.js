import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
async function ensureDB() {
  await dbConnect();
}

  
async function loadOrderModel(){
  try{
    const m = await import("../../../../models/Order.js").catch(()=>import("../../../../models/Order"));
    return m.default ?? m;
  } catch(e){
    return null;
  }
}
function normPhone(raw){
  const s = String(raw||"").trim();
  const digits = s.replace(/\D+/g, "");
  // Bangladesh: prefer 11-digit local starting with 01, and +8801... variants
  let local = digits;
  if (digits.startsWith("88") && digits.length >= 13) local = digits.slice(-11);
  if (digits.startsWith("880") && digits.length >= 13) local = digits.slice(-11);
  if (digits.length > 11) local = digits.slice(-11);
  if (local.length === 10 && local[0] === "1") local = "0"+local;
  const intl = "+880" + (local.startsWith("0") ? local.slice(1) : local);
  return { local, intl, last11: local.slice(-11) };
}
function escapeRegExp(str){ return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function deriveItems(o){
  const items = Array.isArray(o?.items) ? o.items : Array.isArray(o?.cart?.items) ? o.cart.items : [];
  return items.map(it => ({
    title: it?.title ?? it?.name ?? it?.productTitle ?? it?.slug ?? "Item",
    qty: Number(it?.qty ?? it?.quantity ?? 1) || 1,
    price: Number(it?.price ?? it?.unitPrice ?? 0) || 0,
    image: it?.image ?? it?.productImage ?? null,
    slug: it?.slug ?? it?.productSlug ?? null,
    productId: it?.productId ?? it?.product ?? it?._id ?? null,
  }));
}
function computeTotals(o){
  const items = deriveItems(o);
  const subtotal = items.reduce((s, it)=> s + (Number(it.price)||0) * (Number(it.qty)||1), 0);
  const delivery = Number(o?.deliveryFee ?? o?.shippingFee ?? o?.deliveryCharge ?? 0) || 0;
  const total = Number(o?.total ?? o?.grandTotal ?? (subtotal + delivery)) || (subtotal + delivery);
  const paid = typeof o?.paid === "number" ? o.paid :
    Array.isArray(o?.payments) ? o.payments.reduce((s,p)=> s + (Number(p?.amount)||0), 0) : 0;
  const due = Math.max(total - paid, 0);
  return { subtotal, delivery, total, paid, due };
}
export async function POST(req){
  await ensureDB();
  const Order = await loadOrderModel();
  if (!Order) return NextResponse.json({ ok:false, error:"Order model not found" }, { status:500 });
  let body = {};
  try { body = await req.json(); } catch {}
  const phone = body?.phone ?? "";
  const { local, intl, last11 } = normPhone(phone);
  const rx = new RegExp(escapeRegExp(last11) + "$");
  const list = await Order.find({
    $or: [
      { phone: local }, { phone: intl },
      { phone: { $regex: rx } }
    ]
  }).sort({ createdAt: -1 }).limit(50).lean();
  const data = list.map(o => {
    const { subtotal, delivery, total, paid, due } = computeTotals(o);
    return {
      id: String(o._id),
      createdAt: o.createdAt ?? o.created_at ?? null,
      status: o.status ?? "processing",
      name: o.name ?? o.customerName ?? "",
      phone: o.phone ?? "",
      address: o.address ?? "",
      city: o.city ?? "",
      items: deriveItems(o),
      subtotal, delivery, total, paid, due,
      type: "regular"
    };
  });
  return NextResponse.json({ ok:true, data });
}
