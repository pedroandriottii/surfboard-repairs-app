export type UserRole = 'MASTER' | 'USER' | 'ADMIN';

export interface Service {
    id: string;
    value: number;
    max_time: Date;
    now_time: Date;
    status: 'PENDING' | 'READY' | 'DELIVERED';
}

export interface MonthlySummary {
    month: number;
    totalValue: number;
    count: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}