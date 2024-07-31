import * as React from 'react';
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import axios from 'axios';

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { config } from '@/config';
import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';

export function UserTable(props: { workSiteId: string }): React.JSX.Element {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = React.useState([]);

  React.useEffect(() => {
    // Loading animation 
    axios
      .get(`${config.site.serverURL}/api/auth/users/?work_site_id=${props.workSiteId}`, {
        headers: {
          Authorization: authToken,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        setRowData(response.data);
      })
      .catch((error) => {
        // PopUp
        console.error('Error fetching data:', error);
      });
  }, [props.workSiteId]);

  const [colDefs, setColDefs] = React.useState<ColDef[]>([
    { field: 'username', headerName: 'Username', filter: 'agTextColumnFilter' },
    { field: 'email', headerName: 'Email', filter: 'agTextColumnFilter' },
    { field: 'first_name', headerName: 'First Name', filter: 'agTextColumnFilter' },
    { field: 'last_name', headerName: 'Last Name', filter: 'agTextColumnFilter' },
    { field: 'company', headerName: 'Company', filter: 'agTextColumnFilter' },
    { field: 'is_active', headerName: 'Is Active' },
    {
      field: 'actions',
      cellRenderer: ActionButtonsRenderer,
      cellRendererParams: {
        actionsToDisplay: ['edit'],
      },
      minWidth: 150,
    },
  ]);

  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 250 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}
