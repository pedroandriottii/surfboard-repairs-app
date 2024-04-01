interface HomeLayoutProps {
    children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <div className="bg-[#D0D5DD]">
            {children}
        </div>
    )
}

export default HomeLayout;