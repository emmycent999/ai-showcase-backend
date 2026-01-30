const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.json({ registered: false });
    }

    res.json({ registered: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
