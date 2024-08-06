'use client';

import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';

import { User } from '@/types/user';
import { WorkSiteRole } from '@/types/worksite';
import { authClient } from '@/lib/auth/client';

export function AccountDetailsForm(): React.JSX.Element {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await authClient.getUser();
      setUser(data as User);
    };
    fetchUser();
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="The information can only be updated by admin " title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput value={user?.firstName || ''} label="First name" name="firstName" disabled />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput value={user?.lastName || ''} label="Last name" name="lastName" disabled />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel shrink>Email address</InputLabel>
                <OutlinedInput value={user?.email || ''} label="Email address" name="email" disabled />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel >Company</InputLabel>
                <OutlinedInput value={user?.company || ''} label="Company" name="company" disabled />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <TableContainer component={Paper} variant="outlined">
                <Table aria-label="demo table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Work site</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user?.workSiteRoles?.map((workSiteRole: WorkSiteRole) => (
                      <TableRow key={workSiteRole.id}>
                        <TableCell>{workSiteRole.name}</TableCell>
                        <TableCell>{workSiteRole.display_role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" disabled>Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}
