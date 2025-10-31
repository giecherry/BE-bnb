import { Hono } from 'hono';
import { requireRole } from '../middleware/auth.js';
import * as propertyDb from '../database/properties.js';
import { handleError } from '../utils/general.js';
import { SupabaseClient } from '@supabase/supabase-js';

const propertiesApp = new Hono();

propertiesApp.get('/', async (c) => {
    const sb: SupabaseClient = c.get('supabase');
    const { q, sort_by, offset, limit } = c.req.query();

    try {
        const properties = await propertyDb.getProperties(sb, {
            q,
            sort_by,
            offset: Number(offset),
            limit: Number(limit),
        });
        return c.json(properties);
    } catch (error) {
        return handleError(error, 'Failed to fetch properties', c);
    }
});

propertiesApp.get('/:id', async (c) => {
    const sb: SupabaseClient = c.get('supabase');
    const id: string = c.req.param('id');

    try {
        const property = await propertyDb.getPropertyById(sb, id);
        if (!property) {
            return c.json({ error: 'Property not found' }, 404);
        }
        return c.json(property);
    } catch (error) {
        return handleError(error, 'Failed to fetch property', c);
    }
});

propertiesApp.post('/', requireRole(['host','admin']), async (c) => {
    const sb: SupabaseClient = c.get('supabase');
    const body: NewProperty = await c.req.json();

    try {
        const newProperty = await propertyDb.createProperty(sb, body);
        return c.json(newProperty, 201);
    } catch (error) {
        return handleError(error, 'Failed to create property', c);
    }
});

propertiesApp.patch('/:id', requireRole(['host','admin']), async (c) => {
    const sb: SupabaseClient = c.get('supabase');
    const id: string = c.req.param('id');
    const body: Partial<NewProperty> = await c.req.json();
    delete body.id; 

    try {
        const updatedProperty = await propertyDb.updateProperty(sb, id, body as NewProperty);
        if (!updatedProperty) {
            return c.json({ error: 'Property not found' }, 404);
        }
        return c.json(updatedProperty);
    } catch (error) {
        return handleError(error, 'Failed to update property', c);
    }
});

propertiesApp.delete('/:id', requireRole(['host','admin']), async (c) => {
    const sb: SupabaseClient = c.get('supabase');
    const id: string = c.req.param('id');

    try {
        const deleted = await propertyDb.deleteProperty(sb, id);
        if (!deleted) {
            return c.json({ error: 'Property not found' }, 404);
        }
        return c.json({ message: 'Property deleted successfully' });
    } catch (error) {
        return handleError(error, 'Failed to delete property', c);
    }
});

export default propertiesApp;