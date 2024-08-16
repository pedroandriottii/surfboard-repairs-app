import React from 'react';

interface FormMessageProps {
  message?: string;
}

export const FormMessage: React.FC<FormMessageProps> = ({ message }) => {
  if (!message) return null;

  return <p className="text-red-500">{message}</p>;
};
