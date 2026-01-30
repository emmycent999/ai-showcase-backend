const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

const authenticate = (req, res, next) => {
  const { email, password } = req.headers;
  console.log('Auth check:', { received: { email, password }, expected: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD } });
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.get('/registrations', authenticate, async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = supabase.from('registrations').select('*');

    if (type) query = query.eq('type', type);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/votes', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase.from('votes').select('*');
    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
