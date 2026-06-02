// Supabase Edge Function: send-order-email
// Called after a successful order. Sends notification email via Resend.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const order = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'admin@elyvate.com';
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'orders@elyvate.com';

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const itemRows = order.items.map((item: any) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">$${item.price.toFixed(2)}</td>
      </tr>`
    ).join('');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Order - ${order.id}</title></head>
<body style="font-family:system-ui,sans-serif;background:#f8f9fb;margin:0;padding:32px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6d28d9,#8b5cf6);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:0.05em;">ELYVATE</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">New Order Received 🎉</p>
    </div>

    <!-- Order Meta -->
    <div style="padding:28px 32px 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div>
          <p style="margin:0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Order ID</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#1e1b4b;">${order.id}</p>
        </div>
        <div style="background:#ede9fe;color:#6d28d9;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;">
          ${order.status}
        </div>
      </div>

      <!-- Customer Info -->
      <div style="background:#f8f9fb;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Customer Details</p>
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#111;">${order.customerName}</p>
        <p style="margin:0 0 4px;font-size:13px;color:#555;">${order.customerEmail}</p>
        <p style="margin:0;font-size:13px;color:#555;">${order.customerPhone}</p>
      </div>

      <!-- Shipping Address -->
      <div style="background:#f8f9fb;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Ship To</p>
        <p style="margin:0;font-size:13px;color:#333;line-height:1.6;">
          ${order.shippingAddress.address}${order.shippingAddress.apartment ? ', ' + order.shippingAddress.apartment : ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>

      <!-- Items Table -->
      <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Items Ordered</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
        <thead>
          <tr style="background:#f3f0ff;">
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#6d28d9;text-transform:uppercase;">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:11px;color:#6d28d9;text-transform:uppercase;">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;color:#6d28d9;text-transform:uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Totals -->
      <div style="border-top:2px solid #f0f0f0;padding-top:16px;margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#555;">Subtotal</span>
          <span style="font-size:13px;color:#111;">$${order.subtotal.toFixed(2)}</span>
        </div>
        ${order.discount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#16a34a;">Discount${order.couponCode ? ' (' + order.couponCode + ')' : ''}</span>
          <span style="font-size:13px;color:#16a34a;">-$${order.discount.toFixed(2)}</span>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#555;">Shipping</span>
          <span style="font-size:13px;color:#16a34a;">FREE</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #f0f0f0;margin-top:8px;">
          <span style="font-size:15px;font-weight:800;color:#111;">Total</span>
          <span style="font-size:15px;font-weight:800;color:#6d28d9;">$${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1e1b4b;padding:20px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">Go to your <strong style="color:#a78bfa;">Admin Panel</strong> to update order status and arrange shipping.</p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `ELYVATE Orders <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `🛒 New Order ${order.id} — $${order.total.toFixed(2)} from ${order.customerName}`,
        html,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
