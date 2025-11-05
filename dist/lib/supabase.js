import dotenv from "dotenv";
dotenv.config();
const _supabaseUrl = process.env.SUPABASE_URL;
const _supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const _supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!_supabaseUrl || !_supabaseAnonKey || !_supabaseServiceRoleKey) {
    throw new Error("Supabase not initalized add 'SUPABASE_URL', 'SUPABASE_ANON_KEY', and 'SUPABASE_SERVICE_ROLE_KEY' to enviroment variables");
}
const supabaseUrl = _supabaseUrl;
const supabaseAnonKey = _supabaseAnonKey;
const supabaseServiceRoleKey = _supabaseServiceRoleKey;
export { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey };
