const express = require('express');
const router = express.Router();
const getSupabase = require('../utils/supabase');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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
    const supabase = getSupabase();
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

router.post('/', authenticate, upload.single('logo'), async (req, res) => {
  try {
    const supabase = getSupabase();
    const { name, category, description, color } = req.body;
    
    let logoUrl = null;
    
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('team-logos')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('team-logos')
        .getPublicUrl(fileName);
      
      logoUrl = publicUrl;
    }
    
    const { data, error } = await supabase
      .from('teams')
      .insert([{ name, category, description, color, logo_url: logoUrl }])
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
    const supabase = getSupabase();
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
