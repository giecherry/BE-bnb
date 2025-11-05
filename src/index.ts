import { Hono } from 'hono';
import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { HTTPException } from "hono/http-exception";
import { optionalAuth } from "./middleware/auth.js";
import { authApp } from "./routes/auth.js";
import bookingsApp from "./routes/bookings.js";
import propertiesApp from "./routes/properties.js";
import { cors } from 'hono/cors';

dotenv.config();

const app = new Hono();

if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL environment variable is not set.");
}
app.use(
    "*",
    cors({
        origin: (origin) => {
            const allowedOrigins = [
                process.env.FRONTEND_URL,
                "http://localhost:3000",
            ];
            if (allowedOrigins.includes(origin)) {
                return origin;
            }
            return null;
        },
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.get('/', (c) => {
    const documentation = `
        Welcome to the Hembnb Backend API! Here are the available routes:

        **Authentication Routes**:
        - POST /auth/login: Log in a user.
        - POST /auth/register: Register a new user.
        - POST /auth/refresh: Refresh the user's session.
        - POST /auth/logout: Log out the user.
        - GET /auth/me: Get the authenticated user's profile.

        **Properties Routes**:
        - GET /properties: Fetch all properties (public access).
        - GET /properties/:id: Fetch a specific property by ID (public access).
        - POST /properties: Create a new property (host/admin only).
        - PATCH /properties/:id: Update a property (host/admin only).
        - DELETE /properties/:id: Delete a property (host/admin only).

        **Bookings Routes**:
        - GET /bookings: Fetch all bookings (admin only).
        - GET /bookings/users/:userId: Fetch bookings for a specific user (authenticated owner user only).
        - GET /bookings/:id: Fetch a specific booking by ID (owner/admin only).
        - POST /bookings: Create a new booking (authenticated users only).
        - PATCH /bookings/:id: Update a booking (owner/admin only).
        - DELETE /bookings/:id: Delete a booking (owner/admin only).

        **Error Handling**:
        - All routes return appropriate error messages for unauthorized or invalid requests.
    `;
    return c.text(documentation, 200);
});
app.use("*", optionalAuth);
app.route("/auth", authApp);
app.route("/bookings", bookingsApp);
app.route("/properties", propertiesApp);

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        console.log("managed risk error");
        return err.getResponse();
    }
    console.log("unexpected error", err);
    return c.json({ error: "Internal server error" }, 500);
});

serve(
    {
        fetch: app.fetch,
        port: Number(process.env.HONO_PORT) || 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);