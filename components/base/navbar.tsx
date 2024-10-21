import Image from 'next/image';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/auth/user-button';
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
import { useUser } from '@/context/UserContext';
import { Bell } from 'lucide-react';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showSubMenuServices, setShowSubMenuServices] = useState(false);
    const [showSubMenuMarketplace, setShowSubMenuMarketplace] = useState(false);
    const { user } = useUser();

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
                    className={`flex justify-between items-center gap-4 transition-all duration-300 text-realce`}
                >
                    <div className='flex items-center gap-4 justify-between'>
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
                            href="/services/create"
                            className='flex gap-4 transition-all duration-300'
                        >
                            <ListItemText primary="Cadastrar" />
                        </ListItem>
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
                            href="/services/status/delivered"
                            className='flex gap-4 transition-all duration-300'
                        >
                            <ListItemText primary="Concluidos" />
                        </ListItem>
                    </List>
                )}

                <div>

                    {/* Marketplace */}
                    {user?.role === 'MASTER' || user?.role === 'ADMIN' ? (
                        <>
                            <ListItem
                                button
                                onClick={toggleSubMenuMarketplace}
                                className={`flex justify-between items-center gap-4 transition-all duration-300 text-realce`}
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
                                        href="/marketplace/create"
                                        className='flex gap-4 transition-all duration-300'
                                    >
                                        <ListItemText primary="Cadastrar" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        component={Link}
                                        href="/marketplace"
                                        className='flex gap-4 transition-all duration-300'
                                    >
                                        <ListItemText primary="Estoque" />
                                    </ListItem>
                                    {/* <ListItem
                                    button
                                    component={Link}
                                    href="/home/marketplace"
                                    className='flex gap-4 transition-all duration-300'
                                >
                                    <ListItemText primary="Vendidas" />
                                </ListItem> */}
                                </List>
                            )}
                        </>
                    ) : null}
                </div>

                {/* Finanças */}
                {/* {user?.role === 'MASTER' ? (
                    <ListItem
                        button
                        component={Link}
                        href="/dashboard"
                        className='flex gap-4 transition-all duration-300 text-realce'
                    >
                        <PaymentsIcon />
                        <ListItemText primary="Finanças" />
                    </ListItem>
                ) : null} */}
            </List>
        </div>
    );

    return (
        <div className='w-full'>
            {user?.role === 'USER' && (
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
                        <div className='flex items-center gap-4'>
                            <span className='text-white'>
                                <Bell />
                            </span>
                            <UserButton />
                        </div>
                    </div>
                </div>
            )}
            {user?.role === 'ADMIN' || user?.role === 'MASTER' ? (
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
                    <div className='flex items-center gap-4'>
                        <span className='text-white'>
                            <Bell />
                        </span>
                        <UserButton />
                    </div>
                </div><Drawer open={drawerOpen} onClose={toggleDrawer(false)} sx={{
                    '& .MuiDrawer-paper': {
                        backgroundColor: '#212121',
                        color: 'white',
                    },
                }}>
                        <div>
                            <div className='flex justify-between p-4 items-center'>
                                <Link href={'/home'}>
                                    <Image
                                        src={'/realce_logo.png'}
                                        alt="Realce Nordeste"
                                        width={50}
                                        height={50}
                                    />
                                </Link>
                                <span className='text-white' onClick={toggleDrawer(false)}>
                                    <CloseIcon />
                                </span>
                            </div>
                            {sideList()}
                        </div>
                    </Drawer></>
            ) : null}
        </div >
    );
};

export default Navbar;