
import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

const RegisterPage = () => {
    return (
        <div className="h-screen justify-center p-6">
            <div className="md:hidden bg-black">
                <Image
                    src={'/splash.webp'}
                    alt="Background"
                    layout="fill"
                    className="z-0 opacity-90"
                />
            </div>
            <div className="relative z-10 align-center">
                <RegisterForm />
            </div>
        </div>

    )
}

export default RegisterPage;