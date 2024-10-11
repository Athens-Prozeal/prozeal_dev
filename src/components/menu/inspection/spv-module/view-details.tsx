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



const ViewDetails = () =>{
    const formData = {
        drawing_specification_no: "DS-9876",
        site_location_area: "Solar Farm A",
        checklist: {
          check_list_1:[
            { observation: "Yes", remarks: "Module installed correctly." },
            { observation: "Yes", remarks: "Wiring connections secured." },
            { observation: "No", remarks: "Some connections loose." },
            { observation: "Yes", remarks: "Grounding verified." },
            { observation: "Yes", remarks: "Module installed correctly." },
            { observation: "Yes", remarks: "Wiring connections secured." },
            { observation: "No", remarks: "Some connections loose." },
            { observation: "Yes", remarks: "Grounding verified." },
            { observation: "Yes", remarks: "Module installed correctly." },
            { observation: "Yes", remarks: "Wiring connections secured." },
            { observation: "No", remarks: "Some connections loose." },
            { observation: "Yes", remarks: "Grounding verified." },
            { observation: "Yes", remarks: "Module installed correctly." },
            { observation: "Yes", remarks: "Wiring connections secured." },
            { observation: "No", remarks: "Some connections loose." },
            { observation: "Yes", remarks: "Grounding verified." },
            { observation: "No", remarks: "Some connections loose." },
          ],
          pv_module: [
            { observation: "Yes", remarks: "Module installed correctly." },
            { observation: "Yes", remarks: "Wiring connections secured." },
            { observation: "No", remarks: "Some connections loose." },
            { observation: "Yes", remarks: "Grounding verified." }
          ],
          check_for_module_series: [
            { observation: "Yes", remarks: "Series A connected properly." },
            { observation: "Yes", remarks: "Series B operational." },
            { observation: "No", remarks: "Series C needs testing." },
            { observation: "Yes", remarks: "Series D checked." },
            { observation: "Yes", remarks: "Series E confirmed." }
          ],
          check_list_2: [
            { observation: "Yes", remarks: "All modules functioning." },
            { observation: "Yes", remarks: "No loose connections." },
            { observation: "No", remarks: "One inverter not operational." },
            { observation: "Yes", remarks: "Monitoring systems active." },
            { observation: "Yes", remarks: "Safety checks completed." },
            { observation: "Yes", remarks: "Documentation submitted." }
          ]
        },
        comments: "All checks completed without issues."
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
                    INSTALLATION CHECKLIST FOR SPV MODULES
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
                IMS/FOR/PR/071
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
                <Typography variant="body1"><b>Drawing Specification No: </b>{formData.drawing_specification_no}</Typography>
                <Typography variant="body1"><b>Site location? Area:</b> {formData.site_location_area}</Typography>

            </Grid>

            </Grid>
        </Box>
        </Box>

            <Grid container spacing={2}>
            <Grid item xs={12}>
            <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell  colSpan={2} align="center"><b>Observations</b></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}}><b>Sr No.</b></TableCell>
                    <TableCell sx={{minWidth: "400px", border:"1px solid #ddd",background:"#E6E6E6"}}><b>Check Points</b></TableCell>
                    <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>Yes</b></TableCell>
                    <TableCell sx={{border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>No</b></TableCell>
                    <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd",background:"#E6E6E6"}}><b>Remarks</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {[
                    "Check PV Modules installed as per row layout (Refer approved drawings & Specifications)",
                    "Check for Module Wp rating as per Approved drawing/Datasheet/Specifications",
                    "Check for availability of OEM Module installation Guide prior to installation",
                    "Check & verify module lifting and its handling as per OEM guideline",
                    "Check for Module any damages or scratches before installation on structure",
                    "Check PV Module surface free from scratches and undamaged",
                    "Check junction box, cable & connectors undamaged prior to installation",
                    "Check before module installation the connectors, inverters and other electrical components/panels in a disconnect status",
                    "Check module mount as per drawing tilt angle & orientation",
                    "Check & Verified Table length, width & diagonal as per drawing",
                    "Check Module mounting supports alignment & row spacing within tolerance limits (As per specifications)",
                    "Check Module clamps fixed properly and washers, Nut- Bolts provided as per approved drawings",
                    "Check Clamp fixture on the module as per drawing",
                    "Check Modules fixed on supports using lock/spring washers",
                    "Check Modules tightened with torque wrench spanner & marking done on nut/bolts (Mention the applied torque value)",
                    "Check all module frames & structures earthing as per approved drawing",
                    "Check for proper PV connector assembly with PV cable adequately crimped"
                ].map((item, index) => (
                    <TableRow key={index}>
                    <TableCell sx={{border:"1px solid #ddd"}}>{index + 1}</TableCell>
                    <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.check_list_1[index].observation === 'Yes' ? "✔" : ""}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.check_list_1[index].observation === 'No' ? "✔" : ""}</TableCell>
                    <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.checklist.check_list_1[index].remarks}</TableCell>
                </TableRow>
                ))}
                <TableRow>
                <TableCell>18  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>PV Module wiring/ cabling done should be free from following</b></TableCell>
                </TableRow>
                {[
                    "Cable/ wire Short Bends",
                    "Cable/ wire sagging",
                    "Hanging of cable/ wire",
                    "Stress on module junction box"
                ].map((item, index) => (
                    <TableRow key={index}>
                    <TableCell sx={{border:"1px solid #ddd"}}>{index + 1}</TableCell>
                    <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.pv_module[index].observation === 'Yes' ? "✔" : ""}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.pv_module[index].observation === 'No' ? "✔" : ""}</TableCell>
                    <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.checklist.pv_module[index].remarks}</TableCell>
                </TableRow>
                ))}

<TableRow>
                <TableCell>19  </TableCell>
                <TableCell colSpan={5} sx={{border:"1px solid #ddd"}}> <b>Check for Module Series Wiring & VOC measurement as</b></TableCell>
                </TableRow>
                {[
                    "For Right Polarity / No reverse polarity allowed",
                    "Number of modules in series with reference to SLD",
                    "String Voc to match SLD and Datasheet",
                    "Check for any loose contacts & short circuit of module",
                    "Check each module for any hot spot"
                ].map((item, index) => (
                    <TableRow key={index}>
                    <TableCell sx={{border:"1px solid #ddd"}}>{index + 1}</TableCell>
                    <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.check_for_module_series[index].observation === 'Yes' ? "✔" : ""}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.check_for_module_series[index].observation === 'No' ? "✔" : ""}</TableCell>
                    <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.checklist.check_for_module_series[index].remarks}</TableCell>
                </TableRow>
                ))}

                {[
                   "Check for IR (Insulation resistance) between conductor and earth - From PV array to AJB/ SCB",
  "Check & ensure MC4 connector male female lugs crimped using MC4 crimping",
  "Check Proper Module cable dressing & individual strings verification",
  "Check whether mixed current binning modules installed",
  "Check the ferrules should be in correct & visible.",
  "Shadow analysis on every table point on module"
                ].map((item, index) => (
                    <TableRow key={index}>
                    <TableCell sx={{border:"1px solid #ddd"}}>{index + 20}</TableCell>
                    <TableCell sx={{minWidth: "400px", border:"1px solid #ddd"}}>{item}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.check_list_2[index].observation === 'Yes' ? "✔" : ""}</TableCell>
                    <TableCell sx={{border:"1px solid #ddd"}} width={10}>{formData.checklist.check_list_2[index].observation === 'No' ? "✔" : ""}</TableCell>
                    <TableCell  sx={{minWidth: "200px",border:"1px solid #ddd"}} >{formData.checklist.check_list_2[index].remarks}</TableCell>
                </TableRow>
                ))}


            </TableBody>
            </Table>
            </TableContainer>
            </Grid>
            </Grid>
            <Typography my={5} marginTop={5} variant="h5">Comments</Typography>
            <Typography>{formData.comments}</Typography>
        </Container>

      )

}



export default ViewDetails;
