'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { ColDef } from 'ag-grid-community'; // Importing ColDef type
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid
import '@/styles/ag-grid.css';
import axios from 'axios';
import { config } from '@/config';

import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';
import verificationButton from '@/components/menu/manpower/verification-button';

export default function Page() {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef<AgGridReact>(null);

  React.useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/manpower/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: {
          Authorization: authToken,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        setRowData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: 'date', headerName: 'Date', filter: 'agDateColumnFilter' },
    { field: 'sub_contractor', headerName: 'Sub Contractor', filter: 'agTextColumnFilter' },
    { field: 'number_of_workers', headerName: 'Number Of Workers', filter: 'agDateNumberFilter' },
    { field: 'verification_status', 
      headerName: 'Verification Status', 
      cellRenderer: verificationButton,
      filter: 'agTextColumnFilter' 
    },
    {
      // Display actions
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,
      cellRendererParams: {
        actionToDisplay: ['edit','delete'],
      },
      minWidth: 150,
    },
  ]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Manpower</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
          <Button
            component={RouterLink}
            href={'/menu/manpower/statistics'}
            startIcon={<EyeIcon fontSize="var(--icon-fontSize-md)" />}
            color="inherit"
          >
              View Report
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <Stack>
        <div
          className="ag-theme-quartz" // applying the Data Grid theme
          style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
          <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} pagination />
        </div>
      </Stack>
    </Stack>
  );
}
