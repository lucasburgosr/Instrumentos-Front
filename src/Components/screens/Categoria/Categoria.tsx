import React, { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography, Container, IconButton } from '@mui/material';
import Categoria from '../../../types/Categoria';
import CategoriaModal from '../../ui/Modals/CategoriaModal';
import CategoriaService from '../../../service/CategoriaService';
import { useAuth } from '../../../contexts/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const Categorias: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { userRole } = useAuth();

  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const fetchCategorias = async () => {
    try {
      const categoriasData = await categoriaService.getAll(url + '/categoria');
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleAbrirModal = (categoria: Categoria | null) => {
    if (categoria) {
      setIsEditing(true)
      setCategoriaSeleccionada(categoria);
    }
    setIsEditing(false)
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditarCategoria = (categoria: Categoria) => {
    handleAbrirModal(categoria);
  };

  const handleEliminarCategoria = async (categoriaId: number) => {
    try {
      // Mostrar un mensaje de confirmación antes de eliminar
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await categoriaService.delete(url + '/categoria', categoriaId);
        // Actualizar las categorías después de eliminar
        const categoriasActualizadas = categorias.filter(categoria => categoria.id !== categoriaId);
        setCategorias(categoriasActualizadas);
        // Mostrar un mensaje de éxito después de eliminar
        Swal.fire(
          '¡Eliminado!',
          'La categoría ha sido eliminada.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      // Mostrar un mensaje de error si ocurre un error al eliminar
      Swal.fire(
        '¡Error!',
        'Hubo un error al eliminar la categoría.',
        'error'
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: '#d0f0c0', padding: '2rem', borderRadius: '8px' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
        <Typography variant="h5" gutterBottom>
          Categorías
        </Typography>
        {userRole === 'ADMIN' && (
          <Button variant="contained" sx={{ backgroundColor: '#006400', '&:hover': { backgroundColor: '#004d00' } }} onClick={() => handleAbrirModal(null)}>
            Crear Categoría
          </Button>
        )}
      </Box>

      <List>
        {categorias.map(categoria => (
          <ListItem key={categoria.id} sx={{ border: '1px solid #eee', borderRadius: '5px', my: 1 }}>
            <ListItemText primary={categoria.denominacion} />
            <Box>
              <IconButton size="small" sx={{ color: '#006400' }} onClick={() => handleEditarCategoria(categoria)}>
                <EditIcon />
              </IconButton>
              {userRole === 'ADMIN' && (
                <IconButton size="small" sx={{ color: '#006400' }} onClick={() => handleEliminarCategoria(categoria.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      <CategoriaModal
        open={modalOpen}
        handleClose={handleCloseModal}
        initialValues={categoriaSeleccionada || { id: 0, denominacion: '' }}
        getCategorias={fetchCategorias}
        isEditing={isEditing}
      />
    </Container>
  );
};

export default Categorias;
