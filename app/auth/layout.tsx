const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center bg-slate-800">
            {children}
        </div>
    );
    };

export default AuthLayout;