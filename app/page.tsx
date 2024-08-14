import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from 'next/image';
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen h-full overflow-y-hidden overflow-x-hidden">
      <div className="absolute inset-0">
        <div className="md:hidden bg-black">
          <Image
            src={'/realce_home.png'}
            alt="Background"
            layout="fill"
            className="z-0 opacity-90"
          />
        </div>
        <div className="hidden md:flex md:w-full max-h-screen bg-black">
          <Image
            src={'/realce_home_desk.png'}
            alt="Background"
            width={380}
            height={380}
            className="z-0 w-1/2 opacity-70"
          />
          <div className="bg-black w-1/2 h-screen"></div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col justify-between flex-grow">
        <div className="flex items-center justify-between w-full p-4">
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
        <div className="flex flex-col p-6 gap-8 justify-end w-full md:mx-20 md:justify-center pl-[10vw]">
          <h1 className="text-realce text-5xl font-bold max-w-80 md:text-7xl md:max-w-[80vw]">Bem vindo à uma área exclusiva para clientes!</h1>
          <p className="text-white text-xl md:text-2xl md:max-w-[80vw]">
            Aqui, você pode acessar facilmente todas as informações sobre os serviços e reparos realizados em suas pranchas de surf, além de consultar a ficha técnica detalhada de cada uma delas.
          </p>
          <button className="rounded-full bg-realce px-4 font-bold justify-center w-2/3 md:p-2 md:w-1/4 md:text-center"><a href="https://www.realcenordeste.com.br/">Confira nosso catálogo!</a></button>

        </div>
        <div className="flex flex-col bg-black self-end w-full h-full items-center gap-4 p-4 lg:bg-transparent">
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
