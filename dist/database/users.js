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
