// src/Components/charts/BasicPie.tsx
import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface PieData {
  id: number;
  value: number;
  label: string;
}

export default function BasicPie() {
  const [data, setData] = useState<PieData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/pedido/groupedByInstrument');
        if (response.ok) {
          const jsonData = await response.json();
          const formattedData: PieData[] = jsonData.map((item: any, index: number) => ({
            id: index,
            label: item[0],
            value: item[1],
          }));
          setData(formattedData);
        } else {
          console.error('Error fetching pie chart data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <PieChart
      series={[{ data }]}
      width={400}
      height={200}
    />
  );
}
