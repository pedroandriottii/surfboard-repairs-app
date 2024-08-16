import { BrandForm } from '@/components/surfboards/brand-form';
import { SurfboardForm } from '@/components/surfboards/surfboard-form';
import React from 'react';

const Page: React.FC = () => {

  return (
    <div className='bg-gray-500'>
      <h1>MARCA</h1>
      <BrandForm />
      <h1>Surfboard</h1>
      <SurfboardForm />
    </div>
  );
};

export default Page;