export const handleError = (error, message, c) => {
    if (error instanceof Error) {
        console.error(`${message}:`, error.message);
        return c.json({ error: error.message }, 500);
    }
    console.error(`${message}:`, error);
    return c.json({ error: 'An unexpected error occurred' }, 500);
};
