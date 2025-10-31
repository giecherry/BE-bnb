interface NewUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

interface User extends NewUser {
    id: string;
}