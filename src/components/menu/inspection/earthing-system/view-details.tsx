import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Paper,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { config } from '@/config';
import WitnessTable from '@/components/menu/inspection/witnesses/witness-table';

const ViewDetails = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const earthingSystemId = searchParams.get('earthingSystemId');
  const [data, setData] = useState<any>();
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [approveBtnDisabled, setApproveBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/inspection/earthing-system/${earthingSystemId}/?work_site_id=${workSiteId}`, {
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
  }, [earthingSystemId]);

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


  return (
    <>
    <Container sx={{ border: '1px solid #ddd', borderRadius: '8px' }}>
      <Box>
        <Grid container mb={2} sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', minHeight: '130px' }}>
          <Grid item xs={3}>
            <Stack
              direction="column"
              sx={{ p: 2, border: '1px solid #ddd', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography variant="h5">Add Logo here</Typography>
            </Stack>
          </Grid>

          <Grid item xs={9}>
            <Grid xs={12}>
              <Typography
                variant="h6"
                sx={{
                  border: '1px solid #ddd',
                  alignItems: 'center',
                  fontWeight: 700,
                  alignSelf: 'center',
                  padding: '20px',
                }}
              >
                {' '}
                PROZEAL GREEN ENERGY PVT LTD{' '}
              </Typography>
            </Grid>
            <Grid container>
              <Grid
                sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 700, padding: '20px' }}
                item
                xs={3}
              >
                <Typography variant="h6">
                  <b>Document Name : </b>{' '}
                </Typography>
              </Grid>
              <Grid
                sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 700, padding: '20px' }}
                item
                xs={9}
              >
                <Typography variant="h6">Precommissioning Checklist</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">
                    <b>Format No: </b>
                  </Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">
                    <b>Issue No: </b>
                  </Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">
                    <b>Issue Date: </b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">IMS/FOR/PR/079</Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">01</Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">18-01-2024 </Typography>
                </Grid>
              </Grid>

              <Grid item xs={3}>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">
                    <b>Page No: </b>
                  </Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">
                    <b>Revision No: </b>
                  </Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">
                    <b>Revision Date: </b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">01</Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">00</Typography>
                </Grid>
                <Grid sx={{ border: '1px solid #ddd', alignItems: 'center', fontWeight: 400, padding: '10px' }}>
                  <Typography variant="body1">NA</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Grid marginTop={5} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5">
          <b>EARTHING SYSTEM</b>
        </Typography>
      </Grid>

      <Grid marginLeft={5} marginTop={5} container>
        <Grid item width={150}>
          <Typography>
            <b>Name of Client : </b>
          </Typography>
          <Typography>
            <b>Location</b>
          </Typography>
          <Typography>
            <b>Date of Test</b>
          </Typography>
        </Grid>

        <Grid item>
          <Typography>{data?.name_of_client} </Typography>
          <Typography>{data?.location}</Typography>
          <Typography>{data?.date_of_test}</Typography>
        </Grid>
      </Grid>

      <Typography marginLeft={5} marginTop={8} variant="h6">
        <b>Earth tester details :</b>
      </Typography>
      <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Grid marginLeft={5} marginTop={5} container>
          <Grid item width={80}>
            <Typography>
              <b>Make : </b>
            </Typography>
            <Typography>
              <b>Sl. No. </b>
            </Typography>
          </Grid>

          <Grid item>
            <Typography>{data?.earth_tester_details.make} </Typography>
            <Typography>{data?.earth_tester_details.sl_no}</Typography>
          </Grid>
        </Grid>
        <Grid marginTop={5} container>
          <Grid item width={110}>
            <Typography>
              <b>Range :</b>{' '}
            </Typography>
            <Typography>
              <b>Calib details : </b>
            </Typography>
          </Grid>

          <Grid item>
            <Typography>{data?.earth_tester_details.range} </Typography>
            <Typography>{data?.earth_tester_details.calib_details}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Box marginTop={10}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: '150px', border: '1px solid #ddd', background: '#E6E6E6' }}>
                  <b>Earth pit.No </b>
                </TableCell>
                <TableCell sx={{ minWidth: '150px', border: '1px solid #ddd', background: '#E6E6E6' }}>
                  <b>EP Connection with Grid</b>
                </TableCell>
                <TableCell sx={{ minWidth: '150px', border: '1px solid #ddd', background: '#E6E6E6' }} align="center">
                  <b>EP Connection without Grid</b>
                </TableCell>
                <TableCell sx={{ minWidth: '200px', border: '1px solid #ddd', background: '#E6E6E6' }} align="center">
                  <b>Earth Pit Cover</b>
                </TableCell>
                <TableCell sx={{ minWidth: '300px', border: '1px solid #ddd', background: '#E6E6E6' }}>
                  <b>Remarks</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ minWidth: '150px', border: '1px solid #ddd', alignSelf: 'center' }}>
                    EP-{index + 1}
                  </TableCell>
                  <TableCell sx={{ minWidth: '150px', border: '1px solid #ddd' }}>
                    {data?.earth_tester_details?.earth_details[index].ep_connection_with_grid}
                  </TableCell>
                  <TableCell sx={{ minWidth: '150px', border: '1px solid #ddd' }} width={10}>
                    {data?.earth_tester_details.earth_details[index].ep_connection_without_grid}
                  </TableCell>
                  <TableCell sx={{ minWidth: '200px', border: '1px solid #ddd' }} width={10}>
                    {data?.earth_tester_details.earth_details[index].earth_pit_cover}
                  </TableCell>
                  <TableCell sx={{ minWidth: '300px', border: '1px solid #ddd' }}>
                    {data?.earth_tester_details.earth_details[index].remarks}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography marginTop="50px" variant="h5">
          <b>Observation Or Comments :</b>{' '}
        </Typography>
        <Typography>{data?.observation_or_comments == 'undefined' ? '' : data?.observation_or_comments}</Typography>
      </Box>

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
    </Container>
    <br />
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
    </>
  );
};

export default ViewDetails;
