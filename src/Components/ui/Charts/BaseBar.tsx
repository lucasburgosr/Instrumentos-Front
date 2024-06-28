import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

interface BarData {
  year: number;
  month: number;
  value: number;
}

export default function BasicBars() {
  const [data, setData] = useState<BarData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/pedido/agruparPorAño');
        if (response.ok) {
          const jsonData = await response.json();
          const formattedData: BarData[] = jsonData.map((item: any) => ({
            year: item[0],
            month: item[1],
            value: item[2],
          }));
          setData(formattedData);
        } else {
          console.error('Error fetching bar chart data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map(item => `${item.month}/${item.year}`) }]}
      series={[{ data: data.map(item => item.value) }]}
      width={500}
      height={300}
    />
  );
}
