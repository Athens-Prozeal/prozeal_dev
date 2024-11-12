'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import axios from 'axios';

import { config } from '@/config';
import { PopUp } from '@/components/core/alert';

const UpdatePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'error' | 'success'>('success');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertKey, setAlertKey] = useState(0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setAlertSeverity('error');
      setAlertMessage('Passwords do not match');
      setAlertOpen(true);
      setAlertKey((prev) => prev + 1);
      return;
    }

    if (oldPassword === newPassword) {
      setAlertSeverity('error');
      setAlertMessage('Old password and new password cannot be the same');
      setAlertOpen(true);
      setAlertKey((prev) => prev + 1);
      return
    }

    try {
      const token = localStorage.getItem('access-token');
      const response = await axios.post(
        `${config.site.serverURL}/api/auth/update-password/`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setBtnDisabled(true);
        setAlertSeverity('success');
        setAlertMessage('Password updated successfully');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setAlertSeverity('error');
      setAlertMessage((error as any)?.response?.data.detail[0] || 'An error occurred'); // display one error message at a time
    } finally {
      setAlertKey((prev) => prev + 1);
      setAlertOpen(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Old Password</InputLabel>
              <OutlinedInput
                required
                label="Old Password"
                name="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>New Password</InputLabel>
              <OutlinedInput
                required
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm New Password</InputLabel>
              <OutlinedInput
                required
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={btnDisabled}>
            Update
          </Button>
        </CardActions>
      </Card>

      <PopUp key={alertKey} open={alertOpen} alertSeverity={alertSeverity} alertMessage={alertMessage} />
    </form>
  );
};

export default UpdatePasswordForm;
