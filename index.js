const express = require('express');
const dotenv = require('dotenv');
const QRCode = require('qrcode');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = 4000;

// Serve static files with cache-control
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webmanifest') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Generate QR code for WiFi login
app.get('/qrcode', async (req, res) => {
  const ssid = process.env.WIFI_NAME;
  const password = process.env.WIFI_PASSWORD;
  const qrData = `WIFI:T:WPA;S:${ssid};P:${password};;`;

  try {
    const qrCode = await QRCode.toDataURL(qrData);
    res.send(`<img src="${qrCode}" alt="WiFi QR Code" />`);
  } catch (err) {
    res.status(500).send('Error generating QR code');
  }
});

// Serve manifest.webmanifest
app.use('/manifest.webmanifest', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.sendFile(path.join(__dirname, 'public', 'manifest.webmanifest'));
});

// Serve service-worker.js
app.use('/service-worker.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'public', 'service-worker.js'));
});

// Home route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link rel="manifest" href="/manifest.webmanifest">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${process.env.SITE_TITLE}</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <footer class="site-header">${process.env.SITE_FOOTER_TOP}</footer>
      <h1>${process.env.SITE_TITLE}</h1>
      <p>${process.env.SITE_INFO}</p>
      <div id="qrcode"></div>
      <script>
        fetch('/qrcode')
          .then(response => response.text())
          .then(html => {
            document.getElementById('qrcode').innerHTML = html;
          });
      </script>
      <footer class="site-footer">${process.env.SITE_FOOTER_BOTTOM}</footer>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});