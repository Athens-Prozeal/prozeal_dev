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

const RemoteTerminalUnitTable = () => {
  const authToken = `Bearer ${localStorage.getItem('access-token')}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState<ColDef[]>();
  const gridRef = useRef<AgGridReact>(null);

  // Available status filter options
  const statusOptions = [
    { value: 'approved', label: 'Approved' },
    { value: 'initiated', label: 'Initiated' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'action-required', label: 'Require Action' },
  ];

  // Get initial filter value from URL or default to an empty string
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'approved');

  // Fetch data based on the selected status filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusParam = statusFilter ? `&status=${statusFilter}` : '';
        const response = await axios.get(
          `${config.site.serverURL}/api/inspection/remote-terminal-unit/?work_site_id=${localStorage.getItem('work-site-id')}${statusParam}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setRowData(response.data);

        setColDefs([
          { field: 'drawing_or_specification_no', headerName: 'Drawing/Specification No', filter: 'agTextColumnFilter' },
          { field: 'serial_no', headerName: 'Serial. No', filter: 'agTextColumnFilter' },
          {
            field: 'actions',
            cellRenderer: ActionButtonsRenderer,
            cellRendererParams: {
              actionsToDisplay: ['view', 'delete'],
              router: router,
              viewUrl: `/menu/inspection/remote-terminal-unit/view?remoteTerminalUnitId=`,
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

  // Handle status filter change
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);

    // Update the URL parameters with the selected filter
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

export default RemoteTerminalUnitTable;
