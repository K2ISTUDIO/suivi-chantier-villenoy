import { put, head, getDownloadUrl } from "@vercel/blob";

const BLOB_KEY = "villenoy-data.json";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const info = await head(BLOB_KEY, { token: process.env.BLOB_READ_WRITE_TOKEN });
      const response = await fetch(info.url);
      const data = await response.json();
      return res.status(200).json(data);
    } catch {
      // File doesn't exist yet, return empty
      return res.status(200).json(null);
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      await put(BLOB_KEY, body, {
        access: "public",
        contentType: "application/json",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).end();
}
