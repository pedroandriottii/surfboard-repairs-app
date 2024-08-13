import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import { UserRole } from '@/lib/types';
import { usePathname } from 'next/navigation';

interface NavbarProps {
    role: UserRole | null | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
    const pathname = usePathname();

    return (
        <div className='flex justify-between w-full md:pr-4 p-4'>
            <Link href={'/home'}>
                <Image
                    src={'/realce_logo.png'}
                    alt="Realce Nordeste"
                    width={50}
                    height={50}
                />
            </Link>
            <div className='flex gap-4 items-center'>
                <Link href={'/home'}>
                    <Button
                        className={`bg-transparent border-2 border-realce text-realce max-h-8 rounded-xl hover:bg-white hover:text-black hover:border-none hover:transition-all ${pathname.startsWith('/home') || pathname.startsWith('/services/') || pathname === '/create-service' ? 'bg-realce text-black' : ''}`}
                    >
                        Serviços
                    </Button>
                </Link>

                {role === 'MASTER' && (
                    <div className='flex items-center gap-4'>
                        <Link href={'/dashboard'}>
                            <Button
                                className={`bg-transparent border-2 border-realce text-realce max-h-8 rounded-xl hover:bg-white hover:text-black hover:border-none hover:transition-all ${pathname === '/dashboard' ? 'bg-realce text-black' : ''}`}
                            >
                                Finanças
                            </Button>
                        </Link>
                    </div>
                )}
                <UserButton />
            </div>
        </div>
    );
};

export default Navbar;
