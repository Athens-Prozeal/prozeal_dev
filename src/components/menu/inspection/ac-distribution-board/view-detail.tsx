'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { config } from '@/config';
import WitnessTable from '@/components/menu/inspection/witnesses/witness-table';

const AcDistributionBoardDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const acDistributionBoardId = searchParams.get('acDistributionBoardId');
  const [data, setData] = useState<any>();
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [approveBtnDisabled, setApproveBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/inspection/ac-distribution-board/${ acDistributionBoardId}/?work_site_id=${workSiteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        setData(response.data);
        for (const action of response.data.actions) {
          if (action.name === 'approve') {
            setApproveUrl(action.url);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [acDistributionBoardId]);

  const checklists = (checklists: any) => {
    return Object.entries(checklists).map(([item, details]: any) => ({
      item: details.verbose_name,
      choice: details.choice,
      remark: details.remark,
    }));
  };

  const handleApprove = async (event: React.FormEvent) => {
    event.preventDefault();
    setApproveBtnDisabled(true);
    try {
      const formData = new FormData();
      formData.append('signature', (event.target as HTMLFormElement).signature.files[0]);

      await axios
        .put(`${config.site.serverURL}${approveUrl}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            alert('Approved successfully');
            window.location.reload();
          }
        });
    } catch (error) {
      setApproveBtnDisabled(false);
      console.error('Error approving:', error);
    }
  };

  const groupedChecklists = data?.checklists ? checklists(data.checklists) : [];

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" flexDirection="column" gap={4}>
      <Paper elevation={2} sx={{ maxWidth: '100%', width: '100%' }}>
        <Grid container mb={2} sx={{ border: '1px solid #999999', minHeight: '130px' }}>
          <Grid item xs={3}>
            <Stack
              direction="column"
              sx={{ border: '1px solid #999999', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography variant="h5">Add Logo here</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="column" height="100%">
              <Box
                sx={{
                  flex: 1,
                  border: '1px solid #999999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Prozeal Green Energy Pvt. Ltd.
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 2,
                  border: '1px solid #999999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  INSTALLATION CHECKLIST FOR AC DISTRIBUTION BOARD
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={3}>
            <Stack direction="column" height="100%">
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  border: '1px solid #999999',
                  alignItems: 'center',
                  fontWeight: 500,
                  p: 1,
                }}
              >
                IMS/FOR/PR/026
              </Stack>
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  border: '1px solid #999999',
                  alignItems: 'center',
                  fontWeight: 500,
                  p: 1,
                }}
              >
                Rev. No.:00
              </Stack>
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  border: '1px solid #999999',
                  alignItems: 'center',
                  fontWeight: 500,
                  p: 1,
                }}
              >
                Rev. Date: 30.09.2023
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: { xs: '14px', sm: '16px' }, marginBottom: 2 }}>
              <strong>Drawing / Specification No:</strong> {data?.drawing_or_specification_no}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: { xs: '14px', sm: '16px' }, marginBottom: 2 }}>
              <strong>Serial No:</strong> {data?.serial_no}
            </Typography>
          </Grid>


          <Grid item xs={12} sx={{ maxWidth: '100%', whiteSpace: 'nowrap', overflowX: 'auto' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Check Points</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Remark</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedChecklists.map((checklistItem, checklistIndex) => (
                    <React.Fragment key={checklistIndex}>
                      <TableRow key={checklistIndex}>
                        <TableCell>{checklistIndex + 1}</TableCell>
                        <TableCell>{checklistItem.item}</TableCell>
                        <TableCell>{checklistItem.choice}</TableCell>
                        <TableCell>{checklistItem.remark}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: { xs: '14px', sm: '16px' }, marginBottom: 2 }}>
              <strong>Comments/Remarks:</strong> {data?.comments_or_remarks}
            </Typography>
          </Grid>

          <Grid item xs={12} marginTop="30px" sx={{ maxWidth: '100%', whiteSpace: 'nowrap', overflowX: 'auto' }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Witness
            </Typography>
            <WitnessTable
              witness_1_date={data?.witness_1_date}
              witness_1_name={data?.witness_1_full_name}
              witness_1_company={data?.witness_1_company}
              witness_1_signature={data?.witness_1_signature}
              witness_2_date={data?.witness_2_date}
              witness_2_name={data?.witness_2_full_name}
              witness_2_company={data?.witness_2_company}
              witness_2_signature={data?.witness_2_signature}
              witness_3_date={data?.witness_3_date}
              witness_3_name={data?.witness_3_full_name}
              witness_3_company={data?.witness_3_company}
              witness_3_signature={data?.witness_3_signature}
            />
          </Grid>
        </Grid>
      </Paper>

      {data?.actions.map((action: any) => {
        if (action.name === 'approve') {
          return (
            <form onSubmit={handleApprove} key={action.name}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: 'image/*',
                  }}
                  type="file"
                  name="signature"
                  label="Signature"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={approveBtnDisabled}
                  sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                >
                  Approve
                </Button>
              </Stack>
            </form>
          );
        }
      })}
    </Box>
  );
};

export default  AcDistributionBoardDetail;
