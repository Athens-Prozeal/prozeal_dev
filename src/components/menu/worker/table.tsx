import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ColDef } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '@/styles/ag-grid.css';

import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';

import { config } from '@/config';
import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';

interface WorkerProps {}

export interface WorkerHandles {
  triggerClick: () => void;
}

const WorkerTable = forwardRef<WorkerHandles, WorkerProps>((props, ref) => {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = React.useState([]);

  const gridRef = useRef<AgGridReact>(null);

  React.useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/worker/?work_site_id=${localStorage.getItem('work-site-id')}`, {
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

  const exportWorker = () => {
    const params = {
      columnKeys: ['name', 'induction_date', 'father_name', 'agency_name'], // keys of the columns you want to export
    };

    if (gridRef.current?.api) {
      // if the grid is available
      gridRef.current.api.exportDataAsCsv(params);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerClick: exportWorker,
  }));

  const [colDefs, setColDefs] = React.useState<ColDef[]>([
    { field: 'name', headerName: 'Name', filter: 'agTextColumnFilter' },
    { field: 'induction_date', headerName: 'Induction Date', filter: 'agDateColumnFilter' },
    { field: 'father_name', headerName: 'Father Name', filter: 'agTextColumnFilter' },
    { field: 'created_under', headerName: 'Created Under', filter: 'agTextColumnFilter' },
    { field: 'date_of_birth', headerName: 'Date Of Birth', filter: 'agDateColumnFilter' },
    {
      field: 'gender',
      headerName: 'Gender',
      filter: 'agTextColumnFilter',
      valueGetter: (params) => {
        if (params.data.gender === 'M') {
          return 'Male';
        } else if (params.data.gender === 'F') {
          return 'Female';
        } else if (params.data.gender === 'O') {
          return 'Other';
        }
        return params.data.gender;
      },
    },
    { field: 'designation', headerName: 'Designation', filter: 'agTextColumnFilter' },

    {
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,
      cellRendererParams: {
        actionsToDisplay: ['view', 'edit', 'delete'],
      },
      minWidth: 250,
    },
  ]);

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} pagination />
    </div>
  );
});


export default WorkerTable;
