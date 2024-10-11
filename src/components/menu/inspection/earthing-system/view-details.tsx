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



const ViewDetails = () => {
    const formData ={
        "name_of_client": "ABC Corporation",
        "location": "123 Main St, Springfield",
        "date_of_test": "2024-10-08",
        "tester_details": {
          "make": "Tester Model X",
          "sl_no": "TX123456",
          "range": "0-1000V",
          "calib_details": "Calibrated on 2024-09-30",
          "earth_details": [
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "No",
              "earth_pit_cover": "Steel",
              "remarks": "All connections are secure."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Plastic",
              "remarks": "No issues found."
            },
            {
              "ep_connection_with_grid": "No",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Concrete",
              "remarks": "Needs inspection."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "No",
              "earth_pit_cover": "Steel",
              "remarks": "Verified and secure."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Plastic",
              "remarks": "In good condition."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Metal",
              "remarks": "Ready for use."
            },
            {
              "ep_connection_with_grid": "No",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Concrete",
              "remarks": "Requires further inspection."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "No",
              "earth_pit_cover": "Plastic",
              "remarks": "All connections secure."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "No",
              "earth_pit_cover": "Steel",
              "remarks": "All connections are verified."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Metal",
              "remarks": "In optimal condition."
            },
            {
              "ep_connection_with_grid": "No",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Concrete",
              "remarks": "Needs to be reviewed."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Plastic",
              "remarks": "Confirmed secure."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "No",
              "earth_pit_cover": "Steel",
              "remarks": "All in order."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Metal",
              "remarks": "Check completed."
            },
            {
              "ep_connection_with_grid": "No",
              "ep_connection_without_grid": "Yes",
              "earth_pit_cover": "Concrete",
              "remarks": "Inspection required."
            },
            {
              "ep_connection_with_grid": "Yes",
              "ep_connection_without_grid": "No",
              "earth_pit_cover": "Plastic",
              "remarks": "Ready for testing."
            }
          ]
        },
        "comments": "Overall testing completed successfully."
      }
      return (
            <Container sx={{ border: '1px solid #ddd', borderRadius: '8px'}} >
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
                        <Typography variant="h6">Precommissioning Checklist</Typography>
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
                        <Typography  variant="body1">IMS/FOR/PR/079</Typography>
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

        <Grid  marginTop={5} sx={{width:'100%',display:"flex",justifyContent:"center",alignItems:"center"}} >
            <Typography variant="h5"><b>EARTHING SYSTEM</b></Typography>
        </Grid>

        <Grid marginLeft={5} marginTop={5} container >
            <Grid item width={150} >
                <Typography ><b>Name of Client : </b></Typography>
                <Typography><b>Location</b></Typography>
                <Typography><b>Date of Test</b></Typography>
            </Grid>

            <Grid item >
                <Typography>{formData.name_of_client} </Typography>
                <Typography>{formData.location}</Typography>
                <Typography>{formData.date_of_test}</Typography>
            </Grid>
        </Grid>

        <Typography marginLeft={5} marginTop={8}  variant="h6"><b>Earth tester details :</b></Typography>
        <Grid sx={{display:'flex', justifyContent:"flex-start"}}>
            <Grid  marginLeft={5} marginTop={5} container >
                <Grid item width={80} >
                    <Typography ><b>Make : </b></Typography>
                    <Typography><b>Sl. No. </b></Typography>
                </Grid>

                <Grid item>
                    <Typography>{formData.tester_details.make} </Typography>
                    <Typography>{formData.tester_details.sl_no}</Typography>
                </Grid>
            </Grid>
            <Grid marginTop={5} container >
                <Grid item width={110} >
                    <Typography ><b>Range :</b> </Typography>
                    <Typography><b>Calib details : </b></Typography>
                </Grid>

                <Grid item >
                    <Typography>{formData.tester_details.range} </Typography>
                    <Typography>{formData.tester_details.calib_details}</Typography>
                </Grid>
            </Grid>
        </Grid>
        <Box marginTop={10}>
            <TableContainer component={Paper}>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{minWidth: "150px",border:"1px solid #ddd",background:"#E6E6E6"}}><b>Earth pit.No </b></TableCell>
                    <TableCell sx={{minWidth: "150px", border:"1px solid #ddd",background:"#E6E6E6"}}><b>EP Connection with Grid</b></TableCell>
                    <TableCell sx={{minWidth: "150px",border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>EP Connection without Grid</b></TableCell>
                    <TableCell sx={{minWidth: "200px",border:"1px solid #ddd",background:"#E6E6E6"}} align="center"><b>Earth Pit Cover</b></TableCell>
                    <TableCell  sx={{minWidth: "300px",border:"1px solid #ddd",background:"#E6E6E6"}}><b>Remarks</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>


                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((item, index) => (
                <TableRow key={index}>
                    <TableCell sx={{minWidth: "150px", border:"1px solid #ddd",alignSelf:"center"}}>EP-{index + 1}</TableCell>
                    <TableCell sx={{minWidth: "150px", border:"1px solid #ddd"}}>{formData.tester_details.earth_details[index].ep_connection_with_grid}</TableCell>
                    <TableCell sx={{minWidth: "150px",border:"1px solid #ddd"}} width={10}>{formData.tester_details.earth_details[index].ep_connection_without_grid}</TableCell>
                    <TableCell sx={{minWidth: "200px",border:"1px solid #ddd"}} width={10}>{formData.tester_details.earth_details[index].earth_pit_cover}</TableCell>
                    <TableCell  sx={{minWidth: "300px",border:"1px solid #ddd"}} >{formData.tester_details.earth_details[index].remarks}</TableCell>
                </TableRow>
                ))}




            </TableBody>
            </Table>
            </TableContainer>

            <Typography marginTop="50px" variant="h5"><b>Comments :</b> </Typography>
            <Typography>{formData?.comments=="undefined" ? "" : formData.comments}</Typography>
        </Box>

        </Container>

    )

}

export default ViewDetails;
