import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box, Paper, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import InstrumentoService from '../../../service/InstrumentoService';
import Instrumento from '../../../types/Instrumento';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { green } from '@mui/material/colors';

interface DetallesProps {
    addToCart: (id: number, cart: any[]) => void;
    userRole: string; // Nuevo prop para el rol del usuario
}

const Detalles: React.FC<DetallesProps> = ({ addToCart, userRole }) => {
    const [instru, setInstrumento] = useState<Instrumento>();
    const instrumentoService = new InstrumentoService();
    const { id } = useParams<{ id: string }>();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchInstrumento = async () => {
            try {
                if (id) {
                    const instrumentoId = parseInt(id, 10);
                    const fetchedInstrumento = await instrumentoService.get(url + '/instrumento', instrumentoId);
                    setInstrumento(fetchedInstrumento);
                }
            } catch (error) {
                console.error('Error al obtener el instrumento:', error);
            }
        };

        fetchInstrumento();
    }, [id, instrumentoService, url]);

    const handleGenerarPDF = async () => {
        try {
            const response = await fetch(`${url}/reporte/pdf/${id}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            } else {
                console.error('Error al generar el PDF:', response.statusText);
            }
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };

    if (!instru) {
        return <Typography variant="body1">Cargando detalles del instrumento...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, padding: '2rem', borderRadius: '8px' }} className='bg-light'>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        {instru.instrumento}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={`/img/${instru.imagen}`}
                            alt={instru.instrumento}
                            sx={{ height: 'auto', maxHeight: 500 }}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2}} className='bg-grey'>
                        <CardContent>
                            <Box mb={2}>
                                <Typography variant="h6">Descripción</Typography>
                                <Typography variant="body1">{instru.descripcion}</Typography>
                            </Box>
                            <Box mb={2}>
                                <Typography variant="h6">Detalles</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Marca:</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>{instru.marca}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Modelo:</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>{instru.modelo}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Precio:</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}>{`${instru.precio}`}</Typography>
                                {instru.costoEnvio && (
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Costo de envío: {instru.costoEnvio === 'G' ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: green[500] }}>
                                                <LocalShippingIcon sx={{ mr: 1 }} />
                                                Gratis
                                            </Box>
                                        ) : `$${instru.costoEnvio}`}
                                    </Typography>
                                )}
                                {instru.cantidadVendida && (
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Cantidad vendida: {instru.cantidadVendida}</Typography>
                                )}
                                {instru.categoria?.denominacion && (
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>Categoría: {instru.categoria.denominacion}</Typography>
                                )}
                                {userRole === 'CLIENTE' && ( 
                                    <Grid item xs={12}>
                                        <Button sx={{ mt: 2, width: '100%', backgroundColor: '#2E8B57', color: 'white' }} variant="contained" onClick={() => addToCart(instru.id, [instru])}>Agregar al carrito</Button>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Button sx={{ mt: 2, width: '100%', color: 'white' }} className='btn-primary' variant="contained" onClick={handleGenerarPDF}>Generar PDF</Button>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Detalles;
