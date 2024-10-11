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
  Container,
  Tab
} from "@mui/material";

const ViewDetails = () =>{
    const formData = {
        "name_of_client": "XYZ Industries",
        "location": "456 Industry Rd, Metropolis",
        "date_of_test": "2024-10-08",
        "make": "HighVoltage Tester 3000",
        "cable_rating": "11 kV",
        "data": {
          "insulation_resistance": {
            "before_hv_test": {
              "R_E": "10 MΩ",
              "Y_E": "9.5 MΩ",
              "B_E": "11 MΩ",
              "R_Y": "10.5 MΩ",
              "Y_B": "10 MΩ",
              "B_R": "9 MΩ"
            },
            "after_hv_test": {
              "R_E": "9.8 MΩ",
              "Y_E": "9.3 MΩ",
              "B_E": "10.7 MΩ",
              "R_Y": "10.2 MΩ",
              "Y_B": "9.5 MΩ",
              "B_R": "8.8 MΩ"
            },
            "found_healthy": "Yes",
            "general_inspection": "No",
            "remarks": "Cables are in good condition"
          },
          "hi_pot_test": {
            "R_PH": {
              "injected_voltage": "12 kV",
              "leakage_current": "1.2 mA",
              "time": "60 seconds"
            },
            "Y_PH": {
              "injected_voltage": "12 kV",
              "leakage_current": "1.1 mA",
              "time": "60 seconds"
            },
            "B_PH": {
              "injected_voltage": "12 kV",
              "leakage_current": "1.3 mA",
              "time": "60 seconds"
            },
            "withstood_the_test": "Yes",
            "cable_found_healthy": "Yes"
          }
        }
      };

    return (
        <Container sx={{ border: '1px solid #ddd', borderRadius: '8px'}}>
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
                    <Typography variant="h6"  sx={{border: '1px solid #ddd',
                    alignItems: 'center', fontWeight: 700,alignSelf:'center',padding:'20px' }}> PROZEAL GREEN ENERGY PVT LTD </Typography>
                </Grid>
                <Grid container >
                    <Grid sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 700,padding:'20px' }} item xs={3}>
                        <Typography variant="h6"><b>Document Name : </b> </Typography>
                    </Grid>
                    <Grid sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 700,padding:'20px' }} item xs={9}>
                        <Typography variant="h6">Pre-Commissioning Checklist</Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <Grid sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px' }}>
                        <Typography  variant="body1"><b>Format No: </b></Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px'}}>
                        <Typography variant="body1"><b>Issue No: </b></Typography>
                        </Grid  >
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400,padding:'10px' }}>
                        <Typography variant="body1"><b>Issue Date: </b></Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400,padding:'10px' }}>
                        <Typography  variant="body1">IMS/FOR/PR/080</Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px'}}>
                        <Typography variant="body1">01</Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400,padding:'10px' }}>
                        <Typography variant="body1">18-01-2024 </Typography>
                        </Grid>
                    </Grid>

                    <Grid item xs={3}>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400,padding:'10px' }}>
                        <Typography  variant="body1"><b>Page No: </b></Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px'}}>
                        <Typography variant="body1"><b>Revision No: </b></Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400,padding:'10px' }}>
                        <Typography variant="body1"><b>Revision Date: </b></Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px'}}>
                        <Typography  variant="body1">01</Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px'}}>
                        <Typography variant="body1">00</Typography>
                        </Grid>
                        <Grid  sx={{border: '1px solid #ddd', alignItems: 'center', fontWeight: 400 ,padding:'10px'}}>
                        <Typography variant="body1">NA</Typography>
                        </Grid>
                    </Grid>


                </Grid>

            </Grid>

        </Grid>

        </Box>
        <Box margin={5}>
            <Grid  marginTop={5} sx={{width:'100%',display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Typography variant="h5"><b>HT CABLE</b></Typography>
                </Grid>

                <Grid  marginTop={5} container >
                <Grid item width={150} >
                    <Typography ><b>Name of Client : </b></Typography>
                    <Typography><b>Location</b></Typography>
                    <Typography><b>Date of Test</b></Typography>
                    <Typography><b>Make</b></Typography>
                    <Typography><b>Cable Rating</b></Typography>


                </Grid>

                <Grid item >
                    <Typography>{formData.name_of_client} </Typography>
                    <Typography>{formData.location}</Typography>
                    <Typography>{formData.date_of_test}</Typography>
                    <Typography>{formData.make}</Typography>
                    <Typography>{formData.cable_rating}</Typography>


                </Grid>
                </Grid>

                <Typography marginTop={8}  variant="h6"><b>1. INSULATION RESISTANCE TEST :</b></Typography>
                <Grid marginTop={5}></Grid>
                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Applied Voltage</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>R_E</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Y_E</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>B_E</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>R_Y</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Y_B</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>B_R</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>BEFORE HV TEST</TableCell>
                                <TableCell>{formData.data.insulation_resistance.before_hv_test.R_E}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.before_hv_test.Y_E}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.before_hv_test.B_E}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.before_hv_test.R_Y}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.before_hv_test.Y_B}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.before_hv_test.B_R}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>AFTER HV TEST</TableCell>
                                <TableCell>{formData.data.insulation_resistance.after_hv_test.R_E}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.after_hv_test.Y_E}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.after_hv_test.B_E}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.after_hv_test.R_Y}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.after_hv_test.Y_B}</TableCell>
                                <TableCell>{formData.data.insulation_resistance.after_hv_test.B_R}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography  marginTop={3}  ><b>Note: Test certificate will be submitted at the time of testing</b></Typography>
                <Typography  marginTop={3}  ><b>Cables found healty : </b> {formData.data.insulation_resistance.found_healthy}</Typography>
                <Typography  marginTop={3}  ><b>General Inspection & Erection completion checked : </b> {formData.data.insulation_resistance.general_inspection}</Typography>

                <Typography  marginTop={3} >Remarks : {formData.data.insulation_resistance.remarks}</Typography>


                <Typography  marginTop={8}  variant="h6"><b>2. HI-POT TEST </b></Typography>
                <Grid marginTop={5}></Grid>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Phase</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Injected Voltage</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Leakage Current</TableCell>
                                <TableCell sx={{backgroundColor:"#E6E6E6",fontWeight:"bold"}}>Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>R_PH</TableCell>
                                <TableCell>{formData.data.hi_pot_test.R_PH.injected_voltage}</TableCell>
                                <TableCell>{formData.data.hi_pot_test.R_PH.leakage_current}</TableCell>
                                <TableCell>{formData.data.hi_pot_test.R_PH.time}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Y_PH</TableCell>
                                <TableCell>{formData.data.hi_pot_test.Y_PH.injected_voltage}</TableCell>
                                <TableCell>{formData.data.hi_pot_test.Y_PH.leakage_current}</TableCell>
                                <TableCell>{formData.data.hi_pot_test.Y_PH.time}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>B_PH</TableCell>
                                <TableCell>{formData.data.hi_pot_test.B_PH.injected_voltage}</TableCell>
                                <TableCell>{formData.data.hi_pot_test.B_PH.leakage_current}</TableCell>
                                <TableCell>{formData.data.hi_pot_test.B_PH.time}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography  marginTop={3}  ><b>The cable withstood the test  : </b> {formData.data.hi_pot_test.withstood_the_test}</Typography>
                <Typography  marginTop={3}  ><b>Cables found healthy : </b> {formData.data.hi_pot_test.cable_found_healthy}</Typography>
                </Box>

        </Container>
    )
}

export default ViewDetails;
