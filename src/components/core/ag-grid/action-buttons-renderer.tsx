import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { Eye } from '@phosphor-icons/react/dist/ssr/Eye';
import { Pen } from '@phosphor-icons/react/dist/ssr/Pen';
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash';
import { ICellRendererParams } from 'ag-grid-community';
import { set } from 'react-hook-form';
import { config } from '@/config';

interface Action {
  name: string;
  method: string;
  url: string;
}

interface CustomCellRendererParams extends ICellRendererParams {
  actions: string[];
}

const ActionButtonsRenderer = (params: CustomCellRendererParams) => {
  const [actions, setActions] = useState<Action[]>([]);
  useEffect(() => {
    setActions(params.data.actions);
  }, []);

  const getIcon = (actionName: string) => {
    switch (actionName) {
      case 'view':
        return <Eye />;
      case 'edit':
        return <Pen />;
      case 'delete':
        return <Trash />;
      default:
        return null;
    }
  };

  const deleteRecord = (url: string) => {
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access-token')}`, 
      }
    })
      .then((response) => {
        if (response.status === 204) {
          params.api.applyTransaction({ remove: [params.data] });
        }else{
          window.alert('Error deleting record');
        }
      })
      .catch((error) => {
        window.alert('Error deleting record');
      });
  };

  return (
    <Box display="flex" justifyContent="flex-end" gap="5px" margin="5px 0 5px 5px">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outlined"
          className="btn-simple action-btn"
          color={action.name === 'delete' ? 'error' : undefined}
          onClick={() => {
            if (action.name === 'delete') {
              deleteRecord(`${config.site.serverURL}${action.url}`);
            }
            console.log(`Action: ${action.name}, URL: ${action.url}`);
          }}
        >
          {getIcon(action.name)}
        </Button>
      ))}
    </Box>
  );
};

export default ActionButtonsRenderer;
