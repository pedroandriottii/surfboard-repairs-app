import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

const LoginPage = () => {
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
                <LoginForm />
            </div>
        </div>

    )
}

export default LoginPage;