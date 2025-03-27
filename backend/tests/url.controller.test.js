"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const url_controller_1 = require("../src/controllers/url.controller");
let db;
let controllers;
beforeEach(() => {
    db = new better_sqlite3_1.default(":memory:");
    db.exec(`
    CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      originalUrl TEXT NOT NULL,
      visitCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    controllers = (0, url_controller_1.createUrlController)(db);
});
afterAll(() => {
    db.close();
});
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
describe("createShortUrl", () => {
    it("should return 400 for invalid URL", async () => {
        const req = { body: { originalUrl: "not_a_url" } };
        const res = mockResponse();
        await controllers.createShortUrl(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid URL" });
    });
    it("should create and return a shortened URL", async () => {
        const req = { body: { originalUrl: "https://example.com" } };
        const res = mockResponse();
        await controllers.createShortUrl(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            shortUrl: expect.stringContaining("http://localhost:5001/"),
            slug: expect.any(String),
        }));
    });
});
describe("redirectToOriginalUrl", () => {
    it("should return 404 for nonexistent slug", async () => {
        const req = { params: { slug: "missing" } };
        const res = mockResponse();
        await controllers.redirectToOriginalUrl(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Not found");
    });
    it("should redirect to original URL if slug exists", async () => {
        const slug = "test123";
        const originalUrl = "https://google.com";
        // Insert test data into the actual DB used by the controller
        db.prepare(`INSERT INTO urls (slug, originalUrl) VALUES (?, ?)`).run(slug, originalUrl);
        const req = { params: { slug } };
        const res = mockResponse();
        await controllers.redirectToOriginalUrl(req, res);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(originalUrl);
    });
});
describe("getAllUrls", () => {
    it("should return an array of URLs", async () => {
        const slug = "abc123";
        const originalUrl = "https://example.com";
        db.prepare(`INSERT INTO urls (slug, originalUrl) VALUES (?, ?)`).run(slug, originalUrl);
        const req = {};
        const res = mockResponse();
        await controllers.getAllUrls(req, res);
        expect(res.json).toHaveBeenCalled();
        const returnedData = res.json.mock.calls[0][0];
        expect(Array.isArray(returnedData)).toBe(true);
        expect(returnedData.length).toBeGreaterThan(0);
        expect(returnedData[0]).toHaveProperty("slug");
        expect(returnedData[0]).toHaveProperty("originalUrl");
    });
});
