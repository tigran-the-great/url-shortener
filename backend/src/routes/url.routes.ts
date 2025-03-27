import { Router } from "express";
import db from "../db";
import { createUrlController } from "../controllers/url.controller";

const { createShortUrl, getAllUrls, redirectToOriginalUrl } =
  createUrlController(db);

export const urlRouter = Router();

urlRouter.post("/shorten", createShortUrl);
urlRouter.get("/urls", getAllUrls);
urlRouter.get("/:slug", redirectToOriginalUrl);
