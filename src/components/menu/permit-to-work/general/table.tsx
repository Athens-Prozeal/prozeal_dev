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

interface PermitToWorkProps {}

export interface PermitToWorkHandles {
  triggerClick: () => void;
}

const PermitToWorkTable = forwardRef<PermitToWorkHandles, PermitToWorkProps>((props, ref) => {
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
          `${config.site.serverURL}/api/permit-to-work/general/?work_site_id=${localStorage.getItem('work-site-id')}${statusParam}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        setRowData(response.data);

        setColDefs([
          { field: 'issue_date', headerName: 'Issue Date', filter: 'agDateColumnFilter' },
          { field: 'permit_no', headerName: 'Permit No', filter: 'agTextColumnFilter' },
          { field: 'submitted_by_username', headerName: 'Submitted by', filter: 'agTextColumnFilter' },
          { field: 'status', headerName: 'Status', filter: 'agTextColumnFilter' },
          { field: 'validity', headerName: 'Validity', filter: 'agTextColumnFilter' },
          { field: 'section', headerName: 'Section', filter: 'agTextColumnFilter' },
          { field: 'lock_out_no', headerName: 'Lock Out No', filter: 'agTextColumnFilter' },
          { field: 'location', headerName: 'Location', filter: 'agTextColumnFilter' },
          { field: 'work_order_no', headerName: 'Work Order No', filter: 'agTextColumnFilter' },
          { field: 'issued_to', headerName: 'Issued To', filter: 'agTextColumnFilter' },

          // {
          //   field: 'actions',
          //   cellRenderer: ActionButtonsRenderer,
          //   cellRendererParams: {
          //     actionsToDisplay: ['view', 'edit', 'delete'],
          //     viewUrl: `/menu/permit-to-work/general/view?PermitToWorkId=`,
          //     router: router,
          //   },
          //   minWidth: 250,
          // },
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

  const exportPermitToWork = () => {
    const params = {
      columnKeys: ['issue_date',],
    };

    if (gridRef.current?.api) {
      gridRef.current.api.exportDataAsCsv(params);
    }
  };

  useImperativeHandle(ref, () => ({
    triggerClick: exportPermitToWork,
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

export default PermitToWorkTable;
