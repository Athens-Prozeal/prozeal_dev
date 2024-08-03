import * as React from 'react';
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import axios from 'axios';

import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { config } from '@/config';
import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';

interface UserTableProps {
  workSiteId?: string;
}

export function UserTable(props: UserTableProps): React.JSX.Element {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const [rowData, setRowData] = React.useState([]);
  const [colDefs, setColDefs] = React.useState<ColDef[]>();

  React.useEffect(() => {
    // Build the URL with work_site_id if provided
    let url = `${config.site.serverURL}/api/auth/user/`;
    if (props.workSiteId) {
      url += `?work_site_id=${props.workSiteId}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: authToken,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        setRowData(response.data);

        const baseColDefs: ColDef[] = [
          { field: 'username', headerName: 'Username', filter: 'agTextColumnFilter' },
          { field: 'email', headerName: 'Email', filter: 'agTextColumnFilter' },
          { field: 'first_name', headerName: 'First Name', filter: 'agTextColumnFilter' },
          { field: 'last_name', headerName: 'Last Name', filter: 'agTextColumnFilter' },
          { field: 'company', headerName: 'Company', filter: 'agTextColumnFilter' },
          { field: 'is_active', headerName: 'Is Active' },
        ];

        if (props.workSiteId) {
          baseColDefs.push({
            field: 'role',
            headerName: 'Role',
            filter: 'agTextColumnFilter',
            valueFormatter: (params) => {
              const roleMapping: { [key: string]: string } = {
                sub_contractor: 'Sub Contractor',
                epc: 'EPC',
                client: 'Client',
                epc_admin: 'EPC Admin',
              };
              return roleMapping[params.value] || params.value;
            },
          });
        }

        baseColDefs.push({
          field: 'actions',
          cellRenderer: ActionButtonsRenderer,
          cellRendererParams: {
            actionsToDisplay: ['edit', 'delete'],
          },
          minWidth: 150,
        });

        setColDefs(baseColDefs);
      })
      .catch((error) => {
        // PopUp
        console.error('Error fetching data:', error);
      });
  }, [props.workSiteId]);

  return (
    <div
      className="ag-theme-quartz" // applying the Data Grid theme
      style={{ height: 300 }} // the Data Grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  );
}
