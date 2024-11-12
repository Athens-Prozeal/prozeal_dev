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
    drawing_specification_no: zod.string().min(1, 'Drawing specification number is required').max(155, 'Drawing specification number is too long'),
    site_location_area: zod.string().min(1, 'Site location area is required').max(155, 'Site location area is too long'),
    checklist: zod.object({
        check_list_1: zod.array(zod.object({
            observation: zod.string().optional().default('No'), // Changed to optional to avoid validation errors
            remarks: zod.string().optional(),
        })).length(17, 'Checklist 1 must have 17 items'),
        pv_module: zod.array(zod.object({
            observation: zod.string().min(1, 'Observation is required').max(155, 'Observation is too long').default('No'),
            remarks: zod.string().optional(),
        })).length(4, 'PV Module must have 8 items'),
        check_for_module_series: zod.array(zod.object({
            observation: zod.string().min(1, 'Observation is required').max(155, 'Observation is too long').default('No'),
            remarks: zod.string().optional(),
        })).length(5, 'Check for module series must have 5 items'),
        check_list_2: zod.array(zod.object({
            observation: zod.string().min(1, 'Observation is required').max(155, 'Observation is too long').default('No'),
            remarks: zod.string().optional(),
        })).length(6, 'Checklist 2 must have 5 items'),

    }),
    comments: zod.string().optional(),
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

});

type FormData = zod.infer<typeof formSchema>;

const Form = () => {
    const {handleSubmit, control, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            checklist: {
                check_list_1: Array.from({ length: 17 }, () => ({ observation: 'No', remarks: '' })) // Set default values
            }
        }
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    return (
        <Container>
        <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Controller
                    name="drawing_specification_no"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Drawing Specification No."
                            fullWidth
                            error={!!errors.drawing_specification_no}
                            helperText={errors.drawing_specification_no?.message}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Controller
                    name="site_location_area"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Site Location Area"
                            fullWidth
                            error={!!errors.site_location_area}
                            helperText={errors.site_location_area?.message}
                        />
                    )}
                />
            </Grid>
        </Grid>
        
        <Typography variant="h5">Check Points</Typography>
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
    <Box my={6} key={index}>
        <Typography my={2} variant="body1">{index + 1}: {item}</Typography>
        
        {/* Observation Controller */}
        <Controller
            name={`checklist.check_list_1.${index}.observation`}
            control={control}
            render={({ field }) => (
                <ToggleButtonGroup
                    exclusive
                    value={field.value !== undefined ? field.value : 'No'}
                    onChange={(_, newValue) => field.onChange(newValue)}
                >
                    {["Yes", "No"].map((value) => (
                        <ToggleButton key={value} value={value}>
                            {value}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            )}
        />

        {/* Remarks Controller */}
        <Controller
            name={`checklist.check_list_1.${index}.remarks`}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Remarks"
                    fullWidth
                    variant="standard"
                    error={!!errors.checklist?.check_list_1?.[index]?.remarks}
                    helperText={errors.checklist?.check_list_1?.[index]?.remarks?.message}
                />
            )}
        />
    </Box>
))}

                <Typography variant="h6">18 : PV Module wiring/ cabling done should be free from following</Typography>

                {[
                    "Cable/ wire Short Bends",
                    "Cable/ wire sagging",
                    "Hanging of cable/ wire",
                    "Stress on module junction box"
                ].map((item, index) => (
                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}: {item}</Typography>
                        
                        {/* Observation Controller */}
                        <Controller
                            name={`checklist.pv_module.${index}.observation`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value !== undefined ? field.value : 'No'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />

                        {/* Remarks Controller */}
                        <Controller
                            name={`checklist.pv_module.${index}.remarks`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Remarks"
                                    fullWidth
                                    variant="standard"
                                    error={!!errors.checklist?.check_list_1?.[index]?.remarks}
                                    helperText={errors.checklist?.check_list_1?.[index]?.remarks?.message}
                                />
                            )}
                        />
                    </Box>
                ))}


                <Typography variant="h6">19 : Check for Module Series Wiring & VOC measurement as </Typography>

                {[
                    "For Right Polarity / No reverse polarity allowed",
                    "Number of modules in series with reference to SLD",
                    "String Voc to match SLD and Datasheet",
                    "Check for any loose contacts & short circuit of module",
                    "Check each module for any hot spot"
                ].map((item, index) => (
                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}: {item}</Typography>
                        
                        {/* Observation Controller */}
                        <Controller
                            name={`checklist.check_for_module_series.${index}.observation`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value !== undefined ? field.value : 'No'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />

                        {/* Remarks Controller */}
                        <Controller
                            name={`checklist.check_for_module_series.${index}.remarks`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Remarks"
                                    fullWidth
                                    variant="standard"
                                    error={!!errors.checklist?.check_list_1?.[index]?.remarks}
                                    helperText={errors.checklist?.check_list_1?.[index]?.remarks?.message}
                                />
                            )}
                        />
                    </Box>
                ))}

                {[
  "Check for IR (Insulation resistance) between conductor and earth - From PV array to AJB/ SCB",
  "Check & ensure MC4 connector male female lugs crimped using MC4 crimping",
  "Check Proper Module cable dressing & individual strings verification",
  "Check whether mixed current binning modules installed",
  "Check the ferrules should be in correct & visible.",
  "Shadow analysis on every table point on module"
].map((item, index) => (
                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{index + 1}: {item}</Typography>
                        
                        {/* Observation Controller */}
                        <Controller
                            name={`checklist.check_list_2.${index}.observation`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value !== undefined ? field.value : 'No'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />

                        {/* Remarks Controller */}
                        <Controller
                            name={`checklist.check_list_2.${index}.remarks`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Remarks"
                                    fullWidth
                                    variant="standard"
                                    error={!!errors.checklist?.check_list_1?.[index]?.remarks}
                                    helperText={errors.checklist?.check_list_1?.[index]?.remarks?.message}
                                />
                            )}
                        />
                    </Box>
                ))}




        <Typography my={5} marginTop={5} variant="h5">Comments</Typography>
        <Controller
            name="comments"
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Comments"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.comments}
                    helperText={errors.comments?.message}
                />
            )}
        />

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
                        error={!!errors?.witnessed_by_name2}
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
        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>Submit</Button>
        </form>
        </Container>
    )

}


export default Form;