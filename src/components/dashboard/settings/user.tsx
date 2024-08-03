'use client';

import { useEffect, useState } from 'react';
import RouterLink from 'next/link'; // Use this for layout to not reload the page

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios from 'axios';

import { WorkSite } from '@/types/worksite';
import { config } from '@/config';
import { UserForm } from '@/components/dashboard/settings/add-user-form';

import { UserTable } from './user-table';

export function Users(): React.JSX.Element {
  const [value, setValue] = useState(0);
  const [workSites, setWorkSites] = useState<WorkSite[]>([]);
  const [selectedWorkSiteId, setSelectedWorksiteId] = useState<string>('');
  const [showUserForm, setShowUserForm] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      setSelectedWorksiteId('');
    }
  };

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/auth/work-sites/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setWorkSites(response.data);
        }
      });
  }, []);

  const handleAddClick = () => {
    setShowUserForm(true);
  };

  const handleViewTableClick = () => {
    setShowUserForm(false);
  };

  return (
    <Card>
      <Stack direction="row" alignItems={'center'} spacing={3} justifyContent={'space-between'}>
        <CardHeader subheader="View and Create users" title="Users" />

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {showUserForm ? (
            <Button onClick={handleViewTableClick} variant="outlined">
              View Table
            </Button>
          ) : (
            <Button
              onClick={handleAddClick}
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained" // Keep the contained variant for primary action
            >
              Add
            </Button>
          )}
        </CardActions>
      </Stack>
      <Divider />

      {!showUserForm && (
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            aria-label="visible arrows tabs example"
          >
            <Tab label={'All'} key={'all'} />
            {workSites.map((workSite) => (
              <Tab
                label={workSite.id}
                key={workSite.id}
                onClick={() => {
                  setSelectedWorksiteId(workSite.id);
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}

      <CardContent>
        {showUserForm ? <UserForm workSiteId={selectedWorkSiteId} /> : <UserTable workSiteId={selectedWorkSiteId} />}
      </CardContent>
    </Card>
  );
}
