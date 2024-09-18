import Image from 'next/image';
import Link from 'next/link';

import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';

const surfboardModels = [
  { name: 'Bandida', href: '/catalogo/modelos/BANDIDA' },
  { name: 'Coringa', href: '/catalogo/modelos/CORINGA' },
  { name: 'M.R', href: '/catalogo/modelos/MR' },
  { name: 'Fish 70 & Tal', href: '/catalogo/modelos/FISH_70' },
  { name: 'Goo Fish', href: '/catalogo/modelos/GOO_FISH' },
  { name: 'Fish Super Cat', href: '/catalogo/modelos/FISH_SUPER' },
  { name: 'Mini Fun', href: '/catalogo/modelos/MINI_FUN' },
  { name: 'Mini Long', href: '/catalogo/modelos/MINI_LONG' },
  { name: 'Long', href: '/catalogo/modelos/LONG' },
  { name: 'Kite Surf', href: '/catalogo/modelos/KITE_SURF' },
  { name: 'Kite Foil', href: '/catalogo/modelos/KITE_FOIL' },
];

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const sideList = () => (
    <div className='w-64' role="presentation">
      <List>
        {surfboardModels.map((model) => (
          <ListItem
            button
            component={Link}
            href={model.href}
            key={model.name}
            className='flex gap-4 transition-all duration-300 text-realce'
          >
            <ListItemText primary={model.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className='w-full'>
      <div className='flex justify-between p-4 w-full items-center'>
        <span className='text-realce' onClick={toggleDrawer(true)}>
          <MenuIcon fontSize='large' />
        </span>
        <Link href={'/'}>
          <Image
            src={'/realce_logo.png'}
            alt="Realce Nordeste"
            width={50}
            height={50} />
        </Link>
      </div>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)} sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#212121',
          color: 'white',
        },
      }}>
        <div>
          <div className='flex justify-between p-4 items-center'>
            <Link href={'/'}>
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
      </Drawer>
    </div>
  );
};

export default Navbar;