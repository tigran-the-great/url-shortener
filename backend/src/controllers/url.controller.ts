import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { isURL } from "validator";
import Database from "better-sqlite3";

// Factory function that returns controller methods using the injected DB instance
export function createUrlController(db: Database.Database) {
  return {
    // POST /shorten - Creates a shortened URL entry
    createShortUrl: async (req: Request, res: Response) => {
      const { originalUrl } = req.body;

      // Validate URL with protocol
      if (!isURL(originalUrl, { require_protocol: true })) {
        res.status(400).json({ error: "Invalid URL" });
        return;
      }

      const slug = nanoid(6); // Generate 6-character unique slug

      try {
        // Insert new shortened URL into the database
        const stmt = db.prepare(
          `INSERT INTO urls (slug, originalUrl) VALUES (?, ?)`
        );
        stmt.run(slug, originalUrl);

        // Respond with the shortened URL
        res.json({ shortUrl: `http://localhost:5001/${slug}`, slug });
      } catch (err: any) {
        // Handle slug uniqueness violation
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
          res.status(400).json({ error: "Slug already exists" });
          return;
        }
        // Handle generic database errors
        res.status(500).json({ error: "Database error" });
        return;
      }
    },

    // GET /:slug - Redirects to the original URL based on slug
    redirectToOriginalUrl: async (req: Request, res: Response) => {
      const { slug } = req.params;

      // Fetch the original URL from the database
      const stmt = db.prepare(`SELECT * FROM urls WHERE slug = ?`);
      const url = stmt.get(slug);

      // If slug not found, return 404
      if (!url) {
        res.status(404).send("Not found");
        return;
      }

      // Increment visit count for analytics
      db.prepare(
        `UPDATE urls SET visitCount = visitCount + 1 WHERE slug = ?`
      ).run(slug);

      // Redirect to the original URL
      res.redirect((url as any).originalUrl);
    },

    // GET /urls - Returns a list of all shortened URLs
    getAllUrls: async (_req: Request, res: Response) => {
      const stmt = db.prepare(`SELECT * FROM urls ORDER BY createdAt DESC`);
      const urls = stmt.all();

      // Respond with all stored URLs
      res.json(urls);
    },
  };
}
