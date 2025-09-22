import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
async function ensureDB(){ await dbConnect(); }
    else if (db?.dbConnect) { await db.dbConnect(); }
  } catch(e){
    // ignore - fail later if models can't query
  }
}
async function loadOrderModel(){
  try{
    const m = await import("../../../../models/Order.js").catch(()=>import("../../../../models/Order"));
    return m.default ?? m;
  } catch(e){ return null; }
}
function normPhone(raw){
  const s = String(raw||"").trim();
  const digits = s.replace(/\D+/g, "");
  let local = digits;
  if (digits.startsWith("88") && digits.length >= 13) local = digits.slice(-11);
  if (digits.startsWith("880") && digits.length >= 13) local = digits.slice(-11);
  if (digits.length > 11) local = digits.slice(-11);
  if (local.length === 10 && local[0] === "1") local = "0"+local;
  const intl = "+880" + (local.startsWith("0") ? local.slice(1) : local);
  return { local, intl, last11: local.slice(-11) };
}
function escapeRegExp(str){ return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function isPre(o){
  return !!(o?.isPreOrder || o?.preorder || o?.kind === "preorder" || o?.type === "preorder" || o?.advancePercent != null || o?.productTitle);
}
function singleItemFromPre(o){
  const qty = Number(o?.qty ?? o?.quantity ?? 1) || 1;
  const title = o?.productTitle ?? o?.title ?? o?.name ?? o?.slug ?? "Pre‑order item";
  const price = Number(o?.unit ?? o?.unitPrice ?? o?.price ?? 0) || 0;
  const image = o?.productImage ?? (Array.isArray(o?.images)?o.images[0]:null) ?? null;
  const slug = o?.slug ?? o?.productSlug ?? null;
  const id = o?.productId ?? null;
  return [{ title, qty, price, image, slug, productId: id }];
}
function computeTotalsPre(o){
  const advancePercent = Number(o?.advancePercent ?? o?.preOrderAdvancePercent ?? 0) || 0;
  const unit = Number(o?.unit ?? o?.unitPrice ?? o?.price ?? 0) || 0;
  const qty = Number(o?.qty ?? o?.quantity ?? 1) || 1;
  const subtotal = unit * qty;
  const delivery = Number(o?.deliveryFee ?? o?.shippingFee ?? 0) || 0;
  const total = Number(o?.total ?? o?.grandTotal ?? (subtotal + delivery)) || (subtotal + delivery);
  const paid = typeof o?.paid === "number" ? o.paid :
    Array.isArray(o?.payments) ? o.payments.reduce((s,p)=> s + (Number(p?.amount)||0), 0) :
    Number(o?.advancePaid ?? 0) || 0;
  const due = Math.max(total - paid, 0);
  return { subtotal, delivery, total, paid, due, advancePercent };
}
export async function POST(req){
  await ensureDB();
  const Order = await loadOrderModel();
  if (!Order) return NextResponse.json({ ok:false, error:"Preorder/Order model not found" }, { status:500 });
  let body = {};
  try { body = await req.json(); } catch {}
  const phone = body?.phone ?? "";
  const { local, intl, last11 } = normPhone(phone);
  const rx = new RegExp(escapeRegExp(last11) + "$");
  const list = await Order.find({
    $and: [
      { $or: [ { phone: local }, { phone: intl }, { phone: { $regex: rx } } ] },
      { $or: [ { isPreOrder: true }, { kind: "preorder" }, { type: "preorder" }, { advancePercent: { $exists: true } }, { productTitle: { $exists: true } } ] }
    ]
  }).sort({ createdAt: -1 }).limit(50).lean();
  const filtered = list.filter(o=>{
    // only paid pre‑orders are trackable
    const paid = typeof o?.paid === "number" ? o.paid :
      Array.isArray(o?.payments) ? o.payments.reduce((s,p)=> s + (Number(p?.amount)||0), 0) : 0;
    return paid > 0;
  });
  const data = filtered.map(o=>{
    const items = singleItemFromPre(o);
    const { subtotal, delivery, total, paid, due, advancePercent } = computeTotalsPre(o);
    return {
      id: String(o._id),
      createdAt: o.createdAt ?? null,
      status: o.status ?? "approved",
      name: o.name ?? "",
      phone: o.phone ?? "",
      address: o.address ?? "",
      city: o.city ?? "",
      items,
      subtotal, delivery, total, paid, due,
      advancePercent,
      type: "preorder",
      productTitle: o.productTitle ?? items[0]?.title ?? null,
      productImage: items[0]?.image ?? null,
      slug: items[0]?.slug ?? null
    };
  });
  return NextResponse.json({ ok:true, data });
}
