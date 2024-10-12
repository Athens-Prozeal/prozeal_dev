'use client';

import React, { useEffect, useState } from 'react';
import zod from 'zod';
import { useForm, Controller } from 'react-hook-form';
import {
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    Container,
    ToggleButtonGroup,
    ToggleButton,
    MenuItem,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';


import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';


const formSchema = zod.object({
    drawing_specification_no: zod.string().nonempty("Drawing specification number is required"),
    serial_no: zod.string().nonempty("Serial number is required"),
    site_location_area: zod.string().nonempty("Site location area is required"),

    // check list items
    check_list : zod.object({
    check_points1: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(8, 'Please select 8 check points'),
    buchholz_relay: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(4, 'Please select 4 check points'),
    breather: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(5, 'Please select 5 check points'),
    bushing: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(5, 'Please select 5 check points'),

    radiator: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(2, 'Please select 2 check points'),
    air_release_form: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(5, 'Please select 4 check points'),
    instruments: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(6, 'Please select 6 check points'),
    check_points2: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(3, 'Please select 3 check points'),
    bus_duct: zod.array(zod.object({
        status: zod.string().default('N/A'),
        remarks: zod.string().optional(),
    })).length(2, 'Please select 4 check points').optional(),
  }),
  witness1: zod.number().optional(),
  witness2: zod.number().optional(),
  witness3: zod.number().optional(),

    // checked  and witness

    // checked_by_1_signature: zod.string().nonempty("Signature is required"),
    // checked_by_1_name: zod.string().nonempty("Name is required"),
    // checked_by_1_date: zod.string().nonempty("Date is required"),
    // checked_by_1_company: zod.string().nonempty("Company is required"),

    // witnessed_by_1: zod.array(zod.object({
    //     signature: zod.string().nonempty("Signature is required"),
    //     name: zod.string().nonempty("Name is required"),
    //     date: zod.string().nonempty("Date is required"),
    //     company: zod.string().nonempty("Company is required"),
    // })).length(3, 'Please select 3 witnesses'),


    // checked_by_2_signature: zod.string().nonempty("Signature is required"),
    // checked_by_2_name: zod.string().nonempty("Name is required"),
    // checked_by_2_date: zod.string().nonempty("Date is required"),
    // checked_by_2_company: zod.string().nonempty("Company is required"),


    // witnessed_by_2: zod.array(zod.object({
    //     signature: zod.string().nonempty("Signature is required"),
    //     name: zod.string().nonempty("Name is required"),
    //     date: zod.string().nonempty("Date is required"),
    //     company: zod.string().nonempty("Company is required"),
    // })).length(3, 'Please select 3 witnesses'),

});


type FormValues = zod.infer<typeof formSchema>;

const Form = () => {
  const [witnesses, setWitnesses] = useState<WitnessType[]>([]);


  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/auth/user/witness/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        setWitnesses(response.data);
      });
  }, []);

    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data : FormValues) => {
        console.log(data);
    };

    return (
        <Container>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} my={3}>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="drawing_specification_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Drawing Specification No"
                                    fullWidth
                                    error={!!errors?.drawing_specification_no}
                                    helperText={String(errors?.drawing_specification_no?.message) === "undefined" ? "" : String(errors?.drawing_specification_no?.message)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="serial_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Serial No"
                                    fullWidth
                                    error={!!errors?.serial_no}
                                    helperText={String(errors?.serial_no?.message) === "undefined" ? "" : String(errors?.serial_no?.message)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} my={3}>
                    <Grid item xs={12}>
                        <Controller
                            name="site_location_area"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Site Location Area"
                                    fullWidth
                                    error={!!errors?.site_location_area}
                                    helperText={String(errors?.site_location_area?.message) === "undefined" ? "" : String(errors?.site_location_area?.message)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h5">Check Points </Typography>
                {[
                    "Check the Trafo Ratings & Make as per approved drawings / specifications",
                    "Check for correctness of Foundation, Co-ordinates, Location, Level alignment as per drawings",
                    "Check for Installation as per equipment Tag no., Area of classification, layout drawing",
                    "Check for Transformer centre line, level, roller stopper, anti-seismic mounting plate provided",
                    "Assembly of all accessories and fittings completed",
                    "Oil/Winding temperature gauges/relays installed",
                    "Check Transformer oil level in tank and conservator",
                    "Ensure the check_list.radiator gasket are changed by new one"
                ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{index+1}:  {item}</Typography>


                        <Controller
                            name={`check_list.check_points1.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.check_points1.${index}.remarks`}
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
                    </Box>
                ))}


                <Typography variant="h5">9 : Buchholz relay </Typography>
                {[
                    "Piping as per drawing",
                    "Arrow towards conservator",
                    "Float element free",
                    "Mercury Switches intact"
                    ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.buchholz_relay.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.buchholz_relay.${index}.remarks`}
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
                    </Box>
                ))}



                <Typography variant="h5">10 : Breather </Typography>
                {[
                "Piping to conservator as per drawing",
                "Silica gel colour blue",
                "Air entry hole open",
                "Oil filled in bottom compartment",
                "Explosion vents - Both are installed and diaphragms intact"
                ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.breather.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.breather.${index}.remarks`}
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
                    </Box>
                ))}

                <Typography variant="h5">11 : Bushing </Typography>
                {[
                    "No cracks seen",
                    "Air Released",
                    "Arcing horn gaps as per drawing",
                    "All gaskets intact an new",
                    "Oil level gauge in consrevator is calibrated & functioning"
                    ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.bushing.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.bushing.${index}.remarks`}
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
                    </Box>
                ))}
                <Typography variant="h5">12 : Raditor </Typography>
                {[
                    "Check for valves are open",
                    "Check for no leakage at fingers & joints"
                    ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.radiator.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.radiator.${index}.remarks`}
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
                    </Box>
                ))}
                <Typography variant="h5">13 : Air release from </Typography>
                {[
                    "check_list.Radiator",
                    "check_list.Bushings",
                    "Buchholz relay",
                    "Transformer tank",
                    "OLTC Tank & Surge relay"
                    ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.air_release_form.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.air_release_form.${index}.remarks`}
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
                    </Box>
                ))}

<Typography variant="h5">14 : Instruments ( OTI & WTI ) </Typography>
                {[

                    "Bulb inserted in pocket in Marshalling box",
                    "check_list.Breather Pocket filled with oil",
                    "Marshalling box installed and connected",
                    "Tap Changer manual operation is free",
                    "Proper Control & Communication cables termination",
                    "Cable dressing & Connections checked for Cable supports, clamps"
                ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.instruments.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.instruments.${index}.remarks`}
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
                    </Box>
                ))}

                {[
                    "Bolted electrical connections clearly marked as per drawing",
                    "All unwanted materials cleared, and Transformer kept clean",
                    "Paint touch-ups applied wherever applicable"
                ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{index+15}:  {item}</Typography>


                        <Controller
                            name={`check_list.check_points2.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.check_points2.${index}.remarks`}
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
                    </Box>
                ))}

                <Typography variant="h5">18 : Bus Duct </Typography>
                {[
                    "LV bus alignment & tightness to be check",
                    "Busduct properly closed & tightened"
                ].map((item, index) => (

                    <Box my={6} key={index}>
                        <Typography my={2} variant="body1">{String.fromCharCode(65+index)}:  {item}</Typography>


                        <Controller
                            name={`check_list.bus_duct.${index}.status`}
                            control={control}
                            render={({ field }) => (
                                <ToggleButtonGroup
                                    exclusive
                                    value={field.value || 'N/A'}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                >
                                    {["Yes", "No", "N/A"].map((value) => (
                                        <ToggleButton key={value} value={value}>
                                            {value}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            )}
                        />
                        <Controller
                            name={`check_list.bus_duct.${index}.remarks`}
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
                    </Box>
                ))}
  <Grid container spacing={2} my={3}>
<Grid item xs={12} sm={12} md={12}>
            <Typography variant="h6">Witnesses</Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="witness1"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  select
                  label="Witness 1"
                  variant="outlined"
                  fullWidth
                  error={!!errors.witness1}
                  helperText={errors.witness1?.message}
                >
                  {witnesses?.map((witness) => (
                    <MenuItem key={witness.id} value={witness.id}>
                      {witness.username} ({witness.company})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="witness2"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  select
                  label="Witness 2"
                  variant="outlined"
                  fullWidth
                  error={!!errors.witness2}
                  helperText={errors.witness2?.message}
                >
                  {witnesses?.map((witness) => (
                    <MenuItem key={witness.id} value={witness.id}>
                      {witness.username} ({witness.company})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Controller
              name="witness3"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  {...field}
                  select
                  label="Witness 3"
                  variant="outlined"
                  fullWidth
                  error={!!errors.witness3}
                  helperText={errors.witness3?.message}
                >
                  {witnesses?.map((witness) => (
                    <MenuItem key={witness.id} value={witness.id}>
                      {witness.username} ({witness.company})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>

                {/* <Typography variant="h5">Checked By </Typography>
                <Grid my={5} container spacing={2} >
                <Grid item xs={12} md={6}>
                <Controller
                                    name={`checked_by_1_signature`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by Signature`}
                                            fullWidth
                                            error={!!errors?.checked_by_1_signature}
                                            helperText={String(errors?.checked_by_1_signature?.message) === "undefined" ? "" : String(errors?.checked_by_1_signature?.message)}
                                        />
                                    )}
                                />
                </Grid>
                <Grid item xs={12} md={6}>
                <Controller
                                    name={`checked_by_1_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by name`}
                                            fullWidth
                                            error={!!errors?.checked_by_1_name}
                                            helperText={String(errors?.checked_by_1_name?.message) === "undefined" ? "" : String(errors?.checked_by_1_name?.message)}
                                        />
                                    )}
                                />
                </Grid>
                <Grid item xs={12} md={6}>
                <Controller
                                    name={`checked_by_1_date`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by date`}
                                            fullWidth
                                            type="date"
                                            InputLabelProps={{shrink: true}}
                                            error={!!errors?.checked_by_1_date}
                                            helperText={String(errors?.checked_by_1_date?.message) === "undefined" ? "" : String(errors?.checked_by_1_date?.message)}
                                        />
                                    )}
                                />
                </Grid>
                <Grid item xs={12} md={6}>
                        <Controller
                                    name={`checked_by_1_company`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by company`}
                                            fullWidth

                                            error={!!errors?.checked_by_1_company}
                                            helperText={String(errors?.checked_by_1_company?.message) === "undefined" ? "" : String(errors?.checked_by_1_company?.message)}
                                        />
                                    )}
                                />
                </Grid>
            </Grid>


<Typography variant="h5">Witnessed By</Typography>
{[1, 2, 3].map((item, index) => (
    <Grid my={5} container spacing={2} key={index}>
        <Grid item xs={12} md={6}>
        <Controller
                            name={`witnessed_by_1.${index}.signature`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} Signature`}
                                    fullWidth
                                    error={!!errors?.witnessed_by_1?.[index]?.signature}
                                    helperText={String(errors?.witnessed_by_1?.[index]?.signature?.message) === "undefined" ? "" : String(errors?.witnessed_by_1?.[index]?.signature?.message)}
                                />
                            )}
                        />
        </Grid>
        <Grid item xs={12} md={6}>
        <Controller
                            name={`witnessed_by_1.${index}.name`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} name`}
                                    fullWidth
                                    error={!!errors?.witnessed_by_1?.[index]?.name}
                                    helperText={String(errors?.witnessed_by_1?.[index]?.name?.message) === "undefined" ? "" : String(errors?.witnessed_by_1?.[index]?.name?.message)}
                                />
                            )}
                        />
        </Grid>
        <Grid item xs={12} md={6}>
        <Controller
                            name={`witnessed_by_1.${index}.date`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} date`}
                                    fullWidth
                                    type="date"
                                    InputLabelProps={{shrink: true}}
                                    error={!!errors?.witnessed_by_1?.[index]?.date}
                                    helperText={String(errors?.witnessed_by_1?.[index]?.date?.message) === "undefined" ? "" : String(errors?.witnessed_by_1?.[index]?.date?.message)}
                                />
                            )}
                        />
        </Grid>
        <Grid item xs={12} md={6}>
                <Controller
                            name={`witnessed_by_1.${index}.company`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} company`}
                                    fullWidth

                                    error={!!errors?.witnessed_by_1?.[index]?.company}
                                    helperText={String(errors?.witnessed_by_1?.[index]?.company?.message) === "undefined" ? "" : String(errors?.witnessed_by_1?.[index]?.date?.message)}
                                />
                            )}
                        />
        </Grid>
    </Grid>
))}




<Typography variant="h5">Checked By </Typography>
                <Grid my={5} container spacing={2} >
                <Grid item xs={12} md={6}>
                <Controller
                                    name={`checked_by_2_signature`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by Signature`}
                                            fullWidth
                                            error={!!errors?.checked_by_2_signature}
                                            helperText={String(errors?.checked_by_2_signature?.message) === "undefined" ? "" : String(errors?.checked_by_2_signature?.message)}
                                        />
                                    )}
                                />
                </Grid>
                <Grid item xs={12} md={6}>
                <Controller
                                    name={`checked_by_2_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by name`}
                                            fullWidth
                                            error={!!errors?.checked_by_2_name}
                                            helperText={String(errors?.checked_by_2_name?.message) === "undefined" ? "" : String(errors?.checked_by_2_name?.message)}
                                        />
                                    )}
                                />
                </Grid>
                <Grid item xs={12} md={6}>
                <Controller
                                    name={`checked_by_2_date`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by date`}
                                            fullWidth
                                            type="date"
                                            InputLabelProps={{shrink: true}}
                                            error={!!errors?.checked_by_2_date}
                                            helperText={String(errors?.checked_by_2_date?.message) === "undefined" ? "" : String(errors?.checked_by_2_date?.message)}
                                        />
                                    )}
                                />
                </Grid>
                <Grid item xs={12} md={6}>
                        <Controller
                                    name={`checked_by_2_company`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={`Checked by company`}
                                            fullWidth

                                            error={!!errors?.checked_by_2_company}
                                            helperText={String(errors?.checked_by_2_company?.message) === "undefined" ? "" : String(errors?.checked_by_2_company?.message)}
                                        />
                                    )}
                                />
                </Grid>
            </Grid>


<Typography variant="h5">Witnessed By</Typography>
{[1, 2, 3].map((item, index) => (
    <Grid my={5} container spacing={2} key={index}>
        <Grid item xs={12} md={6}>
        <Controller
                            name={`witnessed_by_2.${index}.signature`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} Signature`}
                                    fullWidth
                                    error={!!errors?.witnessed_by_2?.[index]?.signature}
                                    helperText={String(errors?.witnessed_by_2?.[index]?.signature?.message) === "undefined" ? "" : String(errors?.witnessed_by_2?.[index]?.signature?.message)}
                                />
                            )}
                        />
        </Grid>
        <Grid item xs={12} md={6}>
        <Controller
                            name={`witnessed_by_2.${index}.name`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} name`}
                                    fullWidth
                                    error={!!errors?.witnessed_by_2?.[index]?.name}
                                    helperText={String(errors?.witnessed_by_2?.[index]?.name?.message) === "undefined" ? "" : String(errors?.witnessed_by_2?.[index]?.name?.message)}
                                />
                            )}
                        />
        </Grid>
        <Grid item xs={12} md={6}>
        <Controller
                            name={`witnessed_by_2.${index}.date`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} date`}
                                    fullWidth
                                    type="date"
                                    InputLabelProps={{shrink: true}}
                                    error={!!errors?.witnessed_by_2?.[index]?.date}
                                    helperText={String(errors?.witnessed_by_2?.[index]?.date?.message) === "undefined" ? "" : String(errors?.witnessed_by_2?.[index]?.date?.message)}
                                />
                            )}
                        />
        </Grid>
        <Grid item xs={12} md={6}>
                <Controller
                            name={`witnessed_by_2.${index}.company`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={`Witness ${index+1} company`}
                                    fullWidth

                                    error={!!errors?.witnessed_by_2?.[index]?.company}
                                    helperText={String(errors?.witnessed_by_2?.[index]?.company?.message) === "undefined" ? "" : String(errors?.witnessed_by_2?.[index]?.date?.message)}
                                />
                            )}
                        />
        </Grid>
    </Grid>
))} */}


                {/* Add fields for date and company similarly */}

                <Button type="submit" variant="contained" color="primary">Submit</Button>
            </form>
        </Container>
    );
};

export default Form;
