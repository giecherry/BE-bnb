import { Hono } from 'hono';
import { requireRole } from '../middleware/auth.js';
import * as propertyDb from '../database/properties.js';
import { handleError } from '../utils/general.js';
import { propertyValidator } from '../validators/property.js';

const propertiesApp = new Hono();

propertiesApp.get('/', async (c) => {
    const sb = c.get('supabase');
    const { q, sort_by, offset, limit } = c.req.query();

    try {
        const properties = await propertyDb.getProperties(sb, {
            q,
            sort_by,
            offset: offset ? Number(offset) : 0,
            limit: limit ? Number(limit) : 10,
        });
        return c.json(properties);
    } catch (error) {
        return handleError(error, 'Failed to fetch properties', c);
    }
});

propertiesApp.get('/:id', async (c) => {
    const sb = c.get('supabase');
    const id = c.req.param('id');

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

propertiesApp.post('/', propertyValidator, requireRole(['host', 'admin']), async (c) => {
    const sb = c.get('supabase');
    const user = c.get('user'); 

    if (!user) {
        console.error('User is null in POST /properties');
        return c.json({ error: 'Unauthorized: User not found' }, 401);
    }

    const body: NewProperty = await c.req.json(); 

    try {
        const propertyData = {
            ...body,
            user_id: user.id,
        };

        console.log('Property Data:', propertyData);

        const newProperty = await propertyDb.createProperty(sb, propertyData);

        if (newProperty.error) {
            console.error('Error inserting property:', newProperty.error);
            return c.json({ error: newProperty.error }, 400);
        }

        return c.json(newProperty.data, 201);
    } catch (error) {
        console.error('Error in POST /properties:', error);
        return handleError(error, 'Failed to create property', c);
    }
});

propertiesApp.patch('/:id', requireRole(['host', 'admin']), async (c) => {
    const sb = c.get('supabase');
    const id = c.req.param('id');
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

propertiesApp.delete('/:id', requireRole(['host', 'admin']), async (c) => {
    const sb = c.get('supabase');
    const id = c.req.param('id');

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