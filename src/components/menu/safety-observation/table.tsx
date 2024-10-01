import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
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
  const searchParams = useSearchParams();
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState<ColDef[]>();

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'corrective-action-required', label: 'Corrective Action Required' },
    { value: 'verification-required', label: 'Verification Required' },
  ];
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');

  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusParam = statusFilter ? `&status=${statusFilter}` : '';
        const response = await axios.get(
          `${config.site.serverURL}/api/safety-observation/?work_site_id=${localStorage.getItem('work-site-id')}${statusParam}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        setRowData(response.data);

        setColDefs([
          { field: 'date', headerName: 'Date', filter: 'agDateColumnFilter' },
          { field: 'time', headerName: 'Time', filter: 'agTextColumnFilter' },
          { field: 'work_location', headerName: 'Work Location', filter: 'agNumberColumnFilter' },
          { field: 'department_name', headerName: 'Department', filter: 'agTextColumnFilter' },
          { field: 'sub_contractor_full_name', headerName: 'Sub Contractor', filter: 'agTextColumnFilter' },
          { field: 'safety_observation_found', headerName: 'Safety Observation Found', filter: 'agTextColumnFilter' },
          { field: 'type_of_observation', headerName: 'Type Of Observation', filter: 'agTextColumnFilter' },
          { field: 'classification', headerName: 'Classification', filter: 'agTextColumnFilter' },
          { field: 'risk_rated', headerName: 'Risk Rated', filter: 'agTextColumnFilter' },
          { field: 'reported_by_full_name', headerName: 'Reported By', filter: 'agTextColumnFilter' },
          { field: 'corrective_action_assigned_to_full_name', headerName: 'Assigned To', filter: 'agTextColumnFilter' },

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [statusFilter]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);

    // Update the URL parameters with the selected filter
    router.push(`?status=${selectedStatus}`);
  };

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
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      </FormControl>

      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact ref={gridRef} columnDefs={colDefs} rowHeight={60} rowData={rowData} pagination />
      </div>
    </Box>
  );
});

export default SafetyObservationTable;
