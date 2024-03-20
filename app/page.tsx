// import { Montserrat } from "next/font/google";
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button";

// const font = Montserrat({
//     subsets: ['latin'],
//     weight: ["600"]
// });

export default function Home() {
  return (
    <div className="flex items-center flex-col  align-center justify-between">
      <h1 className="">Realce Nordeste</h1>
      <LoginButton>
        <Button>Login</Button>
      </LoginButton>
    </div>
  );
}
