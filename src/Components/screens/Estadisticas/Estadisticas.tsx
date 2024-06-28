import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import BasicPie from '../../ui/Charts/BasePie';
import BasicBars from '../../ui/Charts/BaseBar';

const Estadisticas: React.FC = () => {
  return (
    <Container sx={{ backgroundColor: '#dcdcde', padding: '2rem', borderRadius: '8px' }}>
      <Typography variant="h4" component="h1" gutterBottom className='text-center'>
        Estadísticas
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box bgcolor="#ffffff" borderRadius={8} p={2}>
            <Typography variant="h6" component="h2" align="center" gutterBottom>
              Cantidad de instrumentos vendidos
            </Typography>
            <BasicPie />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box bgcolor="#ffffff" borderRadius={8} p={2}>
            <Typography variant="h6" component="h2" align="center" gutterBottom>
              Pedidos Agrupados por Año
            </Typography>
            <BasicBars />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Estadisticas;
