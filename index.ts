import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const urlDatabase = new Map<string, string>();

function generateShortCode(): string {
  return crypto.randomBytes(3).toString("hex"); // 6 char hex code
}

// Endpoint to create a short URL
app.post("/shorten", (req, res) => {
  const originalUrl = req.body.url;
  if (!originalUrl || typeof originalUrl !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }
  // Generate unique short code
  let shortCode = generateShortCode();
  while (urlDatabase.has(shortCode)) {
    shortCode = generateShortCode();
  }
  urlDatabase.set(shortCode, originalUrl);
  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}` });
});

// Redirect endpoint
app.get("/:code", (req, res) => {
  const code = req.params.code;
  const originalUrl = urlDatabase.get(code);
  if (originalUrl) {
    return res.redirect(originalUrl);
  }
  res.status(404).send("URL not found");
});

app.listen(port, () => {
  console.log(`URL Shortener running at http://localhost:${port}`);
});
