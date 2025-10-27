export const getUsers = async (sb) => {
    const query = sb.from("users").select("*");
    const users = await query;
    return users.data || [];
};
export const getUserById = async (sb, id) => {
    const query = sb.from("users").select("*").eq("id", id).single();
    const user = await query;
    return user.data || null;
};
export const getUserByEmail = async (sb, email) => {
    const query = sb.from("users").select("*").eq("email", email).single();
    const user = await query;
    return user.data || null;
};
export const createUser = async (sb, user) => {
    const query = sb.from("users").insert(user).select().single();
    const response = await query;
    return response;
};
export const updateUser = async (sb, id, user) => {
    const query = sb
        .from("users")
        .update(user)
        .eq("id", id)
        .select()
        .single();
    const response = await query;
    return response;
};
export const deleteUser = async (sb, id) => {
    const query = sb
        .from("users")
        .delete()
        .eq("id", id)
        .select()
        .single();
    const response = await query;
    return response;
};
export async function getProfile(sb, uid) {
    const { data, error } = await sb
        .from("profiles")
        .select("*")
        .eq("user_id", uid)
        .single();
    return data;
}
export async function updateProfile(sb, uid, user) {
    const { data, error } = await sb
        .from("profiles")
        .update(user)
        .eq("user_id", uid)
        .select()
        .single();
    return data;
}
