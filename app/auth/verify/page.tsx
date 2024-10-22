'use client'
import Image from "next/image"
import { VerifyCodeForm } from '@/components/auth/verification-form'
import { useSearchParams } from 'next/navigation'


export default function RegisterPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
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
          <div className="flex flex-col gap-4">
          <h2 className="mt-6 text-center text-3xl font-bold">
            Verifique seu e-mail.
          </h2>
          <p className="text-center">Enviamos para o email <strong className="text-realce">{email}</strong> um código de verificação</p>
          </div>
        </div>
        <VerifyCodeForm email={email} />
      </div>
    </div>
  )
}
