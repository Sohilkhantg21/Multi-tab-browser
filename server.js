const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/start', async (req, res) => {
  const { link, tabs } = req.body;

  const proxy = 'http://username:password@proxy-ip:port'; // Replace with your real proxy

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${proxy}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    for (let i = 0; i < parseInt(tabs); i++) {
      const page = await browser.newPage();
      await page.goto(link, { waitUntil: 'domcontentloaded' });
      console.log(`Tab ${i + 1} opened.`);
    }

    res.json({ message: `${tabs} tabs opened through proxy.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error launching tabs." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
