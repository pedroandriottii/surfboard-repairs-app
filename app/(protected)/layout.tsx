import { Inter } from "next/font/google";
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from "@/lib/utils";
import { ProtectedLayoutProps } from "@/lib/types";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { UserProvider } from "@/context/UserContext";

const font = Inter({
    subsets: ['latin'],
    weight: ["600"]
});

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    const phoneNumber = '5581988145906';
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

    return (
        <UserProvider>
            <div className={cn("bg-realce-background w-full h-full", font.className)}>
                {children}
                <Toaster />
                <SpeedInsights />
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-lg"
                >
                    <FaWhatsapp size={30} />
                </a>
            </div>
        </UserProvider>
    );
};

export default ProtectedLayout;