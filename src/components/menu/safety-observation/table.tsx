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

interface SafetyObservationProps {}

export interface SafetyObservationHandles {
  triggerClick: () => void;
}

const SafetyObservationTable = forwardRef<SafetyObservationHandles, SafetyObservationProps>((props, ref) => {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const router = useRouter();
  const [rowData, setRowData] = React.useState([]);
  const [colDefs, setColDefs] = React.useState<ColDef[]>();

  const gridRef = useRef<AgGridReact>(null);

  React.useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/safety-observation/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setRowData(response.data);

        setColDefs([
          { field: 'date', headerName: 'Date', filter: 'agDateColumnFilter' },
          { field: 'time', headerName: 'Time', filter: 'agTextColumnFilter' },
          { field: 'work_location', headerName: 'Work Location', filter: 'agNumberColumnFilter' },
          { field: 'department', headerName: 'Department', filter: 'agTextColumnFilter' },
          {
            field: 'actions',
            cellRenderer: ActionButtonsRenderer,
            cellRendererParams: {
              actionsToDisplay: ['view', 'edit', 'delete'],
              viewUrl: `/menu/safety-observation/view?safetyObservationId=`,
              router: router,
            },
            minWidth: 250,
          },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const exportSafetyObservation = () => {
    const params = {
      columnKeys: ['date', 'time', 'work_location', 'department'],
    };

    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv(params);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerClick: exportSafetyObservation,
  }));

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} pagination />
    </div>
  );
});

export default SafetyObservationTable;
