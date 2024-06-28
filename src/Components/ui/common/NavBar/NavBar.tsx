import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../../../../contexts/AuthContext';
import CarritoPage from '../../../screens/CarritoPage/CarritoPage';
import { useCart } from '../../../../contexts/CartContext';
import CartInstrumento from '../../../../types/CartInstrumento';

const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userRole, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToCart, removeFromCart, cart, clearCart } = useCart();

  const handleCartClick = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const totalItems = cart.reduce((total: number, item: CartInstrumento) => total + item.quantity, 0);

  return (
    <>
      <Navbar className='mb-4' bg="secondary" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">La Casa de la Música</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/instrumentos">Instrumentos</Nav.Link>
            <Nav.Link as={Link} to="/dondeestamos">Dónde Estamos</Nav.Link>
            {isAuthenticated && (userRole === 'ADMIN' || userRole === 'OPERADOR') && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              </>
            )}
            {isAuthenticated && userRole === 'ADMIN' && (
              <Nav.Link as={Link} to="/estadisticas">Estadísticas</Nav.Link>
            )}
            {isAuthenticated && userRole === 'CLIENTE' && (
              <Button variant="primary" onClick={handleCartClick} className="carrito-button">
                <Badge badgeContent={totalItems} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </Button>
            )}
          </Nav>
          {!isAuthenticated ? (
            <Button variant="outline-light" onClick={handleLoginClick}>
              <AccountCircleIcon /> Iniciar Sesión
            </Button>
          ) : (
            <>
              <Button variant="outline-light" onClick={handleMenuClick}>
                <AccountCircleIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogoutClick}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          )}
        </Container>
      </Navbar>
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: 300 }}>
          <List>
            <ListItem button onClick={handleDrawerClose}>
              <ListItemIcon>
                <ChevronRightIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Carrito" />
            </ListItem>
            <Divider />
            {isAuthenticated && userRole === 'CLIENTE' && (
              <CarritoPage carrito={cart} removeFromCart={removeFromCart} clearCart={clearCart} addToCart={addToCart} />
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default NavBar;
