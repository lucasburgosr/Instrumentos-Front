import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, Typography, Box, Grid } from '@mui/material';
import { AddShoppingCart as AddShoppingCartIcon, Info as InfoIcon } from '@mui/icons-material';
import CartInstrumento from '../../../../types/CartInstrumento';
import { useAuth } from '../../../../contexts/AuthContext';

interface InstrumentoCardProps {
  instrumento: CartInstrumento;
  onAddToCart: (instrumento: CartInstrumento) => void;
}

const InstrumentoCard: React.FC<InstrumentoCardProps> = ({ instrumento, onAddToCart }) => {
  const { isAuthenticated, userRole } = useAuth();
  const { instrumento: nombreInstrumento, marca, modelo, imagen, precio, descripcion } = instrumento;

  const showAddToCartButton = isAuthenticated && userRole !== 'ADMIN' && userRole !== 'OPERADOR';

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', width: '100%', height: '200px', marginBottom: '1rem' }} className='bg-light'>
      {/* Bloque de la imagen */}
      <Box sx={{ width: '200px', height: '200px', overflow: 'hidden' }}>
        <img
          src={"/img/" + imagen}
          alt={nombreInstrumento}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      
      {/* Bloque de la descripción */}
      <CardContent sx={{ flexGrow: 1, padding: '1rem' }}>
        <Typography variant="h6">{nombreInstrumento}</Typography>
        <Typography variant="body2" color="textSecondary">{descripcion}</Typography>
        <Typography variant="body1">Marca: {marca}</Typography>
        <Typography variant="body1">Modelo: {modelo}</Typography>
        <Typography variant="body1" gutterBottom>Precio: ${precio}</Typography>
      </CardContent>
      
      {/* Bloque de acciones */}
      <CardActions sx={{ width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem' }}>
        <Grid container spacing={1}>
          {showAddToCartButton && (
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => onAddToCart(instrumento)}
                fullWidth
                sx={{ backgroundColor: 'darkgreen', color: 'white', '&:hover': { backgroundColor: 'green' } }}
              >
                Agregar al carrito
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Link to={`/detalles/${instrumento.id}`} style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                variant="contained"
                startIcon={<InfoIcon />}
                fullWidth
                sx={{ color: 'white' }}
                className='btn-primary'
              >
                Ver detalles
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default InstrumentoCard;
