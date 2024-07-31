import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '@/styles/ag-grid.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { config } from '@/config';
import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';

interface ToolBoxTalkTableProps {}

export interface ToolBoxTalkTableHandles {
  triggerClick: () => void;
}

const ToolBoxTalkTable = forwardRef<ToolBoxTalkTableHandles, ToolBoxTalkTableProps>((props, ref) => {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = React.useState([]);

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

  const exportTBT = () => {
    const params = {
      columnKeys: ['date', 'topic', 'number_of_participants', 'agency_name'],
    };

    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv(params);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerClick: exportTBT,
  }));

  const [colDefs, setColDefs] = React.useState<ColDef[]>([
    { field: 'date', headerName: 'Date', filter: 'agDateColumnFilter' },
    { field: 'topic', headerName: 'Topic', filter: 'agTextColumnFilter' },
    { field: 'number_of_participants', headerName: 'Number Of Participants', filter: 'agNumberColumnFilter' },
    { field: 'agency_name', headerName: 'Agency Name', filter: 'agTextColumnFilter' },
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

export default ToolBoxTalkTable;
