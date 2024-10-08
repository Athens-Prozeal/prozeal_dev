'use client';

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Stack
} from "@mui/material";

const CalibrationTable = () => {

    const data = {
        site_name: "adfasdf",
        equipment_make: "adsfsadf",
        serial_no: "afadsf",
        calibration_date: "2024-09-25",
        client_sign: "asdsfasf",
        project_engineer_sign: "asfsaf",
        qhse_engineer_sign: "sfasf",
        inverter: [
          {
            string_inverter_no: "INV001",
            date: "2024-09-20",
            time: "10:00 AM",
            entry: [
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
            ],
          },
          {
            string_inverter_no: "INV002",
            date: "2024-09-21",
            time: "11:00 AM",
            entry: [
              {
                voc_string: "610V",
                polarity_string: "Negative",
                floating_voltage: "6V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
            ],
          },
          {
            string_inverter_no: "INV003",
            date: "2024-09-22",
            time: "12:00 PM",
            entry: [
              {
                voc_string: "620V",
                polarity_string: "Positive",
                floating_voltage: "7V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
            ],
          },
          {
            string_inverter_no: "INV004",
            date: "2024-09-23",
            time: "1:00 PM",
            entry: [
              {
                voc_string: "630V",
                polarity_string: "Negative",
                floating_voltage: "8V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
            ],
          },
          {
            string_inverter_no: "INV005", // Adding more inverters for testing the scroll behavior
            date: "2024-09-24",
            time: "2:00 PM",
            entry: [
              {
                voc_string: "640V",
                polarity_string: "Positive",
                floating_voltage: "9V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
              {
                voc_string: "600V",
                polarity_string: "Positive",
                floating_voltage: "5V",
              },
            ],
          },
        ],
      };

  return (
    <Box sx={{ mt: 4, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
    <Grid container mb={2} sx={{p:2, border: '1px solid #ddd', borderRadius: '8px', minHeight: '130px' }}>
          <Grid item xs={3}>
            <Stack
              direction="column"
              sx={{ p:2, border: '1px solid #ddd', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Typography variant="h5">Add Logo here</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6}>
            <Stack direction="column" height="100%">
              <Box
                sx={{
                  flex: 2,
                  p:2, border: '1px solid #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Pre-Conmissioning Test Report - Voc, Polarity and Floating Voltage at Inverter         </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={3}>
            <Stack direction="column" height="100%">
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  p:2, border: '1px solid #ddd',
                  alignItems: 'center',
                  fontWeight: 500,
                  p: 1,
                }}
              >
                IMS/FOR/PR/052
              </Stack>
              <Stack
                direction="row"
                sx={{
                  flexGrow: 1,
                  p:2, border: '1px solid #ddd',
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
                  p:2, border: '1px solid #ddd',
                  alignItems: 'center',
                  fontWeight: 500,
                  p: 1,
                }}
              >
                Rev. Date: 12.10.2024
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <br />
        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
            <Typography variant="body1">Site Name: {data.site_name}</Typography>
        <Typography variant="body1">Equipment Make: {data.equipment_make}</Typography>

            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body1">Serial No: {data.serial_no}</Typography>
            <Typography variant="body1">Calibration Date: {data.calibration_date}</Typography>

            </Grid>
          </Grid>
        </Box>
    <Box sx={{ mt: 4 , marginRight:"30px" }}>
    <TableContainer
      component={Paper}
      sx={{
        padding: 2,
        overflowX: "auto", // Enable horizontal scrolling
        maxWidth: "100%",
         // Ensure it takes the full container width
      }}
    >

      <Table sx={{ minWidth: 650, border: "1px solid #ccc" }} aria-label="calibration table">
        <TableHead>
          <TableRow>
            {data.inverter.map((inverter, index) => (
              <TableCell
                key={index}
                align="center"
                colSpan={4}
                sx={{ backgroundColor: "#f0f0f0", fontWeight: "bold", borderRight: "1px solid #ccc" }}
              >
                PCU/String Inverter No# {inverter.string_inverter_no}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {data.inverter.map((inverter, index) => (
              <React.Fragment key={index}>
                <TableCell align="center" colSpan={2} sx={{ backgroundColor: "", borderRight: "1px solid #ccc" }}>
                  Date: {inverter.date}
                </TableCell>
                <TableCell align="center" colSpan={2} sx={{ backgroundColor: "", borderRight: "1px solid #ccc" }}>
                  Time: {inverter.time}
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            {data.inverter.map((_, index) => (
              <React.Fragment key={index}>
                <TableCell align="center" sx={{ fontWeight: "bold", borderRight: "1px solid #ccc", minWidth:"100px" }}>
                  String No.
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", borderRight: "1px solid #ccc", minWidth:"100px" }}>
                  VOC at String
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", borderRight: "1px solid #ccc", minWidth:"100px" }}>
                  Polarity at String
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", borderRight: "1px solid #ccc", minWidth:"100px" }}>
                  Floating Voltage at Positive to Earth
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 11 }).map((_, stringIndex) => (
            <TableRow key={stringIndex}>
              {data.inverter.map((inverter, inverterIndex) => (
                <React.Fragment key={inverterIndex}>
                  <TableCell align="center" sx={{ borderRight: "1px solid #ccc", minWidth:"100px" }}>
                    {stringIndex + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "1px solid #ccc", minWidth:"100px" }}>
                    {inverter.entry[stringIndex]?.voc_string || "-"}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "1px solid #ccc", minWidth:"100px" }}>
                    {inverter.entry[stringIndex]?.polarity_string || "-"}
                  </TableCell>
                  <TableCell align="center" sx={{ borderRight: "1px solid #ccc", minWidth:"100px" }}>
                    {inverter.entry[stringIndex]?.floating_voltage || "-"}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </Box>
  );
};



export default CalibrationTable;
