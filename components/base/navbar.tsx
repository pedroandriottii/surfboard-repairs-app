import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Montserrat({
    subsets: ['latin'],
    weight: ["600"]
});


export const Navbar = () => {
    return (
        <div className="bg-slate-800 gap-5 flex flex-row w-full items-center p-5 justify-center shadow-md text-white">
        <Image 
          src="/realce-logo.png"
          alt="Realce Nordeste"
          width={50}
          height={50}
        />
        <div className="flex flex-col items-center align-center uppercase text-sm pl-4 border-l-2">
          <h1 className={cn("text-2xl uppercase", font.className)}>Realce Nordeste</h1>
          <p>Consertos</p>
        </div>
      </div>
    )
}