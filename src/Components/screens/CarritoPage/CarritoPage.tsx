import React, { useState, useEffect } from 'react';
import CheckoutMP from '../CheckoutMP/CheckoutMP';
import { PedidoPost } from '../../../types/PedidoPost';
import PedidoDetalleService from '../../../service/PedidoDetalleService';
import PedidoService from '../../../service/PedidoService';
import { PedidoDetallePost } from '../../../types/PedidoDetallePost';
import CartInstrumento from '../../../types/CartInstrumento';
import { Button, Grid, Typography, ListItem, ListItemSecondaryAction, ListItemText, IconButton, Container } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import PedidoDetalle from '../../../types/PedidoDetalle';

interface CarritoPageProps {
  carrito: CartInstrumento[];
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  addToCart: (instrumentoId: number, products: CartInstrumento[]) => void;
}

const CarritoPage: React.FC<CarritoPageProps> = ({ carrito, removeFromCart, clearCart, addToCart }) => {
  const [cantidadItems, setCantidadItems] = useState<{ [key: number]: number }>({});
  const [montoCarrito, setMontoCarrito] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [costoEnvio, setCostoEnvio] = useState<number>(0);
  const [finalizado, setFinalizado] = useState<boolean>(false);
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(false);
  const pedidoDetalleService = new PedidoDetalleService();
  const pedidoService = new PedidoService();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const initialCantidad = carrito.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1;
      return acc;
    }, {} as { [key: number]: number });
    setCantidadItems(initialCantidad);
    setIsCartEmpty(carrito.length === 0);
  }, [carrito]);

  useEffect(() => {
    const total = carrito.reduce((acc, item) => acc + item.quantity * item.precio, 0);
    setSubtotal(total);
  }, [carrito]);

  useEffect(() => {
    setMontoCarrito(subtotal + costoEnvio);
  }, [subtotal, costoEnvio]);

  useEffect(() => {
    actualizarCostoEnvio();
  }, [carrito]);

  const handleFinalizarCompra = async () => {
    const detallesPedido: { id: number }[] = [];
  
    for (const item of carrito) {
      const cantidad = cantidadItems[item.id] || 0;
      if (cantidad > 0) {
        const pedidoDetalle: PedidoDetallePost = {
          cantidad,
          idInstrumento: item.id
        };
        const response = await pedidoDetalleService.post(url + '/pedidoDetalle', pedidoDetalle) as PedidoDetalle;
        detallesPedido.push({ id: response.id });
      }
    }
  
    const totalPedido = subtotal + costoEnvio;
  
    const pedido: PedidoPost = {
      totalPedido,
      pedidosDetalle: detallesPedido.map(detalle => detalle.id)
    };
  
    await pedidoService.post(url + '/pedido', pedido);
  
    setMontoCarrito(totalPedido);
    setFinalizado(true);
  };
  

  const handleVaciarCarrito = () => {
    clearCart();
    setIsCartEmpty(true);
  };

  const actualizarCostoEnvio = () => {
    // Sumar el costo de envío de los instrumentos en el carrito
    let costoEnvioTotal = 0;
    
    carrito.forEach(item => {
      if (item.costoEnvio === 'G') {
        costoEnvioTotal += 0;
      } else {
        if(item.costoEnvio){
        costoEnvioTotal += parseFloat(item.costoEnvio);
        }
      }
    });
    setCostoEnvio(costoEnvioTotal);
  };

  return (
    <Container sx={{padding: '2rem', borderRadius: '8px' }} className='bg-transparent'>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography variant='h6' sx={{mt: 2}}>Carrito de Compras</Typography>
        </Grid>
        <Grid item container direction="column" spacing={1}>
          {isCartEmpty ? (
            <Grid item>
              <Typography variant="body1">El carrito está vacío</Typography>
            </Grid>
          ) : (
            carrito.map((item) => (
              <ListItem key={item.id} sx={{ width: '100%' }}>
                <ListItemText primary={`${item.instrumento} - $${item.precio}`} secondary={`Cantidad: ${item.quantity}`} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => removeFromCart(item.id)}><RemoveIcon /></IconButton>
                  <IconButton onClick={() => addToCart(item.id, carrito)}><AddIcon /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </Grid>
        <Grid item>
          <Typography variant="body1" gutterBottom>Subtotal: ${subtotal}</Typography>
          <Typography variant="body1" gutterBottom>Costo de envío: ${costoEnvio}</Typography>
          <Typography variant="body1" gutterBottom>Total: ${montoCarrito}</Typography>
        </Grid>
        {!isCartEmpty && (
          <Grid item>
            <Button
              onClick={handleVaciarCarrito}
              variant="outlined"
              startIcon={<DeleteIcon />}
              sx={{ width: '100%', backgroundColor: '#2E8B57', color: 'white', '&:hover': { backgroundColor: '#276a45' } }}
            >
              Vaciar Carrito
            </Button>
          </Grid>
        )}
        {!finalizado ? (
          <Grid item>
            <Button
              disabled={isCartEmpty}
              onClick={handleFinalizarCompra}
              variant="contained"
              color="primary"
              sx={{ width: '100%', backgroundColor: '#2E8B57', color: 'white', '&:hover': { backgroundColor: '#276a45' } }}
            >
              Finalizar Compra
            </Button>
          </Grid>
        ) : (
          <Grid item>
            <CheckoutMP montoCarrito={montoCarrito} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CarritoPage;
