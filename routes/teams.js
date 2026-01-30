const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

const authenticate = (req, res, next) => {
  const { email, password } = req.headers;
  console.log('Auth attempt:', { email, password, envEmail: process.env.ADMIN_EMAIL, envPass: process.env.ADMIN_PASSWORD });
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, category, description, color } = req.body;
    
    const { data, error } = await supabase
      .from('teams')
      .insert([{ name, category, description, color }])
      .select()
      .single();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
