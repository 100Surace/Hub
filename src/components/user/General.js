import clsx from 'clsx';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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
import { UploadAvatar } from '../Upload';

// ----------------------------------------------------------------------

const useStyles = makeStyles(() => ({
  root: {}
}));

// ----------------------------------------------------------------------

General.propTypes = {
  className: PropTypes.string,
  myProps: PropTypes.object
};

function General({
  className,
  myProps: { OrgFormik, myOrg, mCategories, modules, hasOrg }
}) {
  const classes = useStyles();
  const serviceTypes = [
    { id: 1, name: 'Private' },
    { id: 2, name: 'Public' }
  ];
  const orgTypes = [
    { id: 1, name: 'National' },
    { id: 2, name: 'International' }
  ];

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

  // get only the categories of selected module
  mCategories = mCategories.filter(
    (m) => parseInt(values.moduleId, 10) === parseInt(m.moduleId, 10)
  );

  useEffect(() => {
    if (Object.keys(myOrg).length) {
      Object.keys(initialValues).forEach((key) => {
        const value = myOrg[key] === 'null' ? '' : myOrg[key];
        setFieldValue(key, value);
      });
    }
    // eslint-disable-next-line
  }, [myOrg]);

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
                    value={values.imageFile}
                    path={values.logo}
                    onChange={(value) => {
                      setFieldValue('imageFile', value);
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        {...getFieldProps('status')}
                        color="primary"
                        checked={values.status}
                      />
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
                    {/* disbale module selection if user has org */}
                    {hasOrg ? (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          disabled
                          fullWidth
                          label="Module"
                          placeholder="Module"
                          className={classes.margin}
                          value={myOrg.moduleName}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Module"
                          placeholder="Module"
                          {...getFieldProps('moduleId')}
                          SelectProps={{ native: true }}
                          error={Boolean(touched.moduleId && errors.moduleId)}
                          helperText={touched.moduleId && errors.moduleId}
                          className={classes.margin}
                        >
                          <option value="" />
                          {modules.map((m) => (
                            <option key={m.ids} value={m.ids}>
                              {m.moduleName}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    )}
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        disabled
                        label="Email Address"
                        {...getFieldProps('secondEmail')}
                      />
                    </Grid> */}

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
                        {mCategories.map((m) => (
                          <option key={m.ids} value={m.ids}>
                            {m.moduleCategoryName}
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

                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        {...getFieldProps('phoneNumber')}
                      />
                    </Grid> */}

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
                      {hasOrg ? 'Save Changes' : 'Add Organization'}
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
