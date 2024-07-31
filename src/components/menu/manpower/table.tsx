'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ColDef } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the Data Grid
import '@/styles/ag-grid.css';

import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';
import verificationButton from '@/components/menu/manpower/verification-button';
import { config } from '@/config';

export function ManpowerTable():React.JSX.Element {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const role = localStorage.getItem('role');
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
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
    { field: 'sub_contractor_username', headerName: 'Sub Contractor', filter: 'agTextColumnFilter' },
    { field: 'number_of_workers', headerName: 'Number Of Workers', filter: 'agDateNumberFilter' },
    {
      field: 'verification_status',
      headerName: 'Verification Status',
      cellRenderer: verificationButton,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,
      cellRendererParams: {
        actionsToDisplay: ['edit', 'delete'],
      },
      minWidth: 150,
    },
  ]);

  if (role === 'sub_contractor') {
    // const subContractorColDefs = colDefs.join()
  }

  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 500 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} pagination />
    </div>
  );
}
