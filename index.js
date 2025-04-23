const express = require('express');
const dotenv = require('dotenv');
const QRCode = require('qrcode');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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

// Serve manifest.json
app.use('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Serve service-worker.js
app.use('/service-worker.js', (req, res) => {
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
      <link rel="manifest" href="/manifest.json">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${process.env.SITE_TITLE}</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h1>${process.env.SITE_TITLE}</h1>
      <p>Scan the QR code below to connect to the WiFi network:</p>
      <div id="qrcode"></div>
      <script>
        fetch('/qrcode')
          .then(response => response.text())
          .then(html => {
            document.getElementById('qrcode').innerHTML = html;
          });
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});