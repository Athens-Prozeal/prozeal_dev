'use client';

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
    date: zod.string().nonempty('Date is required'),
    project_name: zod.string().nonempty('Project Name is required'),
    project_location: zod.string().nonempty('Project Location is required'),
    rfi_no: zod.string().nonempty('RFI No is required'),
    contractor_name: zod.string().nonempty('Contractor Name is required'),
    offered_date: zod.string().nonempty('Offered Date is required'),
    datas: zod.object({
        details_of_work: zod.array(
            zod.object({
                block_no: zod.string().nonempty('Block No is required'),
                table_no: zod.string().nonempty('Table No is required'),
                activity_description: zod.string().nonempty('Activity Description is required'),
                hold_details: zod.string().optional(),
            })
        ),
        building_data: zod.object({
            building_name: zod.string().nonempty('Building Name is required'),
            construction_activity: zod.string().nonempty('Construction Activity is required'),
            contractors_signature: zod.string().nonempty('Contractor\'s Signature is required'),
            contractors_name: zod.string().nonempty('Contractor\'s Name is required'),
            contractor_date: zod.string().nonempty('Contractor\'s Date is required'),
            construction_engineer_signature: zod.string().nonempty('Construction Engineer\'s Signature is required'),
            construction_engineer_name: zod.string().nonempty('Construction Engineer\'s Name is required'),
            construction_engineer_date: zod.string().nonempty('Construction Engineer\'s Date is required'),
        }),
        disposition: zod.object({
            released_check: zod.string().nonempty('Released Check is required'),
            offered_time: zod.string().nonempty('Offered Time is required'),
            sort: zod.string().nonempty('Sort is required'),
            site_reaching_time: zod.string().nonempty('Site Reaching Time is required'),
            deviate: zod.string().nonempty('Deviate is required'),
            reject_hold: zod.string().nonempty('Reject Hold is required'),
            inspection_end_time: zod.string().nonempty('Inspection End Time is required'),
        }),
        observed_non_conformance_statement: zod.string().optional(),
        next_steps: zod.object({
            actions: zod.string().nonempty('Actions is required'),
            responsibility: zod.string().nonempty('Responsibility is required'),
            timelines: zod.string().nonempty('Timelines is required'),
            remarks: zod.string().nonempty('Remarks is required'),
        }),
    }),
    contractor_signature: zod.string().nonempty('Contractor\'s Signature is required'),
    contractor_date: zod.string().nonempty('Contractor\'s Signature Date is required'),
    construction_incharge_signature: zod.string().nonempty('Construction Incharge\'s Signature is required'),
    construction_incharge_date: zod.string().nonempty('Construction Incharge\'s Signature Date is required'),
    qa_engineer_signature: zod.string().nonempty('QA Engineer\'s Signature is required'),
    qa_engineer_date: zod.string().nonempty('QA Engineer\'s Signature Date is required'),
});

type FormData = zod.infer<typeof formSchema>;

const Form = () => {
    const { handleSubmit, control,watch,setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data : FormData) => {
        console.log(data);
    };

    const detailsOfWork = watch('datas.details_of_work') || [];

    const addDetail = () => {
        const newDetails = [...detailsOfWork, { block_no: '', table_no: '', activity_description: '' }];
        setValue('datas.details_of_work', newDetails);
    };

    const removeDetail = (index : any) => {
        const newDetails = detailsOfWork.filter((_, i) => i !== index);
        setValue('datas.details_of_work', newDetails);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography my={5} variant="h4" gutterBottom>Project Information</Typography>
                <Grid  container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Date"
                                    type="date"
                                    InputLabelProps={{shrink : true}}
                                    fullWidth
                                    error={!!errors.date}
                                    helperText={String(errors.date?.message) === "undefined" ? "" : String(errors.date?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="project_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Project Name"
                                    fullWidth
                                    error={!!errors.project_name}
                                    helperText={String(errors.project_name?.message) === "undefined" ? "" : String(errors.project_name?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="project_location"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Project Location"
                                    fullWidth
                                    error={!!errors.project_location}
                                    helperText={String(errors.project_location?.message) === "undefined" ? "" : String(errors.project_location?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="rfi_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="RFI No"
                                    fullWidth
                                    error={!!errors.rfi_no}
                                    helperText={String(errors.rfi_no?.message) === "undefined" ? "" : String(errors.rfi_no?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="contractor_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Contractor Name"
                                    fullWidth
                                    error={!!errors.contractor_name}
                                    helperText={String(errors.contractor_name?.message) === "undefined" ? "" : String(errors.contractor_name?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="offered_date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Offered Date"
                                    type="date"
                                    InputLabelProps={{shrink : true}}
                                    fullWidth
                                    error={!!errors.offered_date}
                                    helperText={String(errors.offered_date?.message) === "undefined" ? "" : String(errors.offered_date?.message)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Typography my={5} variant="h5" gutterBottom>Details of Work</Typography>
                <Controller
                name="datas.details_of_work"
                control={control}
                render={({ field }) => (
                    <Box sx={{ marginBottom: 2 }}>
                        {detailsOfWork.map((_, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`datas.details_of_work.${index}.block_no`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Block No"
                                                fullWidth
                                                error={!!errors.datas?.details_of_work?.[index]?.block_no}
                                                helperText={errors.datas?.details_of_work?.[index]?.block_no?.message || ""}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`datas.details_of_work.${index}.table_no`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Table No"
                                                fullWidth
                                                error={!!errors.datas?.details_of_work?.[index]?.table_no}
                                                helperText={errors.datas?.details_of_work?.[index]?.table_no?.message || ""}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`datas.details_of_work.${index}.activity_description`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Activity Description"
                                                fullWidth
                                                error={!!errors.datas?.details_of_work?.[index]?.activity_description}
                                                helperText={errors.datas?.details_of_work?.[index]?.activity_description?.message || ""}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller
                                        name={`datas.details_of_work.${index}.hold_details`}
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Hold Details If Any (Optional)"
                                                fullWidth
                                                error={!!errors.datas?.details_of_work?.[index]?.hold_details}
                                                helperText={errors.datas?.details_of_work?.[index]?.hold_details?.message || ""}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="outlined" color="secondary" onClick={() => removeDetail(index)}>
                                        Remove
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}
                        <Button variant="contained" color="primary" onClick={addDetail}>
                            Add Detail
                        </Button>
                    </Box>
                )}
            />

                <Typography my={7} variant="h5" gutterBottom>Building Data</Typography>
                <Controller
                    name="datas.building_data"
                    control={control}
                    render={({ field }) => (
                        <Box sx={{ marginBottom: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.building_name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Building Name"
                                                fullWidth
                                                error={!!errors.datas?.building_data?.building_name}
                                                helperText={String(errors.datas?.building_data?.building_name?.message) === "undefined" ? "" : String(errors.datas?.building_data?.building_name?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.construction_activity"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Construction Activity"
                                                fullWidth
                                                error={!!errors.datas?.building_data?.construction_activity}
                                                helperText={String(errors.datas?.building_data?.construction_activity?.message) === "undefined" ? "" : String(errors.datas?.building_data?.construction_activity?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} >
                                <Typography  variant="h6" gutterBottom>Contractor Signature, name, date</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.contractors_signature"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contractor's Signature"
                                                fullWidth
                                                error={!!errors.datas?.building_data?.contractors_signature}
                                                helperText={String(errors.datas?.building_data?.contractors_signature?.message) === "undefined" ? "" : String(errors.datas?.building_data?.contractors_signature?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.contractors_name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contractor's Name"
                                                fullWidth
                                                error={!!errors.datas?.building_data?.contractors_name}
                                                helperText={String(errors.datas?.building_data?.contractors_name?.message) === "undefined" ? "" : String(errors.datas?.building_data?.contractors_name?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.contractor_date"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Contractor's Date"
                                                type="date"
                                    InputLabelProps={{shrink : true}}
                                                fullWidth
                                                error={!!errors.datas?.building_data?.contractor_date}
                                                helperText={String(errors.datas?.building_data?.contractor_date?.message) === "undefined" ? "" : String(errors.datas?.building_data?.contractor_date?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} >
                                <Typography  variant="h6" gutterBottom>Prozeal Construction Engineer Signature, name, date</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>

                                    <Controller
                                        name="datas.building_data.construction_engineer_signature"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Construction Engineer's Signature"
                                                fullWidth
                                                error={!!errors.datas?.building_data?.construction_engineer_signature}
                                                helperText={String(errors.datas?.building_data?.construction_engineer_signature?.message) === "undefined" ? "" : String(errors.datas?.building_data?.construction_engineer_signature?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.construction_engineer_name"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Construction Engineer's Name"
                                                fullWidth
                                                error={!!errors.datas?.building_data?.construction_engineer_name}
                                                helperText={String(errors.datas?.building_data?.construction_engineer_name?.message) === "undefined" ? "" : String(errors.datas?.building_data?.construction_engineer_name?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.building_data.construction_engineer_date"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Construction Engineer's Date"
                                                type="date"
                                    InputLabelProps={{shrink : true}}
                                                fullWidth
                                                error={!!errors.datas?.building_data?.construction_engineer_date}
                                                helperText={String(errors.datas?.building_data?.construction_engineer_date?.message) === "undefined" ? "" : String(errors.datas?.building_data?.construction_engineer_date?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                />

                <Typography marginTop={10} variant="h5" gutterBottom>Disposition</Typography>
                <Controller
                    name="datas.disposition"
                    control={control}
                    render={({ field }) => (
                        <Box sx={{ marginBottom: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.released_check"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Released Check"
                                                fullWidth
                                                error={!!errors.datas?.disposition?.released_check}
                                                helperText={String(errors.datas?.disposition?.released_check?.message) === "undefined" ? "" : String(errors.datas?.disposition?.released_check?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.offered_time"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Offered Time"
                                                type="time"
                                                InputLabelProps={{shrink : true}}
                                                fullWidth
                                                error={!!errors.datas?.disposition?.offered_time}
                                                helperText={String(errors.datas?.disposition?.offered_time?.message) === "undefined" ? "" : String(errors.datas?.disposition?.offered_time?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.sort"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Sort"
                                                fullWidth
                                                error={!!errors.datas?.disposition?.sort}
                                                helperText={String(errors.datas?.disposition?.sort?.message) === "undefined" ? "" : String(errors.datas?.disposition?.sort?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.site_reaching_time"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Site Reaching Time"
                                                fullWidth
                                                type="time"
                                                InputLabelProps={{shrink : true}}
                                                error={!!errors.datas?.disposition?.site_reaching_time}
                                                helperText={String(errors.datas?.disposition?.site_reaching_time?.message) === "undefined" ? "" : String(errors.datas?.disposition?.site_reaching_time?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.deviate"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Deviate"
                                                fullWidth
                                                error={!!errors.datas?.disposition?.deviate}
                                                helperText={String(errors.datas?.disposition?.deviate?.message) === "undefined" ? "" : String(errors.datas?.disposition?.deviate?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.reject_hold"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Reject Hold"
                                                fullWidth
                                                error={!!errors.datas?.disposition?.reject_hold}
                                                helperText={String(errors.datas?.disposition?.reject_hold?.message) === "undefined" ? "" : String(errors.datas?.disposition?.reject_hold?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.disposition.inspection_end_time"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Inspection End Time"
                                                fullWidth
                                                type="time"
                                                InputLabelProps={{shrink : true}}
                                                error={!!errors.datas?.disposition?.inspection_end_time}
                                                helperText={String(errors.datas?.disposition?.inspection_end_time?.message) === "undefined" ? "" : String(errors.datas?.disposition?.inspection_end_time?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                />



                <Typography marginTop={10} variant="h5" gutterBottom>Next Steps</Typography>
                <Controller
                    name="datas.next_steps"
                    control={control}
                    render={({ field }) => (
                        <Box sx={{ marginBottom: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.next_steps.actions"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Actions"
                                                fullWidth
                                                error={!!errors.datas?.next_steps?.actions}
                                                helperText={String(errors.datas?.next_steps?.actions?.message) === "undefined" ? "" : String(errors.datas?.next_steps?.actions?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.next_steps.responsibility"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Responsibility"
                                                fullWidth
                                                error={!!errors.datas?.next_steps?.responsibility}
                                                helperText={String(errors.datas?.next_steps?.responsibility?.message) === "undefined" ? "" : String(errors.datas?.next_steps?.responsibility?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.next_steps.timelines"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Timelines"
                                                fullWidth
                                                error={!!errors.datas?.next_steps?.timelines}
                                                helperText={String(errors.datas?.next_steps?.timelines?.message) === "undefined" ? "" : String(errors.datas?.next_steps?.timelines?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="datas.next_steps.remarks"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Remarks"
                                                fullWidth
                                                error={!!errors.datas?.next_steps?.remarks}
                                                helperText={String(errors.datas?.next_steps?.remarks?.message) === "undefined" ? "" : String(errors.datas?.next_steps?.remarks?.message)}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                />

                <Typography marginTop={10} variant="h5" gutterBottom>Signatures</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="contractor_signature"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Contractor's Signature"
                                    fullWidth
                                    error={!!errors.contractor_signature}
                                    helperText={String(errors.contractor_signature?.message) === "undefined" ? "" : String(errors.contractor_signature?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="contractor_date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="date"
                                    InputLabelProps={{shrink : true}}
                                    label="Contractor's Signature Date"
                                    fullWidth
                                    error={!!errors.contractor_date}
                                    helperText={String(errors.contractor_date?.message) === "undefined" ? "" : String(errors.contractor_date?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="construction_incharge_signature"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Construction Incharge's Signature"
                                    fullWidth
                                    error={!!errors.construction_incharge_signature}
                                    helperText={String(errors.construction_incharge_signature?.message) === "undefined" ? "" : String(errors.construction_incharge_signature?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="construction_incharge_date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Construction Incharge's Signature Date"
                                    type="date"
                                    InputLabelProps={{shrink : true}}
                                    fullWidth
                                    error={!!errors.construction_incharge_date}
                                    helperText={String(errors.construction_incharge_date?.message) === "undefined" ? "" : String(errors.construction_incharge_date?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="qa_engineer_signature"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="QA Engineer's Signature"
                                    fullWidth
                                    error={!!errors.qa_engineer_signature}
                                    helperText={String(errors.qa_engineer_signature?.message) === "undefined" ? "" : String(errors.qa_engineer_signature?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="qa_engineer_date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="QA Engineer's Signature Date"
                                    fullWidth
                                    type="date"
                                    InputLabelProps={{shrink : true}}
                                    error={!!errors.qa_engineer_date}
                                    helperText={String(errors.qa_engineer_date?.message) === "undefined" ? "" : String(errors.qa_engineer_date?.message)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 3 }}>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default Form;
function setValue(arg0: string, newDetails: any) {
    throw new Error('Function not implemented.');
}

