import clsx from 'clsx';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { countries } from './countries';
import { UploadAvatar } from 'src/components/Upload';
import { Form, FormikProvider } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Card,
  Switch,
  TextField,
  CardContent,
  FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

General.propTypes = {
  className: PropTypes.string,
  OrgFormik: PropTypes.object
};

function General({ className, OrgFormik }) {
  const classes = useStyles();
  const serviceTypes = [
    { id: 1, name: 'Private' },
    { id: 2, name: 'Public' }
  ];
  const orgTypes = [
    { id: 1, name: 'National' },
    { id: 2, name: 'International' }
  ];

  const { organizationsList: ORG } = useSelector((state) => state.organization);
  const { moduleCategoryList: mCategory } = useSelector(
    (state) => state.moduleCategory
  );
  const { modulesList: modules } = useSelector((state) => state.modules);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    initialValues
  } = OrgFormik;

  useEffect(() => {
    if (Object.keys(ORG).length) {
      Object.keys(initialValues).forEach((key) => {
        setFieldValue(key, ORG[key]);
      });
    }
    // eslint-disable-next-line
  }, [ORG]);

  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={OrgFormik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <Box
                  sx={{
                    my: 10,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <UploadAvatar
                    value={values.photoURL}
                    onChange={(value) => setFieldValue('photoURL', value)}
                  />
                  <FormControlLabel
                    control={
                      <Switch {...getFieldProps('isPublic')} color="primary" />
                    }
                    labelPlacement="start"
                    label="Organization Profile"
                  />
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Organization Name"
                        {...getFieldProps('orgName')}
                        error={Boolean(touched.orgName && errors.orgName)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="Email Address"
                        {...getFieldProps('secondEmail')}
                      />
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Module"
                        placeholder="Module"
                        {...getFieldProps('module')}
                        SelectProps={{ native: true }}
                        error={Boolean(touched.module && errors.module)}
                        helperText={touched.module && errors.module}
                        className={classes.margin}
                      >
                        <option value="" />
                        {modules.map((m) => (
                          <option key={m.ids} value={m.ids}>
                            {m.moduleName}
                          </option>
                        ))}
                      </TextField>
                    </Grid> */}

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Module Category"
                        placeholder="Module Category"
                        {...getFieldProps('moduleCategoryId')}
                        SelectProps={{ native: true }}
                        error={Boolean(
                          touched.moduleCategoryId && errors.moduleCategoryId
                        )}
                        helperText={
                          touched.moduleCategoryId && errors.moduleCategoryId
                        }
                        className={classes.margin}
                      >
                        <option value="" />
                        {mCategory.map((c) => (
                          <option key={c.ids} value={c.ids}>
                            {c.moduleCategoryName}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Service Type"
                        placeholder="Service Type"
                        {...getFieldProps('serviceType')}
                        SelectProps={{ native: true }}
                        error={Boolean(
                          touched.serviceType && errors.serviceType
                        )}
                        helperText={touched.serviceType && errors.serviceType}
                        className={classes.margin}
                      >
                        <option value="" />
                        {serviceTypes.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Organization Type"
                        placeholder="Organization Type"
                        {...getFieldProps('organizationType')}
                        SelectProps={{ native: true }}
                        error={Boolean(
                          touched.organizationType && errors.organizationType
                        )}
                        helperText={
                          touched.organizationType && errors.organizationType
                        }
                        className={classes.margin}
                      >
                        <option value="" />
                        {orgTypes.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Organization Name" />
                    </Grid> */}

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Second Email"
                        {...getFieldProps('secondEmail')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        {...getFieldProps('phoneNumber')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Second Phone"
                        {...getFieldProps('secondPhone')}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={2}
                        label="Short Description"
                        {...getFieldProps('shortDesc')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={20}
                        label="Long Description"
                        {...getFieldProps('longDesc')}
                      />
                    </Grid>
                  </Grid>

                  <Box
                    sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      pending={isSubmitting}
                    >
                      Save Changes
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </div>
  );
}

export default General;
