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

const ExcavationDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const workSiteId = localStorage.getItem('work-site-id');
  const excavationId = searchParams.get('excavationId');
  const [data, setData] = useState<any>();
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [approveBtnDisabled, setApproveBtnDisabled] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/inspection/excavation/${excavationId}/?work_site_id=${workSiteId}`, {
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
  }, [excavationId]);

  const groupChecklists = (checklists: any) => {
    return Object.entries(checklists).map(([category, items]) => ({
      category: category.replace(/_/g, ' ').toUpperCase(), // Transform category name for readability
      items: Object.entries(items as { [key: string]: any }).map(([item, details]: any) => ({
        item: item.replace(/_/g, ' '), // Replace underscores with spaces for better readability
        choice: details.choice,
        remark: details.remark,
      })),
    }));
  };

  const handleApprove = async (event: React.FormEvent) => {
    event.preventDefault();
    setApproveBtnDisabled(true);
    try {
      const formData = new FormData();
      formData.append('signature', (event.target as HTMLFormElement).signature.files[0]); // Replace 'signature' with the name of the file input field in your form

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
      console.error('Error approving:', error);
    }
  };

  const groupedChecklists = data?.checklists ? groupChecklists(data.checklists) : [];

  return (
    <Box display="flex" justifyContent="center" minHeight="100vh" flexDirection="column" gap={4}>
      <Paper elevation={2} style={{ padding: '32px', maxWidth: '1200px', width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '24px' }}>
          {data?.project_name}
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '16px', marginBottom: '16px' }}>
              <strong>Date Of Checking:</strong> {data?.date_of_checking}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '16px', marginBottom: '16px' }}>
              <strong>Project Name:</strong> {data?.project_name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '16px', marginBottom: '16px' }}>
              <strong>Description:</strong> {data?.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '16px', marginBottom: '16px' }}>
              <strong>Ref Drawing Number:</strong> {data?.ref_drawing_no}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontSize: '16px', marginBottom: '16px' }}>
              <strong>Checked By:</strong> {data?.checked_by_username}
            </Typography>
          </Grid>
          <br /> <br /> <br />
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Sr. N</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Checklist Item</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Choice</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Remark</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedChecklists.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                      {/* Category Name Row */}
                      <TableRow>
                        <TableCell colSpan={4} style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                          {group.category}
                        </TableCell>
                      </TableRow>
                      {/* Checklist Items */}
                      {group.items.map((checklistItem, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell>{itemIndex + 1}</TableCell>
                          <TableCell>{checklistItem.item}</TableCell>
                          <TableCell>{checklistItem.choice}</TableCell>
                          <TableCell>{checklistItem.remark}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <br /> <br /> <br />
          <Grid item xs={12} marginTop={'50px'}>
            <Typography variant="h5" style={{ marginBottom: '12px' }}>
              Witness
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>#</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Company </strong>
                    </TableCell>
                    <TableCell>
                      <strong>Signature</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={1}>
                    <TableCell>{1}</TableCell>
                    <TableCell>{data?.witness_1_date}</TableCell>
                    <TableCell>{data?.witness_1_username}</TableCell>
                    <TableCell>{data?.witness_1_company}</TableCell>
                    <TableCell>
                      <img src={data?.witness_1_signature} alt="" />
                    </TableCell>
                  </TableRow>
                  <TableRow key={2}>
                    <TableCell>{2}</TableCell>
                    <TableCell>{data?.witness_2_date}</TableCell>
                    <TableCell>{data?.witness_2_username}</TableCell>
                    <TableCell>{data?.witness_2_company}</TableCell>
                    <TableCell>
                      <img src={data?.witness_2_signature} alt="" />
                    </TableCell>
                  </TableRow>
                  <TableRow key={3}>
                    <TableCell>{3}</TableCell>
                    <TableCell>{data?.witness_3_date}</TableCell>
                    <TableCell>{data?.witness_3_username}</TableCell>
                    <TableCell>{data?.witness_3_company}</TableCell>
                    <TableCell>
                      <img src={data?.witness_3_signature} alt="" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>

      {data?.actions.map((action: any) => {
        if (action.name === 'approve') {
          return (
            <form onSubmit={handleApprove}>
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
                  style={{ maxWidth: 200 }}
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

export default ExcavationDetail;
