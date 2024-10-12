import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
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

const ViewDetails = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const htCablePreComId = searchParams.get('htCablePreComId');
  const [data, setData] = useState<any>();
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [approveBtnDisabled, setApproveBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/inspection/ht-cable-pre-com/${htCablePreComId}/?work_site_id=${workSiteId}`, {
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
  }, [htCablePreComId]);

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
    <Container sx={{ border: '1px solid #ddd', borderRadius: '8px',minWidth:"860px" }}>
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
                <Typography variant="h6">Pre-Commissioning Checklist</Typography>
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
                  <Typography variant="body1">IMS/FOR/PR/080</Typography>
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
      <Box margin={5}>
        <Grid marginTop={5} sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5">
            <b>HT CABLE</b>
          </Typography>
        </Grid>

        <Grid marginTop={5} container>
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
            <Typography>
              <b>Make</b>
            </Typography>
            <Typography>
              <b>Cable Rating</b>
            </Typography>
          </Grid>

          <Grid item>
            <Typography>{data?.name_of_client} </Typography>
            <Typography>{data?.location}</Typography>
            <Typography>{data?.date_of_test}</Typography>
            <Typography>{data?.make}</Typography>
            <Typography>{data?.cable_rating}</Typography>
          </Grid>
        </Grid>

        <Typography marginTop={8} variant="h6">
          <b>1. INSULATION RESISTANCE TEST :</b>
        </Typography>
        <Grid marginTop={5}></Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Applied Voltage</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>R_E</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Y_E</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>B_E</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>R_Y</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Y_B</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>B_R</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>BEFORE HV TEST</TableCell>
                <TableCell>{data?.data?.insulation_resistance.before_hv_test.R_E}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.before_hv_test.Y_E}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.before_hv_test.B_E}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.before_hv_test.R_Y}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.before_hv_test.Y_B}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.before_hv_test.B_R}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>AFTER HV TEST</TableCell>
                <TableCell>{data?.data?.insulation_resistance.after_hv_test.R_E}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.after_hv_test.Y_E}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.after_hv_test.B_E}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.after_hv_test.R_Y}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.after_hv_test.Y_B}</TableCell>
                <TableCell>{data?.data?.insulation_resistance.after_hv_test.B_R}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography marginTop={3}>
          <b>Note: Test certificate will be submitted at the time of testing</b>
        </Typography>
        <Typography marginTop={3}>
          <b>Cables found healty : </b> {data?.data?.insulation_resistance.found_healthy}
        </Typography>
        <Typography marginTop={3}>
          <b>General Inspection & Erection completion checked : </b>{' '}
          {data?.data?.insulation_resistance.general_inspection}
        </Typography>

        <Typography marginTop={3}>Remarks : {data?.data?.insulation_resistance.remarks}</Typography>

        <Typography marginTop={8} variant="h6">
          <b>2. HI-POT TEST </b>
        </Typography>
        <Grid marginTop={5}></Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Phase</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Injected Voltage</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Leakage Current</TableCell>
                <TableCell sx={{ backgroundColor: '#E6E6E6', fontWeight: 'bold' }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>R_PH</TableCell>
                <TableCell>{data?.data?.hi_pot_test.R_PH.injected_voltage}</TableCell>
                <TableCell>{data?.data?.hi_pot_test.R_PH.leakage_current}</TableCell>
                <TableCell>{data?.data?.hi_pot_test.R_PH.time}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Y_PH</TableCell>
                <TableCell>{data?.data?.hi_pot_test.Y_PH.injected_voltage}</TableCell>
                <TableCell>{data?.data?.hi_pot_test.Y_PH.leakage_current}</TableCell>
                <TableCell>{data?.data?.hi_pot_test.Y_PH.time}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>B_PH</TableCell>
                <TableCell>{data?.data?.hi_pot_test.B_PH.injected_voltage}</TableCell>
                <TableCell>{data?.data?.hi_pot_test.B_PH.leakage_current}</TableCell>
                <TableCell>{data?.data?.hi_pot_test.B_PH.time}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography marginTop={3}>
          <b>The cable withstood the test : </b> {data?.data?.hi_pot_test.withstood_the_test}
        </Typography>
        <Typography marginTop={3}>
          <b>Cables found healthy : </b> {data?.data?.hi_pot_test.cable_found_healthy}
        </Typography>
      </Box>

      <Grid item xs={12} marginTop="30px" sx={{ maxWidth: '100%', whiteSpace: 'nowrap' }}>
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
