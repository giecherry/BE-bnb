interface NewUser {
    id: string;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
}

interface User extends NewUser {
    id: string;
}