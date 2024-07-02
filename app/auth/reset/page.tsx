import { ResetForm } from "@/components/auth/reset-form";
import Image from "next/image";

const ResetPage = () => {
    return (
        <div className="h-screen justify-center p-6">
            <div className="md:hidden bg-black">
                <Image
                    src={'/splash.png'}
                    alt="Background"
                    layout="fill"
                    className="z-0 opacity-90"
                />
            </div>
            <div className="relative z-10 align-center">
                <ResetForm />
            </div>
        </div>
    )
}

export default ResetPage;