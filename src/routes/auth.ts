import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"

export const authApp = new Hono()

authApp.post("/login", async (c) => {
    const { email, password } = await c.req.json()
    const supabase = c.get("supabase")
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        throw new HTTPException(400, { res: c.json({ error: "Invalid credentials" }, 400) })
    }

    return c.json(data.user, 200)
})

authApp.post("/register", async (c) => {
    const { email, password } = await c.req.json()
    const supabase = c.get("supabase")
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
        throw new HTTPException(400, { res: c.json({ error: error.message }, 400) })
    }

    return c.json(data.user, 200)
})