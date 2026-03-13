export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY non configuré dans Vercel' });
  }

  try {
    const { event, type = 'reminder', lang = 'fr' } = req.body;

    if (!event || !event.clientEmail) {
      return res.status(400).json({ error: 'Courriel client manquant' });
    }

    const isEn = lang === 'en';

    // Format date lisible
    const dateParts = event.date ? event.date.split('-') : [];
    const months_fr = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const months_en = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateReadable = dateParts.length === 3
      ? isEn
        ? `${months_en[parseInt(dateParts[1]) - 1]} ${parseInt(dateParts[2])}, ${dateParts[0]}`
        : `${parseInt(dateParts[2])} ${months_fr[parseInt(dateParts[1]) - 1]} ${dateParts[0]}`
      : event.date;

    // Sujet et corps selon le type
    let subject, htmlBody;

    if (type === 'reminder') {
      subject = isEn
        ? `Appointment Reminder – ${event.title} on ${dateReadable}`
        : `Rappel de rendez-vous – ${event.title} le ${dateReadable}`;

      htmlBody = isEn ? `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
          <div style="background:#0c2240;padding:24px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">⚙️ Appointment Reminder</h1>
          </div>
          <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #dee2e6;border-top:none">
            <p style="font-size:16px">Hello ${event.clientName || 'valued client'},</p>
            <p>This is a reminder for your upcoming appointment:</p>
            <div style="background:white;padding:20px 24px;border-radius:8px;border-left:4px solid #0c2240;margin:20px 0">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#666;width:120px">📋 Service</td><td style="padding:6px 0;font-weight:bold">${event.title}</td></tr>
                <tr><td style="padding:6px 0;color:#666">📅 Date</td><td style="padding:6px 0;font-weight:bold">${dateReadable}</td></tr>
                <tr><td style="padding:6px 0;color:#666">🕐 Time</td><td style="padding:6px 0;font-weight:bold">${event.time || ''}</td></tr>
                ${event.address ? `<tr><td style="padding:6px 0;color:#666">📍 Address</td><td style="padding:6px 0">${event.address}</td></tr>` : ''}
                ${event.duration ? `<tr><td style="padding:6px 0;color:#666">⏱ Duration</td><td style="padding:6px 0">${event.duration} hour(s)</td></tr>` : ''}
                ${event.notes ? `<tr><td style="padding:6px 0;color:#666">📝 Notes</td><td style="padding:6px 0">${event.notes}</td></tr>` : ''}
              </table>
            </div>
            <p>If you have any questions or need to reschedule, please don't hesitate to contact us.</p>
            <p style="color:#666;font-size:13px">Thank you for choosing our services.</p>
          </div>
        </div>
      ` : `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
          <div style="background:#0c2240;padding:24px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">⚙️ Rappel de rendez-vous</h1>
          </div>
          <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #dee2e6;border-top:none">
            <p style="font-size:16px">Bonjour ${event.clientName || 'cher client'},</p>
            <p>Voici un rappel pour votre rendez-vous à venir :</p>
            <div style="background:white;padding:20px 24px;border-radius:8px;border-left:4px solid #0c2240;margin:20px 0">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#666;width:120px">📋 Service</td><td style="padding:6px 0;font-weight:bold">${event.title}</td></tr>
                <tr><td style="padding:6px 0;color:#666">📅 Date</td><td style="padding:6px 0;font-weight:bold">${dateReadable}</td></tr>
                <tr><td style="padding:6px 0;color:#666">🕐 Heure</td><td style="padding:6px 0;font-weight:bold">${event.time || ''}</td></tr>
                ${event.address ? `<tr><td style="padding:6px 0;color:#666">📍 Adresse</td><td style="padding:6px 0">${event.address}</td></tr>` : ''}
                ${event.duration ? `<tr><td style="padding:6px 0;color:#666">⏱ Durée</td><td style="padding:6px 0">${event.duration} heure(s)</td></tr>` : ''}
                ${event.notes ? `<tr><td style="padding:6px 0;color:#666">📝 Notes</td><td style="padding:6px 0">${event.notes}</td></tr>` : ''}
              </table>
            </div>
            <p>Si vous avez des questions ou souhaitez reporter le rendez-vous, n'hésitez pas à nous contacter.</p>
            <p style="color:#666;font-size:13px">Merci de faire confiance à nos services.</p>
          </div>
        </div>
      `;
    } else if (type === 'confirmation') {
      subject = isEn
        ? `Appointment Confirmation – ${event.title} on ${dateReadable}`
        : `Confirmation de rendez-vous – ${event.title} le ${dateReadable}`;

      htmlBody = isEn ? `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
          <div style="background:#16a34a;padding:24px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">✅ Appointment Confirmed</h1>
          </div>
          <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #dee2e6;border-top:none">
            <p style="font-size:16px">Hello ${event.clientName || 'valued client'},</p>
            <p>Your appointment has been confirmed. Here are the details:</p>
            <div style="background:white;padding:20px 24px;border-radius:8px;border-left:4px solid #16a34a;margin:20px 0">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#666;width:120px">📋 Service</td><td style="padding:6px 0;font-weight:bold">${event.title}</td></tr>
                <tr><td style="padding:6px 0;color:#666">📅 Date</td><td style="padding:6px 0;font-weight:bold">${dateReadable}</td></tr>
                <tr><td style="padding:6px 0;color:#666">🕐 Time</td><td style="padding:6px 0;font-weight:bold">${event.time || ''}</td></tr>
                ${event.address ? `<tr><td style="padding:6px 0;color:#666">📍 Address</td><td style="padding:6px 0">${event.address}</td></tr>` : ''}
                ${event.duration ? `<tr><td style="padding:6px 0;color:#666">⏱ Duration</td><td style="padding:6px 0">${event.duration} hour(s)</td></tr>` : ''}
              </table>
            </div>
            <p style="color:#666;font-size:13px">Thank you for choosing our services. See you soon!</p>
          </div>
        </div>
      ` : `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
          <div style="background:#16a34a;padding:24px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">✅ Rendez-vous confirmé</h1>
          </div>
          <div style="background:#f8f9fa;padding:32px;border-radius:0 0 12px 12px;border:1px solid #dee2e6;border-top:none">
            <p style="font-size:16px">Bonjour ${event.clientName || 'cher client'},</p>
            <p>Votre rendez-vous a été confirmé. Voici les détails :</p>
            <div style="background:white;padding:20px 24px;border-radius:8px;border-left:4px solid #16a34a;margin:20px 0">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:6px 0;color:#666;width:120px">📋 Service</td><td style="padding:6px 0;font-weight:bold">${event.title}</td></tr>
                <tr><td style="padding:6px 0;color:#666">📅 Date</td><td style="padding:6px 0;font-weight:bold">${dateReadable}</td></tr>
                <tr><td style="padding:6px 0;color:#666">🕐 Heure</td><td style="padding:6px 0;font-weight:bold">${event.time || ''}</td></tr>
                ${event.address ? `<tr><td style="padding:6px 0;color:#666">📍 Adresse</td><td style="padding:6px 0">${event.address}</td></tr>` : ''}
                ${event.duration ? `<tr><td style="padding:6px 0;color:#666">⏱ Durée</td><td style="padding:6px 0">${event.duration} heure(s)</td></tr>` : ''}
              </table>
            </div>
            <p style="color:#666;font-size:13px">Merci de faire confiance à nos services. À bientôt !</p>
          </div>
        </div>
      `;
    }

    // Expéditeur — utilise ton domaine vérifié dans Resend, sinon domaine de test
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const fromName  = process.env.RESEND_FROM_NAME  || 'Révolution Plomberie';

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to:   [event.clientEmail],
        subject,
        html: htmlBody,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend error:', result);
      return res.status(response.status).json({ error: result.message || 'Erreur Resend' });
    }

    return res.status(200).json({ success: true, id: result.id });

  } catch (err) {
    console.error('send-reminder error:', err);
    return res.status(500).json({ error: err.message });
  }
}
