import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Stack, TextField } from '@mui/material';
import { Plus as Add } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as Remove } from '@phosphor-icons/react/dist/ssr/Trash';
import axios from 'axios';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';

import { config } from '@/config';

const userSchema = z.object({
  username: z.string().max(150, 'Username must be at most 150 characters'),
  firstName: z.string().max(150, 'First name must be at most 150 characters'),
  lastName: z.string().max(150, 'Last name must be at most 150 characters').optional(),
  email: z.string().email('Invalid email address').max(150, 'Email must be at most 150 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  isActive: z.boolean(),
  company: z.string().max(150, 'Company name must be at most 150 characters'),
  workSiteRoles: z
    .array(
      z.object({
        id: z.string().nonempty('Work site is required'),
        role: z.enum(['sub_contractor', 'epc', 'client']),
      })
    )
    .optional(),
});

type UserSchemaType = z.infer<typeof userSchema>;
type WorkSite = { id: string; name: string };

export function UserForm(props: { workSiteId: string }): React.JSX.Element {
  const [workSites, setWorkSites] = useState<WorkSite[]>([]);
  const [btnDisable, setBtnDisable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkSites = async () => {
      try {
        const response = await axios.get(`${config.site.serverURL}/api/auth/work-sites/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        setWorkSites(response.data);
      } catch (error) {
        console.error('Failed to fetch work sites:', error);
      }
    };

    fetchWorkSites();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    setError,
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      isActive: true,
      company: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workSiteRoles',
  });

  const onSubmit = async (data: UserSchemaType) => {
    setBtnDisable(true);
    axios
      .post(
        `${config.site.serverURL}/api/auth/user/`,
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          company: data.company,
          is_active: data.isActive,
          username: data.username,
          password: data.password,
          work_site_roles: data.workSiteRoles,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          alert('User added successfully!');
          // reload
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const responseErrors = error.response.data;
          for (const key in responseErrors) {
            setError(key as keyof UserSchemaType, {
              type: 'server',
              message: responseErrors[key][0],
            });
          }
          if (responseErrors.detail){
            alert(responseErrors.detail)
          }
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
        setBtnDisable(false);
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {/* User Details Fields */}
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="username"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Username"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="First name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="lastName"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Last name"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Email"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  type="password"
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Set Password"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="company"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                  fullWidth
                  label="Company"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="isActive"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControlLabel
                  control={<Checkbox checked={value} onChange={onChange} color="primary" />}
                  label="Is Active"
                />
              )}
            />
          </Grid>
        </Grid>

        <Stack spacing={2} marginTop={3}>
          {fields.map((field, index) => (
            <Stack spacing={2} direction={'row'} sx={{ width: '100%' }} key={field.id}>
              <Stack sx={{ width: '200px' }}>
                <Controller
                  name={`workSiteRoles.${index}.id`}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      select
                      label="Work Site"
                      value={value}
                      onChange={onChange}
                      fullWidth
                      helperText={error ? error.message : null}
                      error={!!error}
                    >
                      {workSites.map((workSite) => (
                        <MenuItem key={workSite.id} value={workSite.id}>
                          {workSite.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>

              <Stack sx={{ width: '200px' }}>
                <Controller
                  name={`workSiteRoles.${index}.role`}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      required
                      select
                      label="Role"
                      value={value}
                      onChange={onChange}
                      fullWidth
                      helperText={error ? error.message : null}
                      error={!!error}
                    >
                      <MenuItem value={'sub_contractor'}>Sub Contractor</MenuItem>
                      <MenuItem value={'epc'}>EPC</MenuItem>
                      <MenuItem value={'client'}>Client</MenuItem>
                    </TextField>
                  )}
                />
              </Stack>

              <Stack direction={'row'} alignItems="center">
                <IconButton aria-label="delete" onClick={() => remove(index)}>
                  <Remove />
                </IconButton>
              </Stack>
            </Stack>
          ))}

          <Stack sx={{ width: '150px' }}>
            <Button onClick={() => append({ id: '', role: 'epc' })} color="primary">
              <Add /> Add Role
            </Button>
          </Stack>
        </Stack>
        <Stack sx={{ width: '100px' }} marginTop={2}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
