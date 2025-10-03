import { type SupabaseClient } from "@supabase/supabase-js";

export const login = async (sb: SupabaseClient, email: string, password: string) => {
    const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export const register = async (sb: SupabaseClient, email: string, password: string) => {
    const { data, error } = await sb.auth.signUp({
        email,
        password,
    });
    return { data, error };
}

export const logOut = async (sb: SupabaseClient) => {
    const { error } = await sb.auth.signOut();
    return { error };
}