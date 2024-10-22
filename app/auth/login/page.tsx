'use client'
import Link from 'next/link'
import Image from "next/image"
import { LoginForm } from '@/components/auth/login-form'


export default function LoginPage() {
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
            Login
          </h2>
        </div>
        <LoginForm />
        <p className="mt-2 text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <Link href="/auth/register" className="text-realce hover:text-realce/80">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
