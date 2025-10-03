import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseApiKey = process.env.SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseApiKey) {
  throw new Error("Missing Supabase credentials")
}

export const supabase = createClient(supabaseUrl, supabaseApiKey)
export { supabaseUrl, supabaseApiKey }