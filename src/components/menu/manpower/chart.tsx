'use client';

import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { config } from '@/config';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface Report {
  date: string;
  number_of_workers: number;
}

interface SubContractorReport {
  sub_contractor: string;
  report: Report[];
}

const colors = [
    'rgb(63, 81, 181)',    // Indigo
    'rgb(255, 193, 7)',  // Amber
    'rgb(33, 150, 243)',   // Blue
    'rgb(0, 188, 212)',    // Cyan
    'rgb(76, 175, 80)',    // Green
    'rgb(255, 235, 59)',   // Yellow
    'rgb(156, 39, 176)',   // Purple
    'rgb(255, 87, 34)',    // Deep Orange
    'rgb(139, 195, 74)',   // Light Green
];


export function Chart(props: { month: number; year: number }) {
  const { year, month } = props;
  const [datasets, setDatasets] = useState<any[]>([]);

  function generateDaysInMonth(year: number, month: number): number[] {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  const days = generateDaysInMonth(year, month);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${config.site.serverURL}/api/manpower/statistics/?month=${month}&year=${year}&work_site_id=${localStorage.getItem('work-site-id')}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access-token')}`,
      },
    }).then((response) => {
      const allReports: SubContractorReport[] = response.data;
      const newDatasets = allReports.map((subContractorReport, index) => {
        const dataset: {
          label: string;
          borderColor: string;
          backgroundColor: string;
          data: number[];
          tension: number;
        } = {
          label: subContractorReport.sub_contractor,
          borderColor: colors[index % colors.length],
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light background color for area under the line
          data: days.map(() => 0), // Initialize all days with 0
          tension: 0.2,
        };

        subContractorReport.report.forEach((report) => {
          const date = new Date(report.date);
          const day = date.getDate();
          if (day >= 1 && day <= days.length) {
            dataset.data[day - 1] = report.number_of_workers;
          }
        });

        return dataset;
      });

      setDatasets(newDatasets);
    });
  }, [year, month]);

  const data = {
    labels: days.map((day) => `${day}`), // Convert days to strings
    datasets,
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Workers: ${tooltipItem.raw}`; // Customize tooltip content
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.3, // Smooth lines
      },
      point: {
        radius: 2, // Radius of data points
        hoverRadius: 5, // Radius of data points on hover
        backgroundColor: (context: any) => {
          const index = context.dataIndex;
          return colors[index % colors.length]; // Background color of data points
        },
      },
    },
    maintainAspectRatio: false, // Adjust the aspect ratio if needed
  };

  const renderLegend = () => {
    return (
      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        {datasets.map((dataset, index) => (
          <Stack direction="row" alignItems="center" key={dataset.label}>
            <Box
              sx={{
                width: 20,
                height: 10,
                backgroundColor: colors[index % colors.length],
                mr: 1,
              }}
            />
            <Typography variant="body2">{dataset.label}</Typography>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
      <Line data={data} options={options} />
      {renderLegend()}
    </Box>
  );
}
