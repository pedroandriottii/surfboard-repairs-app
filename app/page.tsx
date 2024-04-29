import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/base/navbar";
import { Montserrat } from "next/font/google";
const font = Montserrat({
  subsets: ['latin'],
  weight: ["600"]
});

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="relative flex items-center justify-center h-screen" style={{ backgroundImage: 'url("/image.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-center p-5 bg-slate-200 m-10 rounded-2xl">
          <h1 className={cn("text-md sm:text-xl md:text-2xl pb-4 bg-opacity-50 rounded px-3", font.className)}>
            Entre agora e acompanhe o andamento do conserto de sua prancha!
          </h1>
          <LoginButton mode="modal" asChild>
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg sm:text-xl md:text-2xl px-6 py-3 md:px-10 md:py-4 transition-all duration-300 ease-in-out"
            >
              Login
            </Button>
          </LoginButton>
        </div>
      </div>
    </div>
  );
}
