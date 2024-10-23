import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ConstructionIcon from '@mui/icons-material/Construction';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Bell, LayoutDashboard, LogOut } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showSubMenuServices, setShowSubMenuServices] = useState(false);
    const [showSubMenuMarketplace, setShowSubMenuMarketplace] = useState(false);
    const { user, setUser } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('accessToken');
        setUser(null);
        router.push('/');
    };

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

    const toggleSubMenuServices = () => setShowSubMenuServices(!showSubMenuServices);
    const toggleSubMenuMarketplace = () => setShowSubMenuMarketplace(!showSubMenuMarketplace);

    const sideList = () => (
        <div className='w-64' role="presentation">
            <List>
                <ListItem button onClick={toggleSubMenuServices} className="flex justify-between items-center gap-4 text-realce">
                    <div className='flex items-center gap-4'>
                        <ConstructionIcon />
                        <ListItemText primary="Serviços" />
                    </div>
                    {showSubMenuServices ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                </ListItem>
                {showSubMenuServices && (
                    <List component="div" disablePadding className='pl-12'>
                        {user?.role === 'MASTER' || user?.role === 'ADMIN' && (
                            <ListItem button component={Link} href="/services/create" className='transition-all duration-300'>
                                <ListItemText primary="Cadastrar" />
                            </ListItem>
                        )}
                        <ListItem button component={Link} href="/home" className='transition-all duration-300'>
                            <ListItemText primary="Visão Geral" />
                        </ListItem>
                        <ListItem button component={Link} href="/services/status/delivered" className='transition-all duration-300'>
                            <ListItemText primary="Concluídos" />
                        </ListItem>
                    </List>
                )}

                {(user?.role === 'MASTER' || user?.role === 'ADMIN') && (
                    <>
                        <ListItem button onClick={toggleSubMenuMarketplace} className="flex justify-between items-center gap-4 text-realce">
                            <div className='flex items-center gap-4'>
                                <StorefrontIcon />
                                <ListItemText primary="Marketplace" />
                            </div>
                            {showSubMenuMarketplace ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                        </ListItem>
                        {showSubMenuMarketplace && (
                            <List component="div" disablePadding className='pl-12'>
                                <ListItem button component={Link} href="/marketplace/create" className='transition-all duration-300'>
                                    <ListItemText primary="Cadastrar" />
                                </ListItem>
                                <ListItem button component={Link} href="/marketplace" className='transition-all duration-300'>
                                    <ListItemText primary="Estoque" />
                                </ListItem>
                            </List>
                        )}
                    </>
                )}
                {user?.role === 'MASTER' && (
                    <ListItem button component={Link} href="/dashboard" className='transition-all duration-300'>
                        <div className='flex items-center gap-4'>
                            <LayoutDashboard />
                            <ListItemText primary="Dashboard" />
                        </div>
                    </ListItem>
                )}

                <ListItem button onClick={handleLogout} className='transition-all duration-300 text-realce flex items-center'>
                    <LogOut className="mr-2" />
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className='w-full'>
            <div className='flex justify-between w-full p-4'>
                <Link href={'/home'}>
                    <div className='relative w-[50px] h-[50px]'>
                        <Image
                            src={'/realce_logo.png'}
                            alt="Realce Nordeste"
                            fill
                            sizes="(max-width: 768px) 50px, 50px"
                            className="object-contain"
                        />
                    </div>
                </Link>

                <div className='flex gap-4 items-center'>
                    <span className='text-realce'>
                        <Bell />
                    </span>
                    <span className='text-realce cursor-pointer' onClick={toggleDrawer(true)}>
                        <MenuIcon fontSize='large' />
                    </span>
                </div>
            </div>

            <Drawer open={drawerOpen} onClose={toggleDrawer(false)} sx={{
                '& .MuiDrawer-paper': {
                    backgroundColor: '#212121',
                    color: 'white',
                },
            }}>
                <div>
                    <div className='flex justify-between p-4 items-center'>
                        <Link href={'/home'}>
                            <div className='relative w-[50px] h-[50px]'>
                                <Image
                                    src={'/realce_logo.png'}
                                    alt="Realce Nordeste"
                                    fill
                                    sizes="(max-width: 768px) 50px, 50px"
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <span className='text-realce cursor-pointer' onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </span>
                    </div>
                    {sideList()}
                </div>
            </Drawer>
        </div>
    );
};

export default Navbar;
