'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
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
import dayjs from 'dayjs';

import { config } from '@/config';

const GeneralPTWDetail = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const permitToWorkId = searchParams.get('permitToWorkId');
  const [data, setData] = useState<any>();
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [rejectUrl, setRejectUrl] = useState<string | null>(null);
  const [closureRequestUrl, setClosureRequestUrl] = useState<string | null>(null);
  const [closeUrl, setCloseUrl] = useState<string | null>(null);
  const [verifyBtnDisabled, setEpcApproveBtnDisabled] = useState<boolean>(false);
  const [approveBtnDisabled, setApproveBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/ptw/general/${permitToWorkId}/?work_site_id=${workSiteId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((response) => {
        setData(response.data);
        for (const action of response.data?.actions) {
          if (action.name === 'verify') {
            setVerifyUrl(action.url);
          }
          if (action.name === 'client_approve') {
            setApproveUrl(action.url);
          }
          if (action.name === 'client_reject') {
            setRejectUrl(action.url);
          }
          if (action.name === 'closure_request') {
            setClosureRequestUrl(action.url);
          }
          if (action.name === 'close') {
            setCloseUrl(action.url);
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [permitToWorkId]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setEpcApproveBtnDisabled(true);

    const formData = new FormData();
    formData.append('signature', (event.target as HTMLFormElement).signature.files[0]);

    if (verifyUrl) {
      axios({
        method: 'put',
        url: `${config.site.serverURL}/api/ptw/general/${permitToWorkId}/verify/?work_site_id=${workSiteId}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
        .then((response) => {
          alert('Permit to work verified successfully');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error verifying permit:', error);
          alert('Error verifying permit');
          setEpcApproveBtnDisabled(false);
        });
    }
  };

  const handleApprove = async (event: React.FormEvent) => {
    event.preventDefault();
    setApproveBtnDisabled(true);

    if (approveUrl) {
      const formData = new FormData();
      formData.append('signature', (event.target as HTMLFormElement).client_signature.files[0]);

      axios({
        method: 'put',
        url: `${config.site.serverURL}${approveUrl}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
        .then((response) => {
          alert('Permit to work approved successfully');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error approving permit:', error);
          alert('Error approving permit');
          setApproveBtnDisabled(false);
        });
    }
  };

  const handleReject = async (event: React.FormEvent) => {
    event.preventDefault();

    if (rejectUrl) {
      const formData = new FormData();
      formData.append('rejected_remark', (event.target as HTMLFormElement).rejected_remark.value);

      axios({
        method: 'put',
        url: `${config.site.serverURL}${rejectUrl}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
        .then((response) => {
          alert('Permit to work rejected successfully');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error rejecting permit:', error);
          alert('Error rejecting permit');
        });
    }
  }

  const handleClosureRequest = async (event: React.FormEvent) => {
    console.log('closureRequestUrl:', closureRequestUrl);
    event.preventDefault();

    if (closureRequestUrl) {
      axios({
        method: 'put',
        url: `${config.site.serverURL}${closureRequestUrl}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
        .then((response) => {
          alert('Closure request sent successfully');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error sending closure request:', error);
          alert('Error sending closure request');
        });
    }
  }

  const handleClose = async (event: React.FormEvent) => {
    event.preventDefault();

    if (closeUrl) {
      axios({
        method: 'put',
        url: `${config.site.serverURL}${closeUrl}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
        .then((response) => {
          alert('Permit to work closed successfully');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error closing permit:', error);
          alert('Error closing permit');
        });
    }
  }

  return (
    <Box>
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

          <Grid item xs={6}>
            <Stack direction="column" height="100%">
              <Box
                sx={{
                  flex: 2,
                  p: 2,
                  border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  PTW - GENERAL
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
                  p: 2,
                  border: '1px solid #ddd',
                  alignItems: 'center',
                  fontWeight: 500,
                }}
              >
                Format No : EHS-FOR-PR-001
              </Stack>
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  p: 2,
                  border: '1px solid #ddd',
                  alignItems: 'center',
                  fontWeight: 500,
                }}
              >
                Rev. No./ Date : 00/02.06.2023
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Typography>
        Valid only when signed by an authorized issuer, delegated by management. This Permit must be issued before
        specified work is started, it must be closed /cancelled immediately after completion of the work or at the end
        of the shift as agreed by parties identified on this permit, File closed / cancelled permits in ChroNological
        order in a file, which will be stored in site/unit. Permit will be issued only in presence of both concerned
        engineer and work supervisor.
      </Typography>

      <Box my={6}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography>
              <b>Issued Date: </b>
                {dayjs(data?.issued_date).format('MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Site: </b>
              {data?.work_site_name}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Section: </b>
              {data?.section}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Permit No: </b>
              {data?.permit_no}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Lock Out No: </b>
              {data?.lock_out_no}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Validity: </b>
                {dayjs(data?.validity).format('MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Location: </b>
              {data?.location}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Work Order No: </b>
              {data?.work_order_no}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography>
              <b>Job Description: </b>
              {data?.job_description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography>
              <b>Issued to (Contractor Firm/Supplier Name): </b> {data?.issued_to}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box my={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Sr. No</b>
                </TableCell>
                <TableCell>
                  <b>Following safety measure taken to carry out work : </b>
                </TableCell>
                <TableCell>
                  <b>Yes</b>
                </TableCell>
                <TableCell>
                  <b>No</b>
                </TableCell>
                <TableCell>
                  <b>NA</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1.</TableCell>
                <TableCell>Tool Box Talk (TBT)</TableCell>
                <TableCell>{data?.tool_box_talk == 'yes' ? '✓' : ''}</TableCell>
                <TableCell>{data?.tool_box_talk == 'no' ? '✓' : ''}</TableCell>
                <TableCell>{data?.tool_box_talk == 'n/a' ? '✓' : ''}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2.</TableCell>
                <TableCell>Underground / overhead cables checked for intervention</TableCell>
                <TableCell>{data?.underground_or_overhead_cables_checked == 'yes' ? '✓' : ''}</TableCell>
                <TableCell>{data?.underground_or_overhead_cables_checked == 'no' ? '✓' : ''}</TableCell>
                <TableCell>{data?.underground_or_overhead_cables_checked == 'n/a' ? '✓' : ''}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <Typography>
          <b> 3. Following PPE's required to be used :</b>
        </Typography>

        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>a) Hand / head / leg Protection</TableCell>
                <TableCell>{data?.ppe_required_to_be_used[0] == 'yes' ? '✓' : ''}</TableCell>

                <TableCell>b) Earth Rod </TableCell>
                <TableCell>{data?.ppe_required_to_be_used[1] == 'yes' ? '✓' : ''}</TableCell>

                <TableCell>c) 33 KV hand gloves </TableCell>
                <TableCell>{data?.ppe_required_to_be_used[2] == 'yes' ? '✓' : ''}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell>d) Hazardous Material </TableCell>
                <TableCell>{data?.ppe_required_to_be_used[3] == 'yes' ? '✓' : ''}</TableCell>

                <TableCell>e) Eye/ Face</TableCell>
                <TableCell>{data?.ppe_required_to_be_used[4] == 'yes' ? '✓' : ''}</TableCell>

                <TableCell>f) Full body harness </TableCell>
                <TableCell>{data?.ppe_required_to_be_used[5] == 'yes' ? '✓' : ''}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box my={3}>
        <Typography>
          <b>4 . Any other work permit issued for same PVSP/ Feeder / Bay / Substation on same date time: </b>{' '}
        </Typography>
        {data?.other_work_permit_issued_same_location_datetime ? (
          <Typography>
            <b>Yes, Permit No: </b> {data?.permit_no}
          </Typography>
        ) : (
          <Typography>No</Typography>
        )}

        <br />
        <Typography>
          <b>5. Any other safety precaution required </b> {data?.any_other_safety_precaution_required}
        </Typography>
      </Box>
      <br />

      {/* Form independent fields */}
      <Box my={3}>
        <Grid container spacing={2} alignItems={'center'}>
          {/* Permit Issued By (sub-contractor)*/}
          <Grid item xs={4}>
            <Typography>
              <b>Permit Issued By (Prozeal): </b>
              {data?.submitted_by_username}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Date/Time: </b>
              {dayjs(data?.submitted_datetime).format('MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Signature: </b>
              <img
                src={data?.submitted_by_signature}
                alt=""
                style={{ maxWidth: '100px', marginLeft: '10px', verticalAlign: 'middle' }}
              />{' '}
            </Typography>
          </Grid>

          {/* Approved by (EPC)*/}
          <Grid item xs={4}>
            <Typography>
              <b>Permit Approved By (Prozeal): </b>
              {data?.verified_by_username}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Date/Time: </b>
              {dayjs(data?.verified_datetime).format('MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Signature: </b>
              <img
                src={data?.verified_by_signature}
                alt=""
                style={{ maxWidth: '100px', marginLeft: '10px', verticalAlign: 'middle' }}
              />
            </Typography>
          </Grid>

          {/* Client Approved */}
          <Grid item xs={4}>
            <Typography>
              <b>Permit Accepted by (User/Contractor): </b>
              {data?.approved_by_username}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Date/Time: </b>
              {dayjs(data?.approved_datetime).format('MMMM D, YYYY h:mm A')}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography>
              <b>Signature: </b>
              <img
                src={data?.approved_by_signature}
                alt=""
                style={{ maxWidth: '100px', marginLeft: '10px', verticalAlign: 'middle' }}
              />
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <br />
      {data?.status === 'client_rejected' && (
        <Box my={3}>
          <Typography variant="h6" color="error">
            Rejected By: {data?.rejected_by_username}
          </Typography>
          <Typography variant="body1" color="error">
            Remark: {data?.rejected_remark}
          </Typography>
        </Box>
      )}

      {data?.closure_requested && (
        <Box my={3}>
          <Typography >
            Closure Requested By: {data?.closure_requested_by_username} <br />
            Closure Requested Date: {dayjs(data?.closure_requested_at).format('MMMM D, YYYY h:mm A')}
          </Typography>
        </Box>
      )}

      {data?.status === 'closed' && (
        <Box my={3}>
          <Typography>
            Closed By: {data?.closure_accepted_by_username} <br />
            Closed Date: {dayjs(data?.closure_accepted_at).format('MMMM D, YYYY h:mm A')}
          </Typography>
        </Box>
      )}

      {data?.actions.map((action: any, index: number) => {
        const isVerify = action.name === 'verify';
        const isClientApprove = action.name === 'client_approve';
        const isClientReject = action.name === 'client_reject';
        const isClosureRequest = action.name === 'closure_request';
        const isClose = action.name === 'close';

        return (
          <div key={index} style={{ marginTop: 15 }}>
            {isVerify && (
              <form onSubmit={handleVerify}>
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
                    color="success"
                    type="submit"
                    disabled={verifyBtnDisabled}
                    sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                  >
                    Verify
                  </Button>
                </Stack>
              </form>
            )}

            {isClientApprove && (
              <form onSubmit={handleApprove}>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                  <TextField
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      accept: 'image/*',
                    }}
                    type="file"
                    name="client_signature"
                    label="Signature"
                    variant="outlined"
                  />

                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={approveBtnDisabled}
                    sx={{ maxWidth: { xs: '100%', sm: 250 } }}
                  >
                    Approve
                  </Button>
                </Stack>
              </form>
            )}

            {isClientReject && (
              <>
                <Divider>
                  <Chip label="Or" size="small" />
                </Divider>
                <form onSubmit={handleReject}>
                  <Stack spacing={2} marginTop={3} direction={{ xs: 'column', sm: 'row' }}>
                    <TextField
                      required
                      name="rejected_remark"
                      label="Reason/Remark"
                      variant="outlined"
                      fullWidth
                      sx={{ maxWidth: { xs: '100%', sm: 400 } }}
                    />
                    <Button variant="contained" color="error" type="submit" sx={{ maxWidth: { xs: '100%', sm: 250 } }}>
                      Reject
                    </Button>
                  </Stack>
                </form>
              </>
            )}

            {isClosureRequest && (
              <form onSubmit={handleClosureRequest}>
                <Button variant="contained" color="primary" type="submit">
                  Request Closure
                </Button>
              </form>
            )}

            {isClose && (
              <form onSubmit={handleClose}>
                <Button variant="contained" color="primary" type="submit">
                  Close
                </Button>
              </form>
            )}
          </div>
        );
      })}
    </Box>
  );
};

export default GeneralPTWDetail;
