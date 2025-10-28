import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { registerValidator } from "../validators/auth.js";
import { requireAuth } from "../middleware/auth.js";
import * as userDb from "../database/users.js";
import bcrypt from "bcryptjs";
import { error } from "console";

export const authApp = new Hono();

authApp.post("/login", async (c) => {
    try {
        const { email, password } = await c.req.json();
        const sb = c.get("supabase");

        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (error) {
            return c.json({ error: "Invalid credentials" }, 400);
        }

        const authUser = data.user;

        const user = await userDb.getUserById(sb, authUser.id);
        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        const response = {
            id: authUser.id,
            email: authUser.email,
            name: user.name,
            is_admin: user.is_admin,
        };

        return new Response(JSON.stringify(response, null, 2), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return c.json({ error: "Internal server error" }, 500);
    }
});

authApp.post("/register", registerValidator, async (c) => {
    const { email, password, name, is_admin } = await c.req.json();
    const sb = c.get("supabase");

    const { data: existingAuthUser, error: authCheckError } = await sb.auth.admin.listUsers();
    const isAlreadyRegistered = existingAuthUser?.users.some((u) => u.email === email);

    if (isAlreadyRegistered) {
        return c.json({ error: "User already registered" }, 400);
    }

    const response = await sb.auth.signUp({ email, password });
    if (response.error || !response.data.user) {
        return c.json({ error: response.error?.message || "Failed to create user" }, 400);
    }

    const user = response.data.user;
    const token = response.data.session?.access_token;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: user.id,
        email: user.email!,
        name: name || "Default Name",
        password: hashedPassword,
        is_admin: is_admin || false,
    };

    const { error: insertError } = await userDb.createUser(sb, newUser);
    if (insertError) {
        console.error("Error inserting user into users table:", insertError.message);
        return c.json({ error: "Database error saving new user" }, 500);
    }

    return c.json({ id: user.id, email: user.email, name: newUser.name, is_admin: newUser.is_admin, token }, 200);
});

authApp.post("/refresh", async (c) => {
    const sb = c.get("supabase");
    const { data, error } = await sb.auth.refreshSession();

    if (error) {
        throw new HTTPException(401, {
            res: c.json({ error: "Unable to refresh session" }, 401),
        });
    }

    return c.json(
        {
            user: data.user,
            session: data.session,
        },
        200
    );
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
    const user = c.get("user")!;
    const profile = await userDb.getProfile(sb, user.id);
    return c.json(profile, 200);
});

authApp.patch("/me", requireAuth, async (c) => {
    const sb = c.get("supabase");
    const user = c.get("user")!;
    const body: Partial<any> = await c.req.json();
    const profile = await userDb.updateProfile(sb, user?.id, body);
    return c.json(profile, 200);
});