import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";
import { BASE_URL } from "./constants";

export const api = treaty<typeof app>(BASE_URL).api;
