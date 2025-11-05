import type { Context, Next } from "hono";
import { setCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { HTTPException } from "hono/http-exception";

import { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey } from "../lib/supabase.js";

declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    user: User | null;
  }
}

function createSupabaseForRequest(c: Context) {
  return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        );
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        });
      },
    },
  });
}

async function withSupabase(c: Context, next: Next) {
  if (!c.get("supabase")) {
    const sb = createSupabaseForRequest(c);
    c.set("supabase", sb);

    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      c.set("user", null);
      return next();
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await sb.auth.getUser(token);
    if (error) {
      console.error("Failed to decode token:", error);

      if (error.code === "session_expired") {
        c.header("X-Auth-Error", "Token expired");

        const { data: refreshData, error: refreshError } = await sb.auth.refreshSession();

        if (!refreshError && refreshData.user) {
          c.set("user", refreshData.user);
        } else {
          c.set("user", null);
          return c.json({ error: "Token expired" }, 401);
        }
      } else {
        c.header("X-Auth-Error", "Invalid token");
        c.set("user", null);
        return c.json({ error: "Invalid token" }, 401); 
      }
    } else {
      c.set("user", data.user);
    }
  }
  return next();
}


export async function requireAuth(c: Context, next: Next) {
  await withSupabase(c, async () => { });
  const user = c.get("user");
  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return next();
}


export const requireRole = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    await withSupabase(c, async () => { });
    const user = c.get("user");

    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const sb = c.get("supabase")!;
    const { data: userData, error } = await sb
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !userData) {
      console.error("Error fetching user role:", error);
      throw new HTTPException(500, { message: "Failed to fetch user role" });
    }

    user.role = userData.role;

    if (!user.role) {
      throw new HTTPException(403, { message: "Unauthorized access: Role not found" });
    }

    if (!allowedRoles.includes(user.role)) {
      throw new HTTPException(403, { message: "Unauthorized access" });
    }

    return next();
  };
};