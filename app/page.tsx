import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
    <div className="flex items-center flex-col  align-center justify-between bg-slate-600 text-white">
      <h1 className="">Realce Nordeste</h1>
      <div>
        <LoginButton mode="modal" asChild>
          <Button variant="secondary" size="lg">Login</Button>
        </LoginButton>
      </div>
    </div>
  );
}
