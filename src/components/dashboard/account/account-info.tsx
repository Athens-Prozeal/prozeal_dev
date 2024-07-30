'use client';

import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await authClient.getUser();
      setUser(data as User);
    };

    fetchUser();
  }, []);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user?.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.username || 'Loading...'} </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.email || 'Loading...'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.company}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text" disabled>
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
