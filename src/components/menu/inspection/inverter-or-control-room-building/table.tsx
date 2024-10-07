import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '@/styles/ag-grid.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { config } from '@/config';
import ActionButtonsRenderer from '@/components/core/ag-grid/action-buttons-renderer';
import { FormControl, FormControlLabel, RadioGroup, Radio, Box } from '@mui/material';

const InverterOrControlRoomBuildingTable = () => {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState<ColDef[]>();
  const gridRef = useRef<AgGridReact>(null);

  const statusOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'initiated', label: 'Initiated' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'action-required', label: 'Require Action' },
  ];

  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'approved');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusParam = statusFilter ? `&status=${statusFilter}` : '';
        const response = await axios.get(
          `${config.site.serverURL}/api/inspection/inverter-or-control-room-building/?work_site_id=${localStorage.getItem('work-site-id')}${statusParam}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setRowData(response.data);

        setColDefs([
          { field: 'date_of_audit', headerName: 'Date Of Audit', filter: 'agDateColumnFilter' },
          { field: 'project_name', headerName: 'Project Name', filter: 'agTextColumnFilter' },
          { field: 'location_or_area', headerName: 'Location/Area', filter: 'agTextColumnFilter' },
          {
            field: 'actions',
            cellRenderer: ActionButtonsRenderer,
            cellRendererParams: {
              actionsToDisplay: ['view', 'delete'],
              router: router,
              viewUrl: `/menu/inspection/room-inverter/view?inverterOrControlBuildingId=`,
            },
            minWidth: 150,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [statusFilter]); // Fetch data whenever statusFilter changes

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);

    router.push(`?status=${selectedStatus}`);
  };

  return (
    <Box>
      <FormControl component="fieldset" fullWidth margin="normal">
        <RadioGroup
          value={statusFilter}
          onChange={handleStatusChange}
          row
          aria-label="status"
          name="status-radio-group"
        >
          {statusOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <div className="ag-theme-quartz" style={{ height: 500, marginTop: '20px' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          rowData={rowData}
          pagination
          rowHeight={60}
        />
      </div>
    </Box>
  );
};

export default InverterOrControlRoomBuildingTable;
