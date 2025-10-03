interface NewUser {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

interface User extends NewUser {
    id: string;
}