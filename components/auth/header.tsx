
interface HeaderProps {
    label: string,
    title: string,
};

export const Header = ({ label, title }: HeaderProps) => {
    return (
        <div className={"w-full flex flex-col gap-y-4 items-center justify-center"}>
            <h1 className="text-3xl font-semibold">
                {title}
            </h1>
            <p className="text-muted-foreground text-sm text-white">
                {label}
            </p>
        </div>
    )
}