import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { registerValidator } from "../validators/auth.js";
import { requireAuth } from "../middleware/auth.js";
import * as userDb from "../database/users.js";
export const authApp = new Hono();
authApp.post("/login", async (c) => {
    const { email, password } = await c.req.json();
    const sb = c.get("supabase");
    const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw new HTTPException(400, {
            res: c.json({ error: "Invalid credentials" }, 400),
        });
    }
    return c.json(data.user, 200);
});
authApp.post("/register", registerValidator, async (c) => {
    const { email, password } = await c.req.json();
    const sb = c.get("supabase");
    const response = await sb.auth.signUp({ email, password });
    if (response.error) {
        throw new HTTPException(400, {
            res: c.json({ error: response.error.message }, 400),
        });
    }
    return c.json(response.data.user, 200);
});
authApp.post("/refresh", async (c) => {
    const sb = c.get("supabase");
    const { data, error } = await sb.auth.refreshSession();
    if (error) {
        throw new HTTPException(401, {
            res: c.json({ error: "Unable to refresh session" }, 401),
        });
    }
    return c.json({
        user: data.user,
        session: data.session,
    }, 200);
});
authApp.post("/logout", async (c) => {
    const sb = c.get("supabase");
    const { error } = await sb.auth.signOut();
    if (error) {
        throw new HTTPException(400, {
            res: c.json({ error: "Unable to sign out" }, 400),
        });
    }
    return c.json({ message: "Successfully logged out" }, 200);
});
authApp.get("/me", requireAuth, async (c) => {
    const sb = c.get("supabase");
    const user = c.get("user");
    const profile = await userDb.getProfile(sb, user.id);
    return c.json(profile, 200);
});
authApp.patch("/me", requireAuth, async (c) => {
    const sb = c.get("supabase");
    const user = c.get("user");
    const body = await c.req.json();
    const profile = await userDb.updateProfile(sb, user?.id, body);
    return c.json(profile, 200);
});
