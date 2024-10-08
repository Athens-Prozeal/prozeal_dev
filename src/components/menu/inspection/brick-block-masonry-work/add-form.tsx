'use client';
import React, { useState } from 'react';
import zod from 'zod';
import {useForm, Controller} from 'react-hook-form';

import {
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Box,
    Container,
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';

import {zodResolver} from '@hookform/resolvers/zod';



const formSchema = zod.object({
    project_name : zod.string().min(1,"Project name is required"),
    project_description : zod.string().min(1,"Project description is required"),
    date_of_checking : zod.string().min(1,"Date of checking is required"),
    ref_drawing_no: zod.string().min(1,"Reference drawing number is required"),
    preparation : zod.array(
        zod.object({
            yes_or_no : zod.string().default('N/A'),
            remarks : zod.string().optional()
        })
    ).length(4,"Preparation should have 4 items"),
    inprocess_to_be_checked : zod.array(
        zod.object({
            yes_or_no : zod.string().default('N/A'),
            remarks : zod.string().optional()
        })
    ).length(12,"Inprocess to be checked should have 12 items"),
    courses : zod.array(
        zod.object({
            yes_or_no : zod.string().default('N/A'),
            remarks : zod.string().optional()
        })
    ).length(6,"Courses should have 6 items"),
    comment_if_any : zod.string(),
    checked_by_signature : zod.string().min(1,"Checked by is required"),
    checked_by_name : zod.string().min(1,"Checked by name is required"),
    checked_by_date : zod.string().min(1,"Checked by date is required"),
    checked_by_company : zod.string().min(1,"Checked by company is required"),
    witnessed_by_signature1 : zod.string().min(1,"Witnessed by signature is required"),
    witnessed_by_name1 : zod.string().min(1,"Witnessed by name is required"),
    witnessed_by_date1 : zod.string().min(1,"Witnessed by date is required"),
    witnessed_by_company1 : zod.string().min(1,"Witnessed by company is required"),
    witnessed_by_signature2 : zod.string().min(1,"Witnessed by signature is required"),
    witnessed_by_name2 : zod.string().min(1,"Witnessed by name is required"),
    witnessed_by_date2 : zod.string().min(1,"Witnessed by date is required"),
    witnessed_by_company2 : zod.string().min(1,"Witnessed by company is required"),
    witnessed_by_signature3 : zod.string().min(1,"Witnessed by signature is required"),
    witnessed_by_name3 : zod.string().min(1,"Witnessed by name is required"),
    witnessed_by_date3 : zod.string().min(1,"Witnessed by date is required"),
    witnessed_by_company3 : zod.string().min(1,"Witnessed by company is required"),
})


const Form = () => {
    const { handleSubmit, control,setValue ,formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    }

    return (
        <Container>
            <form onSubmit = {handleSubmit(onSubmit) }>
                <Grid my={3} container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="project_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Project Name"
                                    fullWidth
                                    error={!!errors?.project_name}
                                    helperText={String(errors?.project_name?.message)==="undefined" ?  "" : String(errors?.project_name?.message)}
                                />
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Controller
                            name="project_description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Project Description"
                                    fullWidth
                                    error={!!errors?.project_description}
                                    helperText={String(errors?.project_description?.message)=="undefined" ?  "" : String(errors?.project_description?.message) }
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid my={3} container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="date_of_checking"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Date of Checking"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    error={!!errors?.date_of_checking}
                                    helperText={String(errors?.date_of_checking?.message) == "undefined" ?  "" : String(errors?.date_of_checking?.message)}
                                />
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                            <Controller
                                name="ref_drawing_no"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Reference Drawing Number"
                                        fullWidth
                                        error={!!errors?.ref_drawing_no}
                                        helperText={String(errors?.ref_drawing_no?.message)=="undefined" ? "" : String(errors?.ref_drawing_no?.message )}
                                    />
                                )}
                            />
                    </Grid>
                </Grid>
                <Typography variant="h5">Items to be checked</Typography>


                    <Typography my={5} variant="h5">Preparation</Typography>
                    {["Cleaning, and hacking of receiving area-checked", "Alignment, level & dimensions – checked", "Quality of bricks/blocks & sand conforming to specification – checked", "Adequacy of scaffolding checked & safety clearance obtained."]
                        .map((item, index) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const [displaytoggle,setDisplaytoggle] = useState(false);
                            return (
                            <Box my={4}>
                                <Typography >{item}</Typography>
                                <Grid xs={12} md={6}>
                                <Controller
                                    name={`preparation.${index}.yes_or_no`}
                                    control={control}
                                    render={({ field }) => (
                                        <ToggleButtonGroup
                                            exclusive
                                            value={field.value || 'N/A'}
                                            onChange={(_, newValue) =>{
                                                field.onChange(newValue);
                                                if(newValue!='N/A' || newValue==null){
                                                    setDisplaytoggle(true);
                                                }
                                                else{
                                                    setDisplaytoggle(false);
                                                }
                                            }}
                                        >
                                            {["Yes", "No", "N/A"].map((value) => (
                                                <ToggleButton key={value} value={value}>
                                                    {value}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    )}
                                />

                                </Grid>
                                 { displaytoggle==false ? <></>  :  <Grid xs={12} md={6}>
                                    <Controller
                                        name={`preparation.${index}.remarks`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Remarks"
                                                fullWidth
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>}
                            </Box>
                        )
                    })}

<Typography variant="h5">In process to be checked </Typography>
                    {[
                    "Soaking of bricks/ wetting of blocks",
                    "Thickness of wall & laying of bricks with frogs upward",
                    "Mortar mix proportion",
                    "Mortar joint thickness, packing, raking of joints & staggering of vertical joints",
                    "Plumb, line & level",
                    "Opening size & location",
                    "Interlocking of even courses at wall junctions",
                    "Concrete band/ provision of bars in partition wall",
                    "Sill level & sill concrete",
                    "Lintel level",
                    "Packing between masonry and concrete",
                    "Curing"
                    ]
                        .map((item, index) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const [displaytoggle,setDisplaytoggle] = useState(false);
                            return (
                            <Box my={4}>
                                <Typography >{item}</Typography>
                                <Grid xs={12} md={6}>
                                <Controller
                                    name={`inprocess_to_be_checked.${index}.yes_or_no`}
                                    control={control}
                                    render={({ field }) => (
                                        <ToggleButtonGroup
                                            exclusive
                                            value={field.value || 'N/A'}
                                            onChange={(_, newValue) =>{
                                                field.onChange(newValue);
                                                if(newValue!='N/A' || newValue==null){
                                                    setDisplaytoggle(true);
                                                }
                                                else{
                                                    setDisplaytoggle(false);
                                                }
                                            }}
                                        >
                                            {["Yes", "No", "N/A"].map((value) => (
                                                <ToggleButton key={value} value={value}>
                                                    {value}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    )}
                                />

                                </Grid>
                                {displaytoggle==false ? <></>  : <Grid xs={12} md={6}>
                                    <Controller
                                        name={`inprocess_to_be_checked.${index}.remarks`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Remarks"
                                                fullWidth
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>
                                }
                            </Box>
                        )
                    })}
                    <Typography variant="h6">Courses</Typography>
                    {["course 1", "course 2", "course 3", "course 4", "course 5", "course 6"].map((item, index) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const [displaytoggle,setDisplaytoggle] = useState(false);
                        return (
                            <Box my={4}>
                                <Typography >{item} {index==0 ? "course laid as per drawing, aligned,plumbed & Commencement of work approved" : ""}</Typography>
                                <Grid xs={12} md={6}>
                                <Controller
                                    name={`courses.${index}.yes_or_no`}
                                    control={control}
                                    render={({ field }) => (
                                        <ToggleButtonGroup
                                            exclusive
                                            value={field.value || 'N/A'}
                                            onChange={(_, newValue) =>{
                                                field.onChange(newValue);
                                                if(newValue!='N/A' || newValue==null){
                                                    setDisplaytoggle(true);
                                                }
                                                else{
                                                    setDisplaytoggle(false);
                                                }
                                            }}
                                        >
                                            {["Yes", "No", "N/A"].map((value) => (
                                                <ToggleButton key={value} value={value}>
                                                    {value}
                                                </ToggleButton>
                                            ))}
                                        </ToggleButtonGroup>
                                    )}
                                />

                                </Grid>
                                { displaytoggle==false ? <></>  :  <Grid xs={12} md={6}>
                                    <Controller
                                        name={`courses.${index}.remarks`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Remarks"
                                                fullWidth
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>}
                            </Box>
                        )
                    })}
                <Typography variant="h5">Comments</Typography>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="comment_if_any"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Comment"
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                <Typography my={5} marginTop={5} variant="h5">Checked By</Typography>
                <Grid container spacing={2}>
                <Grid item  xs={12} md={6}>
                    <Controller
                        name="checked_by_signature"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Signature"
                                fullWidth
                                error = {!!errors?.checked_by_signature}
                                helperText={String(errors?.checked_by_signature?.message)=="undefined" ? "" : String(errors?.checked_by_signature?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="checked_by_name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                error = {!!errors?.checked_by_name}
                                helperText={String(errors?.checked_by_name?.message)=="undefined" ? "" : String(errors?.checked_by_name?.message)}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Controller
                        name="checked_by_date"
                        control={control}

                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error = {!!errors?.checked_by_date}
                                helperText={String(errors?.checked_by_date?.message)=="undefined" ? "" : String(errors?.checked_by_date?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid  item xs={12} md={6}>
                    <Controller
                        name="checked_by_company"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Company"
                                fullWidth
                            />
                        )}
                    />
                </Grid>
                </Grid>

                <Typography my={5} marginTop={5} variant="h5">Witnessed By 1</Typography>
                <Grid container spacing={2}>


                <Grid  item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_signature1"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Signature"
                                fullWidth
                                error = {!!errors?.witnessed_by_signature1}
                                helperText={String(errors?.witnessed_by_signature1?.message)=="undefined" ? "" : String(errors?.witnessed_by_signature1?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_name1"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                error={!!errors?.witnessed_by_name1}
                                helperText={String(errors?.witnessed_by_name1?.message)=="undefined" ? "" : String(errors?.witnessed_by_name1?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid  item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_date1"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors?.witnessed_by_date1}
                                helperText={String(errors?.witnessed_by_date1?.message)=="undefined" ? "" : String(errors?.witnessed_by_date1?.message) }
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_company1"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Company"
                                fullWidth
                                error={!!errors?.witnessed_by_company1}
                                helperText={String(errors?.witnessed_by_company1?.message)=="undefined" ? "" : String(errors?.witnessed_by_company1?.message)}
                            />
                        )}
                    />
                </Grid>
                </Grid>

                <Typography my={5} marginTop={5} variant="h5">Witnessed By 2</Typography>
                <Grid container spacing={2}>


                <Grid  item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_signature2"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Signature"
                                fullWidth
                                error = {!!errors?.witnessed_by_signature2}
                                helperText={String(errors?.witnessed_by_signature2?.message)=="undefined" ? "" : String(errors?.witnessed_by_signature2?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_name2"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                error={!!errors?.witnessed_by_name}
                                helperText={String(errors?.witnessed_by_name2?.message)=="undefined" ? "" : String(errors?.witnessed_by_name2?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid  item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_date2"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors?.witnessed_by_date2}
                                helperText={String(errors?.witnessed_by_date2?.message)=="undefined" ? "" : String(errors?.witnessed_by_date2?.message) }
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_company2"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Company"
                                fullWidth
                                error={!!errors?.witnessed_by_company2}
                                helperText={String(errors?.witnessed_by_company2?.message)=="undefined" ? "" : String(errors?.witnessed_by_company2?.message)}
                            />
                        )}
                    />
                </Grid>
                </Grid>

                <Typography my={5} marginTop={5} variant="h5">Witnessed By 3</Typography>
                <Grid container spacing={2}>


                <Grid  item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_signature3"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Signature"
                                fullWidth
                                error = {!!errors?.witnessed_by_signature3}
                                helperText={String(errors?.witnessed_by_signature3?.message)=="undefined" ? "" : String(errors?.witnessed_by_signature3?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_name3"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                error={!!errors?.witnessed_by_name3}
                                helperText={String(errors?.witnessed_by_name3?.message)=="undefined" ? "" : String(errors?.witnessed_by_name3?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid  item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_date3"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Date"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!errors?.witnessed_by_date3}
                                helperText={String(errors?.witnessed_by_date3?.message)=="undefined" ? "" : String(errors?.witnessed_by_date3?.message) }
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Controller
                        name="witnessed_by_company3"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Company"
                                fullWidth
                                error={!!errors?.witnessed_by_company3}
                                helperText={String(errors?.witnessed_by_company3?.message)=="undefined" ? "" : String(errors?.witnessed_by_company3?.message)}
                            />
                        )}
                    />
                </Grid>
                </Grid>

                <Box my={5}>
                    <Button type="submit" variant="contained" color="primary">Submit</Button>
                </Box>
            </form>
        </Container>
    )
}


export default Form;
