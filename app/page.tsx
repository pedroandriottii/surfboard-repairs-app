import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from 'next/image';
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="absolute inset-0 bg-black h-full w-full">
        <div className="md:hidden h-full w-full">
          <Image
            src={'/realce_home.png'}
            alt="Background"
            layout="fill"
            className="z-0 opacity-70"
            priority={true}
          />
        </div>
        <div className="hidden md:flex w-full h-full">
          <Image
            src={'/realce_home_desk.png'}
            alt="Background"
            width={380}
            height={380}
            className="z-0 w-1/2 h-full object-cover opacity-70"
            priority={true}
          />
          <div className="bg-black w-1/2 h-full"></div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col flex-grow justify-between">
        <div className="flex items-center justify-between w-screen p-4">
          <div>
            <Image
              src={'/realce_logo.png'}
              alt="Realce Nordeste"
              width={50}
              height={50}
            />
          </div>
          <div className="flex gap-4">
            <Link href={'/auth/register'}>
              <Button className="bg-realce text-black font-bold px-10 rounded-full max-h-6 max-w-36 hover:bg-white">
                <p>Cadastre-se</p>
              </Button>
            </Link>
            <LoginButton mode="modal" asChild>
              <Button className="bg-realce text-black font-bold px-10 rounded-full max-h-6 max-w-36 hover:bg-white">
                <p>Login</p>
              </Button>
            </LoginButton>
          </div>
        </div>
        <div className="flex flex-col p-6 justify-center w-full md:justify-center items-center">
          <div className="flex flex-col gap-8">
            <h1 className="text-realce text-5xl font-bold max-w-80 md:text-7xl md:max-w-[80vw]">Bem vindo à uma área exclusiva para clientes!</h1>
            <p className="text-white text-justify text-xl md:text-2xl md:max-w-[80vw]">
              Aqui, você pode acessar facilmente todas as informações sobre os serviços e reparos realizados em suas pranchas de surf, além de consultar a ficha técnica detalhada de cada uma delas.
            </p>
            <p className="text-white text-xl text-justify md:text-2xl md:max-w-[80vw]">
              Aproveite para conferir nosso catálogo de pranchas e fique por dentro das novidades e promoções exclusivas!
            </p>
            <div className="flex justify-between md:justify-start md:gap-6">
              <button className="rounded-full bg-realce font-bold self-start justify-around py-2 px-4 md:text-center">
                <a href="https://www.realcenordeste.com.br/" target="__blank">Pranchas Novas</a>
              </button>
              <button className="rounded-full bg-realce font-bold self-start justify-around py-2 px-4 md:text-center">
                <Link href="/catalogo">Pranchas Usadas</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="relative z-10 flex flex-col bg-transparent items-center gap-4 p-4">
          <p className="text-realce font-bold">Visite nossa loja!</p>
          <a href="https://maps.app.goo.gl/ZCcjUhyGsoxS9TUA6" target='__blank' className="underline text-white text-center">Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</a>
          <div className="flex items-center gap-4">
            <a href="https://api.whatsapp.com/send?phone=5581988145906" target='__blank'>
              <Image
                src={'/whats_footer.svg'}
                alt="Whatsapp Realce Nordeste"
                width={30}
                height={30}
              />
            </a>
            <a href="https://www.instagram.com/realce.nordeste/" target='__blank'>
              <Image
                src={'/insta_footer.svg'}
                alt="Instagram Realce Nordeste"
                width={30}
                height={30}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}