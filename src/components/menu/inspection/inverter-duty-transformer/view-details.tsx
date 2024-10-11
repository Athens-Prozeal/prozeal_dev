import React from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Stack,
  Container
} from "@mui/material";

const ViewDetails: React.FC = () => {
  const formData = {
    drawing_specification_no: "DS-1234",
    serial_no: "SN-5678",
    site_location_area: "Main Substation",
    check_points1: [
      { status: "Yes", remarks: "All checks passed" },
      { status: "No", remarks: "Awaiting confirmation" },
      { status: "Yes" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "No", remarks: "Requires further inspection" }
    ],
    buchholz_relay: [
      { status: "Yes", remarks: "Functioning well" },
      { status: "N/A" },
      { status: "N/A" },
      { status: "No", remarks: "Needs testing" }
    ],
    breather: [
      { status: "N/A" },
      { status: "Yes", remarks: "No issues found" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" }
    ],
    bushing: [
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" }
    ],
    radiator: [
      { status: "Yes", remarks: "Clean and operational" },
      { status: "N/A" }
    ],
    air_release_form: [
      { status: "Yes", remarks: "To be filled out" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" },
      { status: "Yes" }
    ],
    instruments: [
      { status: "Yes", remarks: "Calibration verified" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" },
      { status: "Yes" },
      { status: "N/A" }
    ],
    check_points2: [
      { status: "Yes", remarks: "All points verified" },
      { status: "No" },
      { status: "Yes" }
    ],
    bus_duct: [
      { status: "N/A" },
      { status: "Yes" }
    ],
  };

  return (
    <Container>
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
                p: 2, border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                INSTALLATION CHECKLIST FOR INVERTER DUTY TRANSFORMER
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
                p: 2, border: '1px solid #ddd',
                alignItems: 'center',
                fontWeight: 500,
              }}
            >
              IMS/FOR/PR/036
            </Stack>
            <Stack
              direction="row"
              sx={{
                flexGrow: 1,
                p: 2, border: '1px solid #ddd',
                alignItems: 'center',
                fontWeight: 500,
              }}
            >
              Rev. No.:00
            </Stack>
            <Stack
              direction="row"
              sx={{
                flexGrow: 1,
                p: 2, border: '1px solid #ddd',
                alignItems: 'center',
                fontWeight: 500,
              }}
            >
              Rev. Date: 14.03.2024
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1"><b>Site Name: </b>{formData.drawing_specification_no}</Typography>
            <Typography variant="body1"><b>Equipment Make:</b> {formData.serial_no}</Typography>
            <Typography variant="body1"><b>Serial No: </b>{formData.site_location_area}</Typography>

          </Grid>

        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
        <TableHead>
            <TableRow>
            <TableCell />
            <TableCell />
            <TableCell  colSpan={3} align="center"><b>Status</b></TableCell>
            </TableRow>
            <TableRow>

              <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}}><b>Sr No.</b></TableCell>
              <TableCell sx={{minWidth: "400px", border:"1px solid #ddd",background:"#E6E6E6"}}><b>Check Points</b></TableCell>
              <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>Yes</b></TableCell>
              <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>No</b></TableCell>
              <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>N/A</b></TableCell>
              <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd",background:"#E6E6E6"}}><b>Remarks</b></TableCell>

            </TableRow>
          </TableHead>

          <TableBody>
            {[
              "Check the Trafo Ratings & Make as per approved drawings / specifications",
              "Check for correctness of Foundation, Co-ordinates, Location, Level alignment as per drawings",
              "Check for Installation as per equipment Tag no., Area of classification, layout drawing",
              "Check for Transformer centre line, level, roller stopper, anti-seismic mounting plate provided",
              "Assembly of all accessories and fittings Yes",
              "Oil/Winding temperature gauges/relays installed",
              "Check Transformer oil level in tank and conservator",
              "Ensure the radiator gasket are changed by new one"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{index + 1}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.check_points1[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.check_points1[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.check_points1[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.check_points1[index].remarks}</TableCell>
              </TableRow>
            ))}

            <TableRow>
                <TableCell>9  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Buchholz relay</b></TableCell>
            </TableRow>
            {[
              "Piping as per drawing",
                    "Arrow towards conservator",
                    "Float element free",
                    "Mercury Switches intact"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.buchholz_relay[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.buchholz_relay[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.buchholz_relay[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.buchholz_relay[index].remarks}</TableCell>
              </TableRow>
            ))}

            <TableRow>
                <TableCell>10  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Breather</b></TableCell>
            </TableRow>
            {[
              "Piping to conservator as per drawing",
                "Silica gel colour blue",
                "Air entry hole open",
                "Oil filled in bottom compartment",
                "Explosion vents - Both are installed and diaphragms intact"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.breather[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.breather[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.breather[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.breather[index].remarks}</TableCell>
              </TableRow>
            ))}
            <TableRow>
            <TableCell>11  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Bushing</b></TableCell>
            </TableRow>
            {[
              "No cracks seen",
                    "Air Released",
                    "Arcing horn gaps as per drawing",
                    "All gaskets intact an new",
                    "Oil level gauge in consrevator is calibrated & functioning"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.bushing[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.bushing[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.bushing[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.bushing[index].remarks}</TableCell>
              </TableRow>
            ))}

<TableRow>
            <TableCell>12  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Radiator</b></TableCell>
            </TableRow>
            {[
             "Check for valves are open",
                    "Check for no leakage at fingers & joints"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.radiator[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.radiator[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.radiator[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.radiator[index].remarks}</TableCell>
              </TableRow>
            ))}

<TableRow>
            <TableCell>13  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Air release from</b></TableCell>
            </TableRow>
            {[
              "Radiator",
                    "Bushings",
                    "Buchholz relay",
                    "Transformer tank",
                    "OLTC Tank & Surge relay"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.air_release_form[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.air_release_form[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.air_release_form[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.air_release_form[index].remarks}</TableCell>
              </TableRow>
            ))}

<TableRow>
            <TableCell>14  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Instruments ( OTI & WTI )</b></TableCell>
            </TableRow>
            {[
             "Bulb inserted in pocket in Marshalling box",
                    "Breather Pocket filled with oil",
                    "Marshalling box installed and connected",
                    "Tap Changer manual operation is free",
                    "Proper Control & Communication cables termination",
                    "Cable dressing & Connections checked for Cable supports, clamps"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.instruments[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.instruments[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.instruments[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.instruments[index].remarks}</TableCell>
              </TableRow>
            ))}

{[
              "Bolted electrical connections clearly marked as per drawing",
                    "All unwanted materials cleared, and Transformer kept clean",
                    "Paint touch-ups applied wherever applicable"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{index + 15}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.check_points2[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.check_points2[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.check_points2[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.check_points2[index].remarks}</TableCell>
              </TableRow>
            ))}

<TableRow>
            <TableCell>18  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Bus Duct</b></TableCell>
            </TableRow>
            {[
             "LV bus alignment & tightness to be check",
                    "Busduct properly closed & tightened"
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{border:"1px solid #ddd"}}>{String.fromCharCode(65+index)}</TableCell>
                <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.bus_duct[index].status === 'Yes' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.bus_duct[index].status === 'No' ? "✔" : ""}</TableCell>
                <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.bus_duct[index].status === 'N/A' ? "✔" : ""}</TableCell>
                <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.bus_duct[index].remarks}</TableCell>
              </TableRow>
            ))}



          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </Container>
  );
};

export default ViewDetails;
