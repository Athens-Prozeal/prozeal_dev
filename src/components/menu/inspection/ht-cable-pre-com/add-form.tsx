import React from 'react';
import zod from 'zod';
import { useForm, Controller } from 'react-hook-form';
import {
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    Container,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';

// Define validation schema
const formSchema = zod.object({
    name_of_client: zod.string().min(1, 'Name of client is required').max(155, 'Name of client is too long'),
    location: zod.string().min(1, 'Location is required').max(155, 'Location is too long'),
    date_of_test: zod.string().min(1, 'Date of test is required').max(155, 'Date of test is too long'),
    make: zod.string().min(1, 'Make is required').max(155, 'Make is too long'),
    cable_rating: zod.string().min(1, 'Cable rating is required').max(155, 'Cable rating is too long'),
    data: zod.object({
        insulation_resistance: zod.object({
            before_hv_test: zod.object({
                R_E: zod.string().min(1, 'R_E is required').max(155, 'R_E is too long'),
                Y_E: zod.string().min(1, 'Y_E is required').max(155, 'Y_E is too long'),
                B_E: zod.string().min(1, 'B_E is required').max(155, 'B_E is too long'),
                R_Y: zod.string().min(1, 'R_Y is required').max(155, 'R_Y is too long'),
                Y_B: zod.string().min(1, 'Y_B is required').max(155, 'Y_B is too long'),
                B_R: zod.string().min(1, 'B_R is required').max(155, 'B_R is too long'),
            }),
            after_hv_test: zod.object({
                R_E: zod.string().min(1, 'R_E is required').max(155, 'R_E is too long'),
                Y_E: zod.string().min(1, 'Y_E is required').max(155, 'Y_E is too long'),
                B_E: zod.string().min(1, 'B_E is required').max(155, 'B_E is too long'),
                R_Y: zod.string().min(1, 'R_Y is required').max(155, 'R_Y is too long'),
                Y_B: zod.string().min(1, 'Y_B is required').max(155, 'Y_B is too long'),
                B_R: zod.string().min(1, 'B_R is required').max(155, 'B_R is too long'),
            }),
            found_healthy: zod.string().default('No'),
            general_inspection: zod.string().default("No")
        }),
        hi_pot_test: zod.object({
            R_PH: zod.object({
                injected_voltage: zod.string().min(1, 'Injected voltage is required').max(155, 'Injected voltage is too long'),
                leakage_current: zod.string().min(1, 'Leakage current is required').max(155, 'Leakage current is too long'),
                time: zod.string().min(1, 'Time is required').max(155, 'Time is too long'),
            }),
            Y_PH: zod.object({
                injected_voltage: zod.string().min(1, 'Injected voltage is required').max(155, 'Injected voltage is too long'),
                leakage_current: zod.string().min(1, 'Leakage current is required').max(155, 'Leakage current is too long'),
                time: zod.string().min(1, 'Time is required').max(155, 'Time is too long'),
            }),
            B_PH: zod.object({
                injected_voltage: zod.string().min(1, 'Injected voltage is required').max(155, 'Injected voltage is too long'),
                leakage_current: zod.string().min(1, 'Leakage current is required').max(155, 'Leakage current is too long'),
                time: zod.string().min(1, 'Time is required').max(155, 'Time is too long'),
            }),
            withstood_the_test: zod.string().default('No'),
            cable_found_healthy: zod.string().default('No'),
        }),
    }),
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
    witnessed_by_signature4 : zod.string().min(1,"Witnessed by signature is required"),
    witnessed_by_name4 : zod.string().min(1,"Witnessed by name is required"),
    witnessed_by_date4 : zod.string().min(1,"Witnessed by date is required"),
    witnessed_by_company4 : zod.string().min(1,"Witnessed by company is required"),
});

// Define form data type
type FormData = zod.infer<typeof formSchema>;

const Form = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: FormData) => {
        console.log("Form Submitted:", data);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h4">Electrical Test Form</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Controller
                            name="name_of_client"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Name of Client"
                                    fullWidth
                                    error={!!errors.name_of_client}
                                    helperText={errors.name_of_client?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Location"
                                    fullWidth
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="date_of_test"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Date of Test"
                                    fullWidth
                                    error={!!errors.date_of_test}
                                    helperText={errors.date_of_test?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="make"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Make"
                                    fullWidth
                                    error={!!errors.make}
                                    helperText={errors.make?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="cable_rating"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Cable Rating"
                                    fullWidth
                                    error={!!errors.cable_rating}
                                    helperText={errors.cable_rating?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Typography marginTop={5} variant="h5">Insulation Resistance:</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Before HV Test</Typography>
                    </Grid>
                    {['R_E', 'Y_E', 'B_E', 'R_Y', 'Y_B', 'B_R'].map((fieldName) => (
                        <Grid item xs={6} key={fieldName}>
                            <Controller
                                name={`data.insulation_resistance.before_hv_test.${fieldName}` as keyof FormData}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={fieldName}
                                        fullWidth
                                        error={!!errors.data?.insulation_resistance?.before_hv_test?.[fieldName]}
                                        helperText={errors.data?.insulation_resistance?.before_hv_test?.[fieldName]?.message}
                                    />
                                )}
                            />
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Typography variant="subtitle1">After HV Test</Typography>
                    </Grid>
                    {['R_E', 'Y_E', 'B_E', 'R_Y', 'Y_B', 'B_R'].map((fieldName) => (
                        <Grid item xs={6} key={fieldName}>
                            <Controller
                                name={`data.insulation_resistance.after_hv_test.${fieldName}` as keyof FormData}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={fieldName}
                                        fullWidth
                                        error={!!errors.data?.insulation_resistance?.after_hv_test?.[fieldName]}
                                        helperText={errors.data?.insulation_resistance?.after_hv_test?.[fieldName]?.message}
                                    />
                                )}
                            />
                        </Grid>
                    ))}

                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Cables Found Healthy:</Typography>
                        <Controller
                            name="data.insulation_resistance.found_healthy"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ToggleButtonGroup
                                    value={value || 'No'} // Default value is 'No'
                                    exclusive
                                    onChange={(_, newValue) => onChange(newValue)}
                                >
                                    <ToggleButton value="Yes">Yes</ToggleButton>
                                    <ToggleButton value="No">No</ToggleButton>
                                </ToggleButtonGroup>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">General Inspection & Erection Completion checked : </Typography>
                        <Controller
                            name="data.insulation_resistance.general_inspection"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ToggleButtonGroup
                                    value={value || 'No'} // Default value is 'No'
                                    exclusive
                                    onChange={(_, newValue) => onChange(newValue)}
                                >
                                    <ToggleButton value="Yes">Yes</ToggleButton>
                                    <ToggleButton value="No">No</ToggleButton>
                                </ToggleButtonGroup>
                            )}
                        />
                    </Grid>
                </Grid>

                <Typography marginTop={10} variant="h5">Hi-Pot Test:</Typography>
                {['R_PH', 'Y_PH', 'B_PH'].map((phase) => (
                    <React.Fragment key={phase}>
                        <Grid my={2} marginTop={3} item xs={12}>
                            <Typography variant="subtitle1">{phase}</Typography>
                        </Grid>
                        <Grid container spacing={3}>
                        {['injected_voltage', 'leakage_current', 'time'].map((fieldName) => (
                            <Grid item xs={12} md={6} lg={4} key={fieldName}>
                                <Controller
                                    name={`data.hi_pot_test.${phase}.${fieldName}` as keyof FormData}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            {...(fieldName === 'time' ? { type: 'time' } : {})} // Set input type to number for 'time' field
                                            label={fieldName.replace('_', ' ').toUpperCase()}
                                            fullWidth
                                            error={!!errors.data?.hi_pot_test?.[phase]?.[fieldName]}
                                            helperText={errors.data?.hi_pot_test?.[phase]?.[fieldName]?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        ))}
                        </Grid>
                    </React.Fragment>
                ))}

                <Grid marginTop={5} container spacing={3}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">The cable withstood the test :</Typography>
                        <Controller
                            name="data.hi_pot_test.withstood_the_test"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ToggleButtonGroup
                                    value={value || 'No'}
                                    exclusive
                                    onChange={(_, newValue) => onChange(newValue)}
                                >
                                    <ToggleButton value="Yes">Yes</ToggleButton>
                                    <ToggleButton value="No">No</ToggleButton>
                                </ToggleButtonGroup>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Cables found healthy:</Typography>
                        <Controller
                            name="data.hi_pot_test.cable_found_healthy"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ToggleButtonGroup
                                    value={value || 'No'}
                                    exclusive
                                    onChange={(_, newValue) => onChange(newValue)}
                                >
                                    <ToggleButton value="Yes">Yes</ToggleButton>
                                    <ToggleButton value="No">No</ToggleButton>
                                </ToggleButtonGroup>
                            )}
                        />
                    </Grid>
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

        <Typography my={5} marginTop={5} variant="h5">Witnessed By 4</Typography>
        <Grid container spacing={2}>


        <Grid  item xs={12} md={6}>
            <Controller
                name="witnessed_by_signature4"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Signature"
                        fullWidth
                        error = {!!errors?.witnessed_by_signature4}
                        helperText={String(errors?.witnessed_by_signature4?.message)=="undefined" ? "" : String(errors?.witnessed_by_signature4?.message)}
                    />
                )}
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <Controller
                name="witnessed_by_name4"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Name"
                        fullWidth
                        error={!!errors?.witnessed_by_name4}
                        helperText={String(errors?.witnessed_by_name4?.message)=="undefined" ? "" : String(errors?.witnessed_by_name4?.message)}
                    />
                )}
            />
        </Grid>
        <Grid  item xs={12} md={6}>
            <Controller
                name="witnessed_by_date4"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors?.witnessed_by_date3}
                        helperText={String(errors?.witnessed_by_date4?.message)=="undefined" ? "" : String(errors?.witnessed_by_date4?.message) }
                    />
                )}
            />
        </Grid>
        <Grid item xs={12} md={6}>
            <Controller
                name="witnessed_by_company4"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Company"
                        fullWidth
                        error={!!errors?.witnessed_by_company4}
                        helperText={String(errors?.witnessed_by_company4?.message)=="undefined" ? "" : String(errors?.witnessed_by_company4?.message)}
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
    );
};

export default Form;
