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
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = zod.object({
    name_of_client: zod.string().min(1, 'Name of client is required').max(155, 'Name of client is too long'),
    location: zod.string().min(1, 'Location is required').max(155, 'Location is too long'),
    date_of_test: zod.string().min(1, 'Date of test is required').max(155, 'Date of test is too long'),
    tester_details: zod.object({
        make: zod.string().min(1, 'Make is required').max(155, 'Make is too long'),
        sl_no: zod.string().min(1, 'Sl No is required').max(155, 'Sl No is too long'),
        range: zod.string().min(1, 'Range is required').max(155, 'Range is too long'),
        calib_details: zod.string().min(1, 'Calib details is required').max(155, 'Calib details is too long'),
        earth_details: zod.array(zod.object({
            ep_connection_with_grid: zod.string().min(1, 'EP connection with grid is required').max(155, 'EP connection with grid is too long'),
            ep_connection_without_grid: zod.string().min(1, 'EP connection without grid is required').max(155, 'EP connection without grid is too long'),
            earth_pit_cover: zod.string().min(1, 'Earth pit cover is required').max(155, 'Earth pit cover is too long'),
            remarks: zod.string().min(1, 'Remarks is required').max(155, 'Remarks is too long'),
        })).length(16, { message: 'Earth details must have 16 items' }),
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
    witnessed_by_signature4 : zod.string().min(1,"Witnessed by signature is required"),
    witnessed_by_name4 : zod.string().min(1,"Witnessed by name is required"),
    witnessed_by_date4 : zod.string().min(1,"Witnessed by date is required"),
    witnessed_by_company4 : zod.string().min(1,"Witnessed by company is required"),

});

type FormData = zod.infer<typeof formSchema>;

const Form = () => {
    const { handleSubmit, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
    }

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>

            <Typography variant="h4">Earthing System</Typography>
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
                                error={!!errors?.name_of_client}
                                helperText={String(errors?.name_of_client?.message) === "undefined" ? "" : String(errors?.name_of_client?.message)}
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
                                error={!!errors?.location}
                                helperText={String(errors?.location?.message) === "undefined" ? "" : String(errors?.location?.message)}
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
                                error={!!errors?.date_of_test}
                                helperText={String(errors?.date_of_test?.message) === "undefined" ? "" : String(errors?.date_of_test?.message)}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Typography variant="h5">Earth Tester Details:</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Controller
                        name="tester_details.make"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Make"
                                fullWidth
                                error={!!errors?.tester_details?.make}
                                helperText={String(errors?.tester_details?.make?.message) === "undefined" ? "" : String(errors?.tester_details?.make?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="tester_details.sl_no"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Sl No"
                                fullWidth
                                error={!!errors?.tester_details?.sl_no}
                                helperText={String(errors?.tester_details?.sl_no?.message) === "undefined" ? "" : String(errors?.tester_details?.sl_no?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="tester_details.range"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Range"
                                fullWidth
                                error={!!errors?.tester_details?.range}
                                helperText={String(errors?.tester_details?.range?.message) === "undefined" ? "" : String(errors?.tester_details?.range?.message)}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Controller
                        name="tester_details.calib_details"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Calib Details"
                                fullWidth
                                error={!!errors?.tester_details?.calib_details}
                                helperText={String(errors?.tester_details?.calib_details?.message) === "undefined" ? "" : String(errors?.tester_details?.calib_details?.message)}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            <Typography variant="h5">Earth Details:</Typography>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((item, index) => (
                <Grid container spacing={3} key={index}>
                    <Grid item xs={12} md={12} lg={12}>
                    <Typography> EP - {index+1}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name={`tester_details.earth_details.${index}.ep_connection_with_grid`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="EP Connection with Grid"
                                    fullWidth
                                    error={!!errors?.tester_details?.earth_details?.[index]?.ep_connection_with_grid}
                                    helperText={String(errors?.tester_details?.earth_details?.[index]?.ep_connection_with_grid?.message) === "undefined" ? "" : String(errors?.tester_details?.earth_details?.[index]?.ep_connection_with_grid?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name={`tester_details.earth_details.${index}.ep_connection_without_grid`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="EP Connection without Grid"
                                    fullWidth
                                    error={!!errors?.tester_details?.earth_details?.[index]?.ep_connection_without_grid}
                                    helperText={String(errors?.tester_details?.earth_details?.[index]?.ep_connection_without_grid?.message) === "undefined" ? "" : String(errors?.tester_details?.earth_details?.[index]?.ep_connection_without_grid?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name={`tester_details.earth_details.${index}.earth_pit_cover`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Earth Pit Cover"
                                    fullWidth
                                    error={!!errors?.tester_details?.earth_details?.[index]?.earth_pit_cover}
                                    helperText={String(errors?.tester_details?.earth_details?.[index]?.earth_pit_cover?.message) === "undefined" ? "" : String(errors?.tester_details?.earth_details?.[index]?.earth_pit_cover?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name={`tester_details.earth_details.${index}.remarks`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Remarks"
                                    fullWidth
                                    error={!!errors?.tester_details?.earth_details?.[index]?.remarks}
                                    helperText={String(errors?.tester_details?.earth_details?.[index]?.remarks?.message) === "undefined" ? "" : String(errors?.tester_details?.earth_details?.[index]?.remarks?.message)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
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
}

export default Form;
