import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CategoriaService from '../../../service/CategoriaService';
import Categoria from '../../../types/Categoria';
import Instrumento from '../../../types/Instrumento';
import InstrumentoService from '../../../service/InstrumentoService';
import { SelectChangeEvent } from '@mui/material';

const validationSchema = yup.object().shape({
    instrumento: yup.string().required('El nombre del instrumento es obligatorio').min(3, 'El nombre del instrumento debe tener al menos 3 caracteres'),
    descripcion: yup.string().required('La descripción es obligatoria').min(10, 'La descripción debe tener al menos 10 caracteres'),
    marca: yup.string().required('La marca es obligatoria'),
    modelo: yup.string().required('El modelo es obligatorio'),
    precio: yup.number().required('El precio es obligatorio').positive('El precio debe ser un número positivo'),
    costoEnvio: yup.string().required('El costo de envío es obligatorio').test(
        'is-valid-cost',
        'El costo de envío debe ser "G" o un número positivo',
        value => value === 'G' || /^[0-9]*\.?[0-9]+$/.test(value)
    ),
    cantidadVendida: yup.number().required('La cantidad vendida es obligatoria').integer('La cantidad vendida debe ser un número entero').min(0, 'La cantidad vendida no puede ser negativa'),
    imagen: yup.string().url('Debe ser una URL válida')
});

interface ModalInstrumentoProps {
    open: boolean;
    handleClose: () => void;
    instrumentoAEditar: Instrumento | null;
    isEditing: boolean;
}

const ModalInstrumento: React.FC<ModalInstrumentoProps> = ({ open, handleClose, instrumentoAEditar, isEditing }) => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const categoriaService = new CategoriaService();
    const instrumentoService = new InstrumentoService();
    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const categoriasData = await categoriaService.getAll(url + '/categoria');
                setCategorias(categoriasData);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };
        fetchCategorias();
    }, [url]);

    const formik = useFormik({
        initialValues: {
            id: 0,
            instrumento: '',
            marca: '',
            modelo: '',
            imagen: '',
            precio: 0,
            costoEnvio: '',
            cantidadVendida: 0,
            descripcion: '',
            categoria: categorias.length > 0 ? categorias[0] : { id: 0, denominacion: '' }
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (isEditing) {
                    await instrumentoService.put(url + '/instrumento', values.id, values);
                } else {
                    await instrumentoService.post(url + '/instrumento', values);
                }
                handleClose();
            } catch (error) {
                console.error('Error al guardar el producto:', error);
            }
        }
    });

    useEffect(() => {
        if (open && !isEditing) {
            formik.resetForm();
        }
    }, [open, isEditing]);

    useEffect(() => {
        if (instrumentoAEditar && isEditing) {
            const instrumentoConValoresPorDefecto = {
                ...instrumentoAEditar,
                marca: instrumentoAEditar.marca || '',
                modelo: instrumentoAEditar.modelo || '',
                imagen: instrumentoAEditar.imagen || '',
                precio: instrumentoAEditar.precio || 0,
                costoEnvio: instrumentoAEditar.costoEnvio || '',
                cantidadVendida: instrumentoAEditar.cantidadVendida || 0,
                descripcion: instrumentoAEditar.descripcion || '',
                categoria: instrumentoAEditar.categoria || (categorias.length > 0 ? categorias[0] : { id: 0, denominacion: '' })
            };
            formik.setValues(instrumentoConValoresPorDefecto);
        }
    }, [instrumentoAEditar, isEditing, categorias]);

    const handleCategoriaChange = (e: SelectChangeEvent<string>) => {
        const selectedCategoria = categorias.find(categoria => categoria.id === Number(e.target.value));
        formik.setFieldValue('categoria', selectedCategoria || null);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditing ? 'Editar Instrumento' : 'Crear Instrumento'}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="instrumento"
                                label="Instrumento"
                                value={formik.values.instrumento}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                margin="normal"
                                error={formik.touched.instrumento && Boolean(formik.errors.instrumento)}
                                helperText={formik.touched.instrumento && formik.errors.instrumento}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="categoria-label">Categoría</InputLabel>
                                <Select
                                    labelId="categoria-label"
                                    id="categoria"
                                    value={formik.values.categoria ? formik.values.categoria.id.toString() : ''}
                                    onChange={handleCategoriaChange}
                                    onBlur={formik.handleBlur}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Seleccione una categoría</em>
                                    </MenuItem>
                                    {categorias.map(categoria => (
                                        <MenuItem key={categoria.id} value={categoria.id.toString()}>{categoria.denominacion}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="marca"
                                label="Marca"
                                value={formik.values.marca || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                margin="normal"
                                error={formik.touched.marca && Boolean(formik.errors.marca)}
                                helperText={formik.touched.marca && formik.errors.marca}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="modelo"
                                label="Modelo"
                                value={formik.values.modelo || ''}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                margin="normal"
                                error={formik.touched.modelo && Boolean(formik.errors.modelo)}
                                helperText={formik.touched.modelo && formik.errors.modelo}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="imagen"
                                    label="URL de Imagen"
                                    value={formik.values.imagen || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="precio"
                                    label="Precio"
                                    type="number"
                                    value={formik.values.precio || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    margin="normal"
                                    error={formik.touched.precio && Boolean(formik.errors.precio)}
                                    helperText={formik.touched.precio && formik.errors.precio}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="costoEnvio"
                                    label="Costo de Envío"
                                    value={formik.values.costoEnvio || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    margin="normal"
                                    error={formik.touched.costoEnvio && Boolean(formik.errors.costoEnvio)}
                                    helperText={formik.touched.costoEnvio && formik.errors.costoEnvio}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="cantidadVendida"
                                    label="Cantidad Vendida"
                                    type="number"
                                    value={formik.values.cantidadVendida || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    margin="normal"
                                    error={formik.touched.cantidadVendida && Boolean(formik.errors.cantidadVendida)}
                                    helperText={formik.touched.cantidadVendida && formik.errors.cantidadVendida}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="descripcion"
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                    value={formik.values.descripcion || ''}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    margin="normal"
                                    error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                                    helperText={formik.touched.descripcion && formik.errors.descripcion}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            sx={{
                                backgroundColor: 'red',
                                color: 'white',
                                '&:hover': { backgroundColor: 'darkred' },
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: '#0d6efd',
                                color: 'white',
                                '&:hover': { backgroundColor: '#0d6eaa' },
                            }}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    };
    
    export default ModalInstrumento;

