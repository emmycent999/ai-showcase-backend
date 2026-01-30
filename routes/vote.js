const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

router.post('/', async (req, res) => {
  try {
    const { email, team_name } = req.body;

    const { data: user } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }

    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('email', email)
      .single();

    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted' });
    }

    const { data, error } = await supabase
      .from('votes')
      .insert([{ email, team_name, voted_at: new Date() }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
