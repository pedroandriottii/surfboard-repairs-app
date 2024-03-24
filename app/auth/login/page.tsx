import { LoginForm } from "@/components/auth/login-form";
import { Navbar } from "@/components/base/navbar";

const LoginPage = () => {
    return (
        <div className="flex flex-col gap-5">
            <Navbar />
            <LoginForm />
        </div>

    )
}

export default LoginPage;