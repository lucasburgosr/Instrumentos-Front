import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import InstrumentoService from '../../../service/InstrumentoService';
import CategoriaService from '../../../service/CategoriaService';
import { SelectChangeEvent } from '@mui/material';
import { useCart } from '../../../contexts/CartContext';
import NoResults from '../../ui/Cards/NoResults/NoResults';
import InstrumentoCard from '../../ui/Cards/Instrumento/InstrumentoCard';

const Instrumentos = () => {
  const [instrumentos, setInstrumentos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const instrumentoService = new InstrumentoService();
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const instrumentosData = await instrumentoService.getAll(url + '/instrumento');
        if (instrumentosData.length === 0) {
          setError('No se encontraron instrumentos.');
        } else {
          setInstrumentos(instrumentosData);
        }
      } catch (error) {
        setError('Error al obtener los instrumentos.');
        console.error('Error al obtener los instrumentos:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const categoriasData = await categoriaService.getAll(url + '/categoria');
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchInstrumentos();
    fetchCategorias();
  }, [url]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const filteredInstrumentos = instrumentos.filter((instrumento) =>
    instrumento.instrumento.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || instrumento.categoria.denominacion === selectedCategory)
  );

  return (
    <Container maxWidth="xl" sx={{ padding: '2rem', borderRadius: '8px' }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Instrumentos Disponibles
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={8}>
          <TextField
            label="Buscar por nombre"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="select-category-label">Categoría</InputLabel>
            <Select
              labelId="select-category-label"
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Categoría"
            >
              <MenuItem value="">Todas</MenuItem>
              {categorias.map((categoria) => (
                <MenuItem key={categoria.id} value={categoria.denominacion}>{categoria.denominacion}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress /> 
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : filteredInstrumentos.length === 0 ? (
        <NoResults />
      ) : (
        filteredInstrumentos.map((instrumento) => (
          <InstrumentoCard 
            key={instrumento.id}
            instrumento={instrumento} 
            onAddToCart={() => addToCart(instrumento.id, [instrumento])} 
          />
        ))
      )}
    </Container>
  );
};

export default Instrumentos;
