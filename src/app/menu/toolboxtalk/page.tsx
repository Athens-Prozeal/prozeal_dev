'use client';

import * as React from 'react';
import { useCallback, useRef } from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { ColDef } from 'ag-grid-community'; // Importing ColDef type
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import axios from 'axios';

import { config } from '@/config';

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid

import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';

// New file: metadata.ts

export default function Grid() {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef<AgGridReact>(null);

  React.useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/tbt/?work_site_id=${localStorage.getItem('work-site-id')}`, {
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
    { field: 'topic', headerName: 'Topic', filter: 'agTextColumnFilter' },
    { field: 'number_of_participants', headerName: 'Number Of Participants', filter: 'agNumberColumnFilter' },
    { field: 'agency_name', headerName: 'Agency Name', filter: 'agTextColumnFilter' },
    {
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,
      minWidth: 250,
    },
  ]);

  const onBtnExport = useCallback(() => {
    const params = {
      columnKeys: ['date', 'topic', 'number_of_participants', 'agency_name'], // Specify the keys of the columns you want to export
    };

    gridRef.current!.api.exportDataAsCsv(params);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Tool Box Talk</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} onClick={onBtnExport}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => {
              window.location.href = '/menu/toolboxtalk/add';
            }}
          >
            Add
          </Button>
        </div>
      </Stack>
      <Stack>
        <div
          className="ag-theme-quartz" // applying the Data Grid theme
          style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
          <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} />
        </div>
      </Stack>
    </Stack>
  );
}
