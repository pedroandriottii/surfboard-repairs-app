
import { RegisterForm } from "@/components/auth/register-form";
import { Navbar } from "@/components/base/navbar";

const RegisterPage = () => {
    return (
        <div className="flex flex-col gap-5">
            <Navbar />
            <RegisterForm />
        </div>

    )
}

export default RegisterPage;