import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

const publicUrl = process.env.BASE_URL || "http://localhost:3000";
// .api to enter /api prefix
export const api =
  // process is defined on server side and build time
  typeof process !== "undefined" ? treaty(app).api : treaty<typeof app>(publicUrl).api;
