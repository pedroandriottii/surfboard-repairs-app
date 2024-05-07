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