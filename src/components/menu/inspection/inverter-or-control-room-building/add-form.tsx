'use client';

import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Box, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';

import { Witness as WitnessType } from '@/types/user';
import { config } from '@/config';

const initialChecklistData = [
  {
    "sectionTitle": "General Checks",
    "items": [
      { "parameter": "Displays", "criteria": "Control room display board must be installed", "observation": "", "remarks": "" },
      { "parameter": "Lighting arrangement in Rooms", "criteria": "Lighting arrangement as per drawing/Agreement", "observation": "", "remarks": "" },
      { "parameter": "Ventilation to Battery room", "criteria": "Should be properly ventilated", "observation": "", "remarks": "" },
      { "parameter": "Safety Equipments", "criteria": "Safety equipment like Earth Mats, Fire extinguishers, Earth Rod, HV/LV Gloves, Danger Plates, Name Plate etc. as per BOQ.", "observation": "", "remarks": "" }
    ]
  },
  {
    "sectionTitle": "Civil Work",
    "items": [
      { "parameter": "Plaster finishing of the outer wall", "criteria": "Should have proper finishing, no jig-jag surface and cracks in the surface", "observation": "", "remarks": "" },
      { "parameter": "Wall painting", "criteria": "Should be painted with good quality of workmanship with the recommended color.", "observation": "", "remarks": "" },
      { "parameter": "Entrance door", "criteria": "Should be as per drawing, properly painted and working smoothly", "observation": "", "remarks": "" },
      { "parameter": "Inner side wall finish and painting", "criteria": "Should have proper finishing, no jig-jag surface and cracks in the surface", "observation": "", "remarks": "" },
      { "parameter": "Floor finishing", "criteria": "Should be as per drawing/Scope of work", "observation": "", "remarks": "" },
      { "parameter": "Trench construction", "criteria": "Should be as per drawing. Should be clean.", "observation": "", "remarks": "" },
      { "parameter": "Trench Covers", "criteria": "Proper trench covering.", "observation": "", "remarks": "" },
      { "parameter": "Ducting (if applicable)", "criteria": "Should be properly sealed at equipment and wall.", "observation": "", "remarks": "" },
      { "parameter": "Window/Air Inlets", "criteria": "Should be as per construction drawing", "observation": "", "remarks": "" },
      { "parameter": "Painting of the super structure if the roof is of roof sheet", "criteria": "Super structure should be painted.", "observation": "", "remarks": "" },
      { "parameter": "Sealing of the Roof Sheet at J Bolts and sheet joints", "criteria": "Proper sealing with recommended sealing material has to be done to avoid leakage of the roof ducting rain.", "observation": "", "remarks": "" },
      { "parameter": "Water Drainage from roof", "criteria": "Should be as per drawing / water fall should not be at the cable entry points.", "observation": "", "remarks": "" },
      { "parameter": "Sealing of cable entries to control room / Inverter Room", "criteria": "Properly sealed to avoid outside water to enter inside the control room/Inverter Room.", "observation": "", "remarks": "" },
      { "parameter": "Plinth Protection", "criteria": "Should be there as per construction drawing after proper compaction, No surface cracks on PCC.", "observation": "", "remarks": "" },
      { "parameter": "Gravel Filling at Inverter transformer Yard", "criteria": "Gravel filling must be done after compaction of loose soil by pouring sufficient water and using vibrator compactor., Minimum Gravel filling must be 100 mm or as per design", "observation": "", "remarks": "" },
      { "parameter": "Protection of Inverter transformer Yard", "criteria": "Fencing and gate must be installed before charging of the transformer.", "observation": "", "remarks": "" },
      { "parameter": "Cleanliness", "criteria": "All debris around the MCR/Inverter room must be removed, all cable trenches must be neat and clean", "observation": "", "remarks": "" }
    ]
  },
  {
    "sectionTitle": "Equipment Installation and Testing",
    "items": [
      { "parameter": "Equipment Installation and grouting", "criteria": "Should be as per Equipment Layout drawing and as per equipment manual", "observation": "", "remarks": "" },
      { "parameter": "Clearance from wall and roof", "criteria": "Should be as per equipment manual / equipment layout drawing", "observation": "", "remarks": "" },
      { "parameter": "Earthing of equipment", "criteria": "Each equipment should be connected to earth grid through two distinct earth connections. All cable trays must be earthed. All metallic parts should be earthed including each fencing pole, metallic gate etc. If the MCR/Inverter room is of pre-fab sheet made, the pre-fab sheets must be earthed.", "observation": "", "remarks": "" },
      { "parameter": "Pre-Commissioning Testing", "criteria": "Report has to be submitted for pre-commissioning testing of all equipment.", "observation": "", "remarks": "" },
      { "parameter": "Joints protection of the Earthing Strip", "criteria": "Should be properly welded (Min. 50 mm Covering) and protected by applying bituminous paint.", "observation": "", "remarks": "" },
      { "parameter": "Cable laying", "criteria": "All cables must be laid on cable trays inside trenches, LT cables must be in upper tier.", "observation": "", "remarks": "" },
      { "parameter": "Cable termination", "criteria": "All termination should be tight and cable glands are to be used for supporting cables with equipment. Bi-metallic lugs are to be used while connecting two distinct material made parts.", "observation": "", "remarks": "" },
      { "parameter": "Data Acquisition", "criteria": "Should be as per agreement.", "observation": "", "remarks": "" },
      { "parameter": "Equipment displays and Meters", "criteria": "Should be working properly as per requirement.", "observation": "", "remarks": "" },
      { "parameter": "Air Tight Sealing of equipment", "criteria": "All equipment doors must be air tight for protection from environmental impacts like dust, moisture etc.", "observation": "", "remarks": "" },
      { "parameter": "Safety Signs", "criteria": "All HV Equipment must have Safety signs.", "observation": "", "remarks": "" },
      { "parameter": "Identification", "criteria": "All equipment and cables must be properly identified.", "observation": "", "remarks": "" }
    ]
  }
];


// Form Type
type FormValues = {
  projectName: string;
  location: string;
  auditDate: string;
  sections: {
    sectionTitle: string;
    items: { parameter: string; criteria: string; observation: string; remarks: string }[];
  }[];
  witness1: number;
  witness2: number;
};

export const Form = () => {
  const [witnesses, setWitnesses] = useState<WitnessType[]>([]);
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    axios
      .get(`${config.site.serverURL}/api/auth/user/witness/?work_site_id=${localStorage.getItem('work-site-id')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
      })
      .then((response) => {
        setWitnesses(response.data);
      });
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      projectName: '',
      location: '',
      auditDate: '',
      sections: initialChecklistData,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (data.witness1 === data.witness2) {
      alert('Witness cannot be same');
      return;
    }
    console.log(data);

    setBtnDisabled(true);
    axios({
      method: 'POST',
      url: `${config.site.serverURL}/api/inspection/inverter-or-control-room-building/?work_site_id=${localStorage.getItem('work-site-id')}`,
      data: {
        date_of_audit: data.auditDate,
        project_name: data.projectName,
        location_or_area: data.location,
        witness_1: data.witness1,
        witness_2: data.witness2,
        checklists: data.sections,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` },
    })
      .then((response) => {
        if (response.status === 201) {
          window.alert('Inverter Room or control rool building Report Added');
          setTimeout(() => {
            window.location.href = '/menu/inspection/room-inverter?status=approved';
          }, 500);
        }
      })
      .catch((error) => {
        setBtnDisabled(false);
        window.alert('Something went wrong!');
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Project Name Field */}
        <Controller
          name="projectName"
          control={control}
          rules={{ required: 'Project Name is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Project Name"
              fullWidth
              margin="normal"
              error={!!errors.projectName}
              helperText={errors.projectName ? errors.projectName.message : ''}
            />
          )}
        />

        {/* Location Field */}
        <Controller
          name="location"
          control={control}
          rules={{ required: 'Location is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Location"
              fullWidth
              margin="normal"
              error={!!errors.location}
              helperText={errors.location ? errors.location.message : ''}
            />
          )}
        />

        {/* Audit Date Field */}
        <Controller
          name="auditDate"
          control={control}
          rules={{ required: 'Audit Date is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Audit Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              error={!!errors.auditDate}
              helperText={errors.auditDate ? errors.auditDate.message : ''}
            />
          )}
        />

        {/* Render Sections Dynamically */}
        {initialChecklistData.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ marginTop: '16px' }}>
            <Typography variant="h5" gutterBottom>
              Section {section.sectionTitle}
            </Typography>
            <br />

            {/* Render Items for Each Section */}
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} style={{ marginBottom: '16px' }}>
                <Typography  gutterBottom>
                  <strong> Parameter: </strong> {item.parameter}
                </Typography>
                <Typography gutterBottom>
                  <strong> Criteria: </strong> {item.criteria}
                </Typography>

                {/* Observation Field */}
                <Controller
                  name={`sections.${sectionIndex}.items.${itemIndex}.observation`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Observation"
                      fullWidth
                      margin="normal"
                      error={!!errors.sections?.[sectionIndex]?.items?.[itemIndex]?.observation}
                      helperText={
                        errors.sections?.[sectionIndex]?.items?.[itemIndex]?.observation
                          ? 'Observation is required'
                          : ''
                      }
                      required
                    />
                  )}
                />

                {/* Remarks Field */}
                <Controller
                  name={`sections.${sectionIndex}.items.${itemIndex}.remarks`}
                  control={control}
                  render={({ field }) => <TextField {...field} label="Remarks" fullWidth margin="normal" required />}
                />
              </div>
            ))}
          </div>
        ))}


        {/* Witnesses */}
        <Grid container spacing={2} style={{ marginTop: '24px' }}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="witness1"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={witnesses}
                getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Auditor"
                    variant="outlined"
                    fullWidth
                    error={!!errors.witness1}
                    helperText={errors.witness1 ? 'Auditor is required' : ''}
                  />
                )}
                value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                onChange={(e, newValue) => {
                  field.onChange(newValue?.id || null);
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="witness2"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={witnesses}
                getOptionLabel={(witness) => `${witness.username} (${witness.company})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Auditee"
                    variant="outlined"
                    fullWidth
                    error={!!errors.witness2}
                    helperText={errors.witness2 ? 'Auditee is required' : ''}
                  />
                )}
                value={field.value !== null ? witnesses.find((witness) => witness.id === field.value) : null}
                onChange={(e, newValue) => {
                  field.onChange(newValue?.id || null);
                }}
              />
            )}
          />
        </Grid>
      </Grid>

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '24px' }} disabled={btnDisabled}>
          Submit Checklist
        </Button>
      </form>
    </Box>
  );
};
