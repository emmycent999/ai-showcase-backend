const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { generateCertificate } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/email');
const fs = require('fs');

router.post('/send', async (req, res) => {
  try {
    const { email, password } = req.headers;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.body;
    const { data: user, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pdfPath = await generateCertificate(user, user.type);
    
    await sendEmail(
      user.email,
      'Your AI Showcase Certificate',
      `<h2>Congratulations ${user.full_name}!</h2><p>Thank you for participating in the AI Showcase & Hackathon. Please find your certificate attached.</p>`,
      [{ filename: 'certificate.png', path: pdfPath }]
    );

    fs.unlinkSync(pdfPath);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/send-all', async (req, res) => {
  try {
    const { email, password } = req.headers;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: users } = await supabase.from('registrations').select('*');
    
    for (const user of users) {
      const pdfPath = await generateCertificate(user, user.type);
      await sendEmail(
        user.email,
        'Your AI Showcase Certificate',
        `<h2>Congratulations ${user.full_name}!</h2><p>Thank you for participating in the AI Showcase & Hackathon. Please find your certificate attached.</p>`,
        [{ filename: 'certificate.png', path: pdfPath }]
      );
      fs.unlinkSync(pdfPath);
    }

    res.json({ success: true, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
