import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from 'next/image';

export default function Home() {

  return (
    <div>
      <div className="overflow-y-hidden flex flex-col justify-between" style={{ minHeight: '100vh', display: 'flex', backgroundImage: 'url("/realce_home.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex items-center justify-between w-full h-full p-4">
          <div>
            <Image
              src={'/realce_logo.png'}
              alt="Realce Nordeste"
              width={50}
              height={50}
            />
          </div>
          <div className="flex gap-4">
            <Button className="bg-realce text-black font-bold px-10 rounded-full max-h-6 max-w-36 hover:bg-white">
              <p>Cadastre-se</p>
            </Button>
            <LoginButton mode="modal" asChild>
              <Button className="bg-realce text-black font-bold px-10 rounded-full max-h-6 max-w-36 hover:bg-white">
                <p>Login</p>
              </Button>
            </LoginButton>
          </div>
        </div>
        <div className="flex flex-col p-6 gap-8 justify-end w-full">
          <h1 className="text-realce text-5xl font-bold max-w-80">Bem vindo à uma área exclusiva para clientes!</h1>
          <p className="text-white text-xl">
            Aqui, você pode acessar facilmente todas as informações sobre os serviços e reparos realizados em suas pranchas de surf, além de consultar a ficha técnica detalhada de cada uma delas.
          </p>
          <button className="rounded-full bg-realce px-4 font-bold justify-center w-2/3 self-center"><a href="https://www.realcenordeste.com.br/">Confira nosso catálogo!</a></button>

        </div>
        <div className="flex flex-col bg-black self-end w-full h-full items-center gap-4 p-4">
          <p className="text-realce font-bold">Visite nossa loja!</p>
          <p className="underline text-white text-center">Av. Pres. Castelo Branco, 8159, Jaboatão dos Guararapes</p>
          <div className="flex items-center gap-4">
            <a href="">
              <Image
                src={'/whats_footer.svg'}
                alt="Whatsapp Realce Nordeste"
                width={30}
                height={30}
              />
            </a>
            <a href="">
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
