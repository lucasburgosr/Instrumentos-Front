import { Typography, Box } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NoResults = () => {
  return (
    <Box textAlign="center" mt={4}>
      <SentimentVeryDissatisfiedIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
      <Typography variant="body1" color="text.secondary" mt={2}>
        No se encontraron resultados que coincidan con la búsqueda.
      </Typography>
    </Box>
  );
};

export default NoResults;
