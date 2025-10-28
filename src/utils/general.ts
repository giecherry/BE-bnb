export const handleError = (error: unknown, message: string, c: any) => {
    if (error instanceof Error) {
        console.error(`${message}:`, error.message);
        return c.json({ error: error.message }, 500);
    }
    console.error(`${message}:`, error);
    return c.json({ error: 'An unexpected error occurred' }, 500);
};

