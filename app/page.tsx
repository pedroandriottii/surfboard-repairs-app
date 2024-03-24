import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button";

import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/base/navbar";

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});

export default function Home() {
  return (
    <div className="flex items-center flex-col  align-center justify-between bg-slate-800 text-white">
      <Navbar />
    <div>
      <h1 className={cn("flex align-center text-center mt-2 p-5 text-lg pb-4", font.className)}>Entre agora e acompanhe o andamento do conserto de sua prancha!</h1>
    </div>
      <div>
        <LoginButton mode="modal" asChild>
        <Button 
  variant="secondary" 
  size="lg" 
  className="w-full text-lg sm:text-xl md:text-2xl px-6 py-3 md:px-10 md:py-4 transition-all duration-300 ease-in-out"
>
  Login
</Button>

        </LoginButton>
      </div>
    </div>
  );
}
