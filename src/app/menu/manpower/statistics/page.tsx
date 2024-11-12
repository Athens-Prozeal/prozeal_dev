'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';

import { Chart } from '@/components/menu/manpower/chart';

export default function Page() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [month, setMonth] = React.useState(currentMonth);
  const [year, setYear] = React.useState(currentYear); 
  
  const handleMonthChange = (event: SelectChangeEvent) => {
    setMonth(Number(event.target.value));
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setYear(Number(event.target.value));

  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Manpower Statistics</Typography>
          <Stack width={200} height={50} direction="row">
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={month.toString()}
                onChange={handleMonthChange}
                label="Age"
              >
                <MenuItem value={1}>January</MenuItem>
                <MenuItem value={2}>February</MenuItem>
                <MenuItem value={3}>March</MenuItem>
                <MenuItem value={4}>April</MenuItem>
                <MenuItem value={5}>May</MenuItem>
                <MenuItem value={6}>June</MenuItem>
                <MenuItem value={7}>July</MenuItem>
                <MenuItem value={8}>August</MenuItem>
                <MenuItem value={9}>September</MenuItem>
                <MenuItem value={10}>October</MenuItem>
                <MenuItem value={11}>November</MenuItem>
                <MenuItem value={12}>December</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={year.toString()}
                onChange={handleYearChange}
                label="Age"
              >
                <MenuItem value={currentYear - 4}>{currentYear - 4}</MenuItem>
                <MenuItem value={currentYear - 3}>{currentYear - 3}</MenuItem>
                <MenuItem value={currentYear - 2}>{currentYear - 2}</MenuItem>
                <MenuItem value={currentYear - 1}>{currentYear - 1}</MenuItem>
                <MenuItem value={currentYear}>{currentYear}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <Chart month={month} year={year} />
      </Stack>
    </Stack>
  );
}
