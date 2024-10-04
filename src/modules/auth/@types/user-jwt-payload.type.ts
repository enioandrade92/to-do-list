export type UserJwtPayload = {
    id: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
};
