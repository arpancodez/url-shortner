import express from "express";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import { Low, JSONFile } from "lowdb";
import { join } from "path";
import validator from "validator";
import QRCode from "qrcode";
import path from "path";

// ------------------------
// Types and DB Setup
// ------------------------
type UrlRecord = {
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
};

type Data = {
  urls: UrlRecord[];
};

const dbFile = join(__dirname, "db.json");
const adapter = new JSONFile<Data>(dbFile);
const db = new Low<Data>(adapter);

await db.read();
db.data ||= { urls: [] };
await db.write();

// ------------------------
// App Setup
// ------------------------
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve Admin Dashboard
app.use("/admin", express.static(path.join(__dirname, "public")));

// ------------------------
// Utility Functions
// ------------------------
function generateShortCode(): string {
  return nanoid(6);
}

function getUrlRecordByOriginalUrl(originalUrl: string): UrlRecord | undefined {
  return db.data?.urls.find((url) => url.originalUrl === originalUrl);
}

function getUrlRecordByShortCode(shortCode: string): UrlRecord | undefined {
  return db.data?.urls.find((url) => url.shortCode === shortCode);
}

// ------------------------
// POST /shorten
// ------------------------
app.post("/shorten", async (req, res) => {
  const { url, customCode, expiresIn } = req.body;

  if (!url || !validator.isURL(url)) {
    return res.status(400).json({ error: "Invalid or missing URL." });
  }

  const existing = getUrlRecordByOriginalUrl(url);
  if (existing) {
    return res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${existing.shortCode}` });
  }

  let shortCode = customCode || generateShortCode();
  if (customCode) {
    if (!/^[a-zA-Z0-9_-]{4,10}$/.test(customCode)) {
      return res.status(400).json({ error: "Custom code must be 4–10 alphanumeric characters." });
    }
    if (getUrlRecordByShortCode(customCode)) {
      return res.status(409).json({ error: "Custom code already in use." });
    }
  } else {
    while (getUrlRecordByShortCode(shortCode)) {
      shortCode = generateShortCode();
    }
  }

  const now = new Date();
  const expiresAt = expiresIn
    ? new Date(now.getTime() + parseInt(expiresIn) * 1000).toISOString()
    : undefined;

  const record: UrlRecord = {
    originalUrl: url,
    shortCode,
    createdAt: now.toISOString(),
    expiresAt,
    clicks: 0,
  };

  db.data?.urls.push(record);
  await db.write();

  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}` });
});

// ------------------------
// GET /:code - Redirect
// ------------------------
app.get("/:code", async (req, res) => {
  const { code } = req.params;
  const record = getUrlRecordByShortCode(code);

  if (!record) {
    return res.status(404).send("Short URL not found.");
  }

  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    return res.status(410).send("This link has expired.");
  }

  record.clicks += 1;
  await db.write();

  res.redirect(record.originalUrl);
});

// ------------------------
// GET /analytics/:code
// ------------------------
app.get("/analytics/:code", (req, res) => {
  const { code } = req.params;
  const record = getUrlRecordByShortCode(code);

  if (!record) {
    return res.status(404).json({ error: "Code not found" });
  }

  res.json({
    originalUrl: record.originalUrl,
    shortCode: record.shortCode,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt || null,
    clicks: record.clicks,
  });
});

// ------------------------
// Admin Dashboard Routes
// ------------------------

// GET all records for dashboard
app.get("/admin/data", (req, res) => {
  res.json(db.data?.urls || []);
});

// Generate QR code image
app.get("/qr/:code", async (req, res) => {
  const { code } = req.params;
  const record = getUrlRecordByShortCode(code);

  if (!record) return res.status(404).send("Invalid code");

  const shortUrl = `${req.protocol}://${req.get("host")}/${record.shortCode}`;
  try {
    const qr = await QRCode.toDataURL(shortUrl);
    const img = Buffer.from(qr.split(",")[1], "base64");
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (err) {
    res.status(500).send("QR generation failed");
  }
});

// ------------------------
// Start Server
// ------------------------
app.listen(port, () => {
  console.log(`🚀 URL Shortener running at http://localhost:${port}`);
});
