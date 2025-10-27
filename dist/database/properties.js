export const getProperties = async (sb) => {
    const query = sb.from("properties").select("*");
    const properties = await query;
    return properties.data || [];
};
export const getPropertyById = async (sb, id) => {
    const query = sb.from("properties").select("*").eq("id", id).single();
    const property = await query;
    return property.data || null;
};
export const createProperty = async (sb, property) => {
    const query = sb.from("properties").insert(property).select().single();
    const response = await query;
    return response;
};
export const updateProperty = async (sb, id, property) => {
    const query = sb
        .from("properties")
        .update(property)
        .eq("id", id)
        .select()
        .single();
    const response = await query;
    return response;
};
export const deleteProperty = async (sb, id) => {
    const query = sb
        .from("properties")
        .delete()
        .eq("id", id)
        .select()
        .single();
    const response = await query;
    return response;
};
