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
  const router = useRouter();
  const [colDefs, setColDefs] = React.useState<ColDef[]>();
  const [rowData, setRowData] = React.useState([]);

  const gridRef = useRef<AgGridReact>(null);

  React.useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/worker/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        setRowData(response.data);

        setColDefs([
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
          { field: 'blood_group', headerName: 'Blood Group', filter: 'agTextColumnFilter' },
          {
            field: 'mobile_number',
            headerName: 'Mobile Number',
            hide: true,
            valueGetter: (params) => {
              return `'${params.data.mobile_number}`; // Prepend a single quote to treat it as text
            },
            suppressColumnsToolPanel: true,
          },
          {
            field: 'emergency_contact_number',
            headerName: 'Emergency Contact Number',
            filter: 'agTextColumnFilter',
            hide: true,
            valueGetter: (params) => {
              return `'${params.data.emergency_contact_number}`; // Prepend a single quote to treat it as text
            },
            suppressColumnsToolPanel: true,
          },
          {
            field: 'identity_marks',
            headerName: 'Identity Marks',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'address',
            headerName: 'Address',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'city',
            headerName: 'City',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'state',
            headerName: 'State',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'country',
            headerName: 'Country',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'pincode',
            headerName: 'Pincode',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'profile_pic',
            headerName: 'Photo',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'medical_fitness',
            headerName: 'Medical Fitness',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'aadhar',
            headerName: 'Aadhar',
            hide: true,
            suppressColumnsToolPanel: true,
          },
          {
            field: 'actions',
            cellRenderer: ActionButtonsRenderer,
            cellRendererParams: {
              actionsToDisplay: ['view', 'edit', 'delete'],
              router: router,
              viewUrl: `/menu/worker/view?workerId=`,
              editUrl: `/menu/worker/edit?workerId=`,
            },
            minWidth: 250,
          },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const exportWorker = () => {
    const params = {
      columnKeys: ['name', 'induction_date', 'father_name', 'created_under', 'date_of_birth', 'gender', 'designation', 'blood_group', 'mobile_number', 'emergency_contact_number', 'identity_marks', 'address', 'city', 'state', 'country', 'pincode', 'medical_fitness', 'aadhar', 'profile_pic'],
    };

    if (gridRef.current?.api) {
      // if the grid is available
      gridRef.current.api.exportDataAsCsv(params);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerClick: exportWorker,
  }));

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} pagination />
    </div>
  );
});

export default WorkerTable;
