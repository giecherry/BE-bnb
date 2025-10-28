import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export const getUsers = async (sb: SupabaseClient) => {
    const query = sb.from("users").select("*");
    const users: PostgrestSingleResponse<User[]> = await query;
    return users.data || [];
};

export const getUserById = async (sb: SupabaseClient, id: string) => {
    const query = sb.from("users").select("*").eq("id", id).single();
    const user: PostgrestSingleResponse<User> = await query;
    return user.data || null;
};

export const getUserByEmail = async (sb: SupabaseClient, email: string) => {
    const query = sb.from("users").select("*").eq("email", email).single();
    const user: PostgrestSingleResponse<User> = await query;
    return user.data || null;
};

export const createUser = async (sb: SupabaseClient, user: NewUser) => {
    const query = sb.from("users").insert(user).select().single();
    const response: PostgrestSingleResponse<User> = await query;
    return response;
};

export const updateUser = async (
    sb: SupabaseClient,
    id: string,
    user: NewUser
) => {
    const query = sb
        .from("users")
        .update(user)
        .eq("id", id)
        .select()
        .single();
    const response: PostgrestSingleResponse<User> = await query;
    return response;
};

export const deleteUser = async (sb: SupabaseClient, id: string) => {
    const query = sb
        .from("users")
        .delete()
        .eq("id", id)
        .select()
        .single();
    const response: PostgrestSingleResponse<User> = await query;
    return response;
};

