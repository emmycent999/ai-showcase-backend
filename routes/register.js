const express = require('express');
const router = express.Router();
const getSupabase = require('../utils/supabase');

router.post('/', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { type, ...userData } = req.body;

    const { data: existing } = await supabase
      .from('registrations')
      .select('email')
      .eq('email', userData.email)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert([{ ...userData, type, created_at: new Date() }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
