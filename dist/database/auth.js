import {} from "@supabase/supabase-js";
export const login = async (sb, email, password) => {
    const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};
export const register = async (sb, email, password) => {
    const { data, error } = await sb.auth.signUp({
        email,
        password,
    });
    return { data, error };
};
export const logOut = async (sb) => {
    const { error } = await sb.auth.signOut();
    return { error };
};
