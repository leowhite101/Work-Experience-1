const path = require('path');
const express = require('express');
const { sendToSupport } = require('./support');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.post('/contact', (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();

  // Challenge 3: Reject submissions that fill the honeypot
  const website = (req.body.website || '').trim();

  if (website) {
    return res.json({ ok: true });
  }

  if (!name || !email || !message) {


    return res.status(400).json({ ok: false, error: 'Please fill in your name, email and message.' });
  }

   // Challenge 3: Reject submissions made too quickly
  const formLoadedAt = Number(req.body.formLoadedAt);
  const elapsedTime = Date.now() - formLoadedAt;

  if (!Number.isFinite(formLoadedAt) ||
      formLoadedAt <= 0 ||
      elapsedTime < 3000) {
    return res.json({ ok: true });
  }

  sendToSupport({ name, email, message });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Calico Media site running at http://localhost:${PORT}`);
});
