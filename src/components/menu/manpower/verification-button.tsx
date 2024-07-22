import { useState } from 'react';
import { Box, Button } from '@mui/material';
import { ICellRendererParams } from 'ag-grid-community';
import axios from 'axios';
import { createTheme } from '@mui/material/styles';

import { config } from '@/config';

interface CustomCellRendererParams extends ICellRendererParams {
  statuses: string[];
}

const verificationButton = (props: CustomCellRendererParams) => {
  const [status, setStatus] = useState(props.data.verification_status);

  const verifyRecord = () => {
    for (const action of props.data.actions) {
      if (action.name === 'update_status') {
        const url = action.url;
        const method = action.method;

        const statuses = action.statuses;
        const currentIndex = statuses.indexOf(status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];

        axios({
          method: method,
          url: `${config.site.serverURL}${url}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
          data: {
            verification_status: newStatus,
          },
        }).then((response) => {
          let newStatus = response.data.verification_status;
          setStatus(newStatus);
        });
      }
    }
  };


  return (
    <Button
      variant="contained"
      size="small"
      style={{ width: '100px', height: '30px' }}
      color={status === 'Verified' ? 'success' : status === 'Not Verified' ? 'error' : status === 'Revise' ? 'secondary' : undefined}
      onClick={verifyRecord}
    >
      {status}
    </Button>
  );
};

export default verificationButton;
