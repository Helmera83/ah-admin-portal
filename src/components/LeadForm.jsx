// Inside src/components/LeadForm.jsx inside handleSubmit()

// 1. Existing customer upsert
const { data: customerData, error: customerError } = await supabase
  .from('customers')
  .upsert(
    {
      full_name: formData.fullName.trim(),
      email: cleanEmail,
      phone: formData.phone.trim() || null,
      source: attribution.utm_source === 'facebook' ? 'facebook_lead_ad' : 'website',
      metadata: {
        company_name: formData.companyName.trim() || null,
        service_need: formData.serviceNeed,
        primary_bottleneck: formData.primaryBottleneck.trim() || null,
        fbclid: attribution.fbclid,
        utm_campaign: attribution.utm_campaign,
        utm_medium: attribution.utm_medium,
        utm_content: attribution.utm_content,
        referrer: attribution.referrer,
      },
    },
    { onConflict: 'email' }
  )
  .select('id')
  .single();

if (customerError) throw customerError;

// 2. Dispatch automated email using Resend REST API (Pure JS fetch)
const resendKey = import.meta.env.VITE_RESEND_API_KEY;

if (resendKey) {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f1f4f8; padding: 30px 15px;">
        <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          <tr>
            <td style="background-color: #10223f; padding: 20px 30px;">
              <span style="color: #ffffff; font-size: 16px; font-weight: 800; text-transform: uppercase;">Administrative Solutions</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #10223f; font-weight: 700;">Hello ${formData.fullName.trim()},</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                Thank you for reaching out regarding <strong>${formData.serviceNeed}</strong>! I have received your operational inquiry for <strong>${formData.companyName.trim() || 'your organization'}</strong>.
              </p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                To help us prepare for an initial review, please take a moment to complete our client intake questionnaire:
              </p>
              <table width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://ah-admin-portal-wz2y.vercel.app/intake?view=intake" style="background-color: #159e9c; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 4px; text-transform: uppercase; display: inline-block;">
                      Client Intake &amp; Discovery Form &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                Thank you,<br>Amanda Helmer
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AH Administrative Solutions <onboarding@resend.dev>', // or your verified domain
        to: [cleanEmail],
        subject: `Operational Discovery & Next Steps for ${formData.fullName.trim()}`,
        html: emailHtml,
      }),
    });

    // 3. Log email dispatch event to Supabase
    await supabase.from('customer_events').insert([
      {
        customer_id: customerData?.id,
        source: 'client_autoresponder',
        event_name: 'email_dispatched',
        payload: {
          recipient: cleanEmail,
          template: 'first_contact.html',
          target_url: 'https://ah-admin-portal-wz2y.vercel.app/intake?view=intake',
          dispatched_at: new Date().toISOString(),
        },
      },
    ]);
  } catch (mailErr) {
    console.error('Auto-email dispatch failed:', mailErr);
  }
}