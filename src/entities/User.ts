export interface User {
    usersId: string;
    userName: string;
    fulllName: string;
    email: string;
    phone: string;
    password: string;
    imageUrl: string;
    RoleId: Role;
    createdAt: string;
    updatedAt: string;
    status: boolean;
    token: string;
}

export type Role = "Admin" | "User" | "Staff";