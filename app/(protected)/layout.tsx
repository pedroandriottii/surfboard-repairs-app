import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="bg-[#D0D5DD]">
            <Navbar />
            {children}
        </div>
    )
}

export default ProtectedLayout