import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Custom404() {
    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-realce-bg text-white p-4">
        <div className="text-center">
        <Image
            src="/realce_logo.png"
            alt="Logo Realce"
            width={150}
            height={150}
            className="mx-auto mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
        <p className="text-xl mb-8">Desculpe, não foi possível encontrar a página que você está procurando.</p>
        <Link href="/" passHref>
            <Button className="bg-realce text-black font-bold hover:bg-realce/50 transition-colors">
            Voltar para a página principal
            </Button>
        </Link>
        </div>
    </div>
    )
}