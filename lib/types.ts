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
export interface ProtectedLayoutProps {
    children: React.ReactNode;
}

export interface MonthlyData {
    month: string;
    totalRevenue: number;
    count: number;
    openCount: number;
    revenuePending: number;
    revenueByPaymentMethod: {
        PIX: number;
        FREE: number;
        CREDIT_CARD: number;
        DEBIT_CARD: number;
        CASH: number;
    };
}

export interface Surfboard {
    id: string;
    title: string;
    description: string;
    price: number;
    size: string;
    volume: number;
    coverImage: string;
    image: string[];
    model: string
    sold: Date;
}