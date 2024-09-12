'use client';
import React from 'react';
import EditService from '@/components/services/edit-service';

const Home = () => {
    return (
        <div className="relative w-full flex flex-col min-h-screen">
            <EditService />
        </div>
    );
};

export default Home;
