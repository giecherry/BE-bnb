import dotenv from "dotenv";
dotenv.config();
const _supabaseUrl = process.env.SUPABASE_URL;
const _supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!_supabaseUrl || !_supabaseAnonKey) {
    throw new Error("Supabase not initalized add 'SUPABASE_URL' and 'SUPABASE_ANON_KEY' to enviroment variables");
}
const supabaseUrl = _supabaseUrl;
const supabaseAnonKey = _supabaseAnonKey;
export { supabaseUrl, supabaseAnonKey };
