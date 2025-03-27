import { Request, Response } from "express";
import Database from "better-sqlite3";
import { createUrlController } from "../src/controllers/url.controller";

let db: Database.Database;
let controllers: ReturnType<typeof createUrlController>;

// Runs before each test - sets up a fresh in-memory database
beforeEach(() => {
  db = new Database(":memory:");

  // Create table schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      originalUrl TEXT NOT NULL,
      visitCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Initialize the controller with the test DB
  controllers = createUrlController(db);
});

// Close the DB connection after all tests
afterAll(() => {
  db.close();
});

// Helper to mock Express Response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

//
// TESTS FOR: createShortUrl (POST /shorten)
//
describe("createShortUrl", () => {
  it("should return 400 for invalid URL", async () => {
    const req = { body: { originalUrl: "not_a_url" } } as Request;
    const res = mockResponse();

    await controllers.createShortUrl(req, res);

    // Should return 400 for invalid URL
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid URL" });
  });

  it("should create and return a shortened URL", async () => {
    const req = { body: { originalUrl: "https://example.com" } } as Request;
    const res = mockResponse();

    await controllers.createShortUrl(req, res);

    // Should return an object with shortUrl and slug
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        shortUrl: expect.stringContaining("http://localhost:5001/"),
        slug: expect.any(String),
      })
    );
  });
});

//
// TESTS FOR: redirectToOriginalUrl (GET /:slug)
//
describe("redirectToOriginalUrl", () => {
  it("should return 404 for nonexistent slug", async () => {
    const req = { params: { slug: "missing" } } as unknown as Request;
    const res = mockResponse();

    await controllers.redirectToOriginalUrl(req, res);

    // Should return 404 if slug not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("Not found");
  });

  it("should redirect to original URL if slug exists", async () => {
    const slug = "test123";
    const originalUrl = "https://google.com";

    // Manually insert a known URL into the DB
    db.prepare(`INSERT INTO urls (slug, originalUrl) VALUES (?, ?)`).run(
      slug,
      originalUrl
    );

    const req = { params: { slug } } as unknown as Request;
    const res = mockResponse();

    await controllers.redirectToOriginalUrl(req, res);

    // Should call redirect with original URL
    expect(res.redirect).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith(originalUrl);
  });
});

//
// TESTS FOR: getAllUrls (GET /urls)
//
describe("getAllUrls", () => {
  it("should return an array of URLs", async () => {
    const slug = "abc123";
    const originalUrl = "https://example.com";

    // Insert one test URL
    db.prepare(`INSERT INTO urls (slug, originalUrl) VALUES (?, ?)`).run(
      slug,
      originalUrl
    );

    const req = {} as Request;
    const res = mockResponse();

    await controllers.getAllUrls(req, res);

    // Should return a JSON array of URL objects
    expect(res.json).toHaveBeenCalled();

    const returnedData = (res.json as jest.Mock).mock.calls[0][0];

    expect(Array.isArray(returnedData)).toBe(true);
    expect(returnedData.length).toBeGreaterThan(0);
    expect(returnedData[0]).toHaveProperty("slug");
    expect(returnedData[0]).toHaveProperty("originalUrl");
  });
});
