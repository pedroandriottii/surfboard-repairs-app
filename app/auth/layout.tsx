// ARQUIVO DE PADRONIZAÇÃO PARA AS TELAS DA PASTA AUTH

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            {children}
        </div>
    );
    };

export default AuthLayout;