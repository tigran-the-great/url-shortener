import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { isURL } from "validator";
import Database from "better-sqlite3";

export function createUrlController(db: Database.Database) {
  return {
    createShortUrl: async (req: Request, res: Response) => {
      const { originalUrl } = req.body;
      if (!isURL(originalUrl, { require_protocol: true })) {
        res.status(400).json({ error: "Invalid URL" });
        return;
      }

      const slug = nanoid(6);

      try {
        const stmt = db.prepare(
          `INSERT INTO urls (slug, originalUrl) VALUES (?, ?)`
        );
        stmt.run(slug, originalUrl);

        res.json({ shortUrl: `http://localhost:5001/${slug}`, slug });
      } catch (err: any) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
          res.status(400).json({ error: "Slug already exists" });
          return;
        }
        res.status(500).json({ error: "Database error" });
        return;
      }
    },

    redirectToOriginalUrl: async (req: Request, res: Response) => {
      const { slug } = req.params;

      const stmt = db.prepare(`SELECT * FROM urls WHERE slug = ?`);
      const url = stmt.get(slug);

      if (!url) {
        res.status(404).send("Not found");
        return;
      }

      db.prepare(
        `UPDATE urls SET visitCount = visitCount + 1 WHERE slug = ?`
      ).run(slug);
      res.redirect((url as any).originalUrl);
    },

    getAllUrls: async (_req: Request, res: Response) => {
      const stmt = db.prepare(`SELECT * FROM urls ORDER BY createdAt DESC`);
      const urls = stmt.all();
      res.json(urls);
    },
  };
}
