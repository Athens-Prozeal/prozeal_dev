'use client';

import React, { use, useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import axios from 'axios';

import { SubContractor as SubContractorType } from '@/types/user';
import { config } from '@/config';
import { Form } from '@/components/menu/manpower/form';

export default function Page() {
  const role = localStorage.getItem('role');
  const Url = `${config.site.serverURL}/api/manpower/?work_site_id=${localStorage.getItem('work-site-id')}`;
  const currentDate = new Date();
  const [SubContractors, setSubContractors] = useState<SubContractorType[]>([]);
  let VerificationStatus = 'Not Verified';

  useEffect(() => {
    if (role !== 'sub_contractor') {
      axios
        .get(
          `${config.site.serverURL}/api/auth/sub-contractors/?work_site_id=${localStorage.getItem('work-site-id')}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
          }
        )
        .then((response) => {
          setSubContractors(response.data);
        });
    }

    if (role === 'epc_admin' || role === 'epc') {
      VerificationStatus = 'Verified';
    }
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={5} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h5">Add Manpower</Typography>
          <Form
            Url={Url}
            Method="POST"
            Date={currentDate.toISOString().split('T')[0]}
            VerificationStatus={VerificationStatus}
            SubContractors={SubContractors}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
