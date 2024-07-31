'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import axios from 'axios';
import { config } from '@/config';
import { WorkSite } from '@/types/worksite';

import { UserTable } from './user-table';

export function Users(): React.JSX.Element {
  const [value, setValue] = useState(0);
  const [workSites, setWorkSites] = useState<WorkSite[]>([])
  const [selectedWorkSiteId, setSelectedWorksiteId] = useState<string>('')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
          setSelectedWorksiteId(response.data[0].id)
        }
      });
  }, []);

  return (
    <Card>
      <CardHeader subheader="Create and update users" title="Users" />
      <Divider />

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
          {workSites.map((workSite)=> (
            <Tab label={workSite.id} key={workSite.id} onClick={(event)=>{
              setSelectedWorksiteId(workSite.id);
            }}/>
          ))}
        </Tabs>
      </Box>

      <CardContent>

        <UserTable workSiteId={selectedWorkSiteId}  />
      </CardContent>
    </Card>
  );
}
