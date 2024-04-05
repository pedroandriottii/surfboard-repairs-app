"use client";
import React from 'react';
import { RoleGate } from '@/components/auth/role-gate';

const DashboardPage = () => {
    return (
        <RoleGate allowedRole="ADMIN">
            <p>A FAZER DASHBOARD PAGE ADMIN</p>
        </RoleGate>
    )
}

export default DashboardPage;