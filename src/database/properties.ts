import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export const getProperties = async (
    sb: SupabaseClient,
    options?: { q?: string; sort_by?: string; offset?: number; limit?: number }
) => {
    let query = sb.from('properties').select('*');

    if (options?.q) {
        query = query.ilike('name', `%${options.q}%`); 
    }
    if (options?.sort_by) {
        query = query.order(options.sort_by, { ascending: true });
    }
    if (options?.offset !== undefined && options?.limit !== undefined) {
        query = query.range(options.offset, options.offset + options.limit - 1);
    }
    if (options?.limit) {
        query = query.limit(options.limit);
    }

    const properties: PostgrestSingleResponse<Property[]> = await query;
    return properties.data || [];
};


export const getPropertyById = async (sb: SupabaseClient, id: string) => {
    const query = sb.from("properties").select("*").eq("id", id).single();
    const property: PostgrestSingleResponse<Property> = await query;
    return property.data || null;
};

export const createProperty = async (sb: SupabaseClient, property: NewProperty) => {
    const query = sb.from("properties").insert(property).select().single();
    const response: PostgrestSingleResponse<Property> = await query;
    return response;
};


export const updateProperty = async (
    sb: SupabaseClient,
    id: string,
    property: NewProperty) => {
    const query = sb
        .from("properties")
        .update(property)
        .eq("id", id)
        .select()
        .single();
    const response: PostgrestSingleResponse<Property> = await query;
    return response;
};

export const deleteProperty = async (sb: SupabaseClient, id: string) => {
    const query = sb
        .from("properties")
        .delete()
        .eq("id", id)
        .select()
        .single();
    const response: PostgrestSingleResponse<Property> = await query;
    return response;
};