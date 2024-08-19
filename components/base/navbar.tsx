import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
import { UserRole } from '@/lib/types';
import { usePathname } from 'next/navigation';
import { RoleGate } from '../auth/role-gate';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import ConstructionIcon from '@mui/icons-material/Construction';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentsIcon from '@mui/icons-material/Payments';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface NavbarProps {
    role: UserRole | null | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showSubMenuServices, setShowSubMenuServices] = useState(false);
    const [showSubMenuMarketplace, setShowSubMenuMarketplace] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    const toggleSubMenuServices = () => {
        setShowSubMenuServices(!showSubMenuServices);
    };

    const toggleSubMenuMarketplace = () => {
        setShowSubMenuMarketplace(!showSubMenuMarketplace);
    };

    const sideList = () => (
        <div className='w-64' role="presentation">
            <List>
                {/* Serviços */}
                <ListItem
                    button
                    onClick={toggleSubMenuServices}
                    className={`flex justify-between items-center gap-4 transition-all duration-300`}
                >
                    <div className='flex items-center gap-4'>
                        <ConstructionIcon />
                        <ListItemText primary="Serviços" />
                    </div>
                    <span>
                        {showSubMenuServices ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    </span>
                </ListItem>
                {showSubMenuServices && (
                    <List component="div" disablePadding className='pl-12'>
                        <ListItem
                            button
                            component={Link}
                            href="/home"
                            className='flex gap-4 transition-all duration-300'
                        >
                            <ListItemText primary="Visão Geral" />
                        </ListItem>
                        <ListItem
                            button
                            component={Link}
                            href="create-service"
                            className='flex gap-4 transition-all duration-300'
                        >
                            <ListItemText primary="Cadastrar" />
                        </ListItem>
                    </List>
                )}

                {/* Marketplace */}
                {role === 'MASTER' || role === 'ADMIN' ? (
                    <>
                        <ListItem
                            button
                            onClick={toggleSubMenuMarketplace}
                            className={`flex justify-between items-center gap-4 transition-all duration-300`}
                        >
                            <div className='flex items-center gap-4'>
                                <StorefrontIcon />
                                <ListItemText primary="Marketplace" />
                            </div>
                            <span>
                                {showSubMenuMarketplace ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                            </span>
                        </ListItem>
                        {showSubMenuMarketplace && (
                            <List component="div" disablePadding className='pl-12'>
                                <ListItem
                                    button
                                    component={Link}
                                    href="/home/marketplace"
                                    className='flex gap-4 transition-all duration-300'
                                >
                                    <ListItemText primary="Estoque" />
                                </ListItem>
                                <ListItem
                                    button
                                    component={Link}
                                    href="/home/marketplace/create/surfboard"
                                    className='flex gap-4 transition-all duration-300'
                                >
                                    <ListItemText primary="Cadastrar" />
                                </ListItem>
                            </List>
                        )}
                    </>
                ) : null}

                {/* Finanças */}
                {role === 'MASTER' ? (
                    <ListItem
                        button
                        component={Link}
                        href="/dashboard"
                        className='flex gap-4 transition-all duration-300'
                    >
                        <PaymentsIcon />
                        <ListItemText primary="Finanças" />
                    </ListItem>
                ) : null}
            </List>
        </div>
    );

    return (
        <div className='w-full'>
            {role === 'USER' && (
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
                        <UserButton />
                    </div>
                </div>
            )}
            {role === 'ADMIN' || role === 'MASTER' ? (
                <><div className='flex justify-between p-4 w-full items-center'>
                    <span className='text-realce' onClick={toggleDrawer(true)}>
                        <MenuIcon fontSize='large' />
                    </span>
                    <Link href={'/home'}>
                        <Image
                            src={'/realce_logo.png'}
                            alt="Realce Nordeste"
                            width={50}
                            height={50} />
                    </Link>
                    <UserButton />
                </div><Drawer open={drawerOpen} onClose={toggleDrawer(false)} sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: 'black',
                        color: '#EAF825',
                    },
                }}>
                        <div>
                            <div className='flex justify-between p-4'>
                                <h1 className='text-white'>Menu</h1>
                                <span className='text-white' onClick={toggleDrawer(false)}>
                                    <CloseIcon />
                                </span>
                            </div>
                            {sideList()}
                        </div>
                    </Drawer></>
            ) : null}
        </div>
    );
};

export default Navbar;