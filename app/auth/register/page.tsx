'use client'
import Link from 'next/link'
import Image from "next/image"
import { RegisterForm } from '@/components/auth/register-form'
import { useState } from 'react'
import { VerifyCodeForm } from '@/components/auth/verification-form';


export default function RegisterPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-realce-bg text-white relative overflow-hidden">
      <div className="md:hidden absolute inset-0">
      </div>
      <div className="w-full max-w-md space-y-8 px-4 relative z-10">
        <div className="flex flex-col items-center">
          <Image
            src={'/realce_logo.png'}
            alt="Realce Nordeste"
            width={100}
            height={100}
          />
          <h2 className="mt-6 text-center text-3xl font-bold">
            {isRegistered ? 'Verifique seu e-mail' : 'Crie sua conta'}
          </h2>
        </div>

        {!isRegistered ? (
          <>
            <RegisterForm/>
            <p className="mt-2 text-center text-sm text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/" className="text-realce hover:text-realce/80">
                Faça login
              </Link>
            </p>
          </>
        ) : (
          <VerifyCodeForm email={userEmail} />
        )}
      </div>
    </div>
  )
}
