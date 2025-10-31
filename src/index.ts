import { Hono } from 'hono'
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { HTTPException } from "hono/http-exception";
import { optionalAuth } from "./middleware/auth.js"
import { authApp } from "./routes/auth.js"
dotenv.config();

const app = new Hono();

app.get('/', (c) => c.text('Hello Hembnb Backend!'))
app.use("*", optionalAuth)
app.route("/auth", authApp)

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        console.log("managed risk error")
        return err.getResponse()
    }
    console.log("unexpected error", err)
    return c.json({ error: "Internal server error" }, 500);
})

serve(
    {
        fetch: app.fetch,
        port: Number(process.env.HONO_PORT) || 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);