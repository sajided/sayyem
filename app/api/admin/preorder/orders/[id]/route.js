import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/db";
async function ensureDB(){ await dbConnect(); }
import Order from "../../../../../../models/Order";
export async function PUT(req, { params }) {
  await ensureDB();
  const id = params.id;
  const body = await req.json();
  const up = {};
  if (typeof body.status === "string") { up.currentStatus = body.status; up.$push = { statusHistory: { status: body.status, at: new Date() } }; }
  if (typeof body.preOrderAdvancePaid !== "undefined") {
    up.preOrderAdvancePaid = !!body.preOrderAdvancePaid;
    up.preOrderAdvancePaidAt = body.preOrderAdvancePaid ? new Date() : null;
  }
  if (typeof body.preOrderBalancePaid !== "undefined") {
    up.preOrderBalancePaid = !!body.preOrderBalancePaid;
    up.preOrderBalancePaidAt = body.preOrderBalancePaid ? new Date() : null;
  }
  if (typeof body.note === "string") up.adminNote = body.note;
  const updated = await Order.findByIdAndUpdate(id, up, { new: true });
  return NextResponse.json({ ok: true, data: updated });
}
