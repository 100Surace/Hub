import clsx from 'clsx';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { countries } from './countries';
import { useSnackbar } from 'notistack';
import useAuth from 'src/hooks/useAuth';
import { UploadAvatar } from 'src/components/Upload';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
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
  className: PropTypes.string
};

function General({ className }) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateProfile } = useAuth();
  const { organizationsList: ORG } = useSelector((state) => state.organization);

  const UpdateUserSchema = Yup.object().shape({
    moduleCategoryId: Yup.string().required('Module name is required'),
    serviceType: Yup.string().required('Service type is required'),
    organizationType: Yup.string().required('Organization Type is required'),
    orgName: Yup.string().required('Organizaton name is required'),
    status: Yup.string().required('Status is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      moduleCategoryId: '',
      moduleCategory: '',
      serviceType: '',
      organizationType: '',
      orgName: ORG.orgName,
      secondEmail: ORG.secondEmail,
      secondPhone: ORG.secondPhone,
      shortDesc: ORG.shortDesc,
      longDesc: ORG.longDesc,
      logo: '',
      bannerImg: '',
      orgImg: '',
      status: ''
    },

    validationSchema: UpdateUserSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await updateProfile({ ...values });
        enqueueSnackbar('Update success', { variant: 'success' });
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
    }
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue
  } = formik;

  return (
    <div className={clsx(classes.root, className)}>
      <FormikProvider value={formik}>
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
                    disabled={user.email === 'demo@minimals.cc'} // You can remove this
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
                        label="Name"
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

                    <Grid item xs={12} sm={6}>
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
                        {countries.map((option) => (
                          <option key={option.code} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Module Category"
                        placeholder="Module Category"
                        {...getFieldProps('moduleCategory')}
                        SelectProps={{ native: true }}
                        error={Boolean(
                          touched.moduleCategory && errors.moduleCategory
                        )}
                        helperText={
                          touched.moduleCategory && errors.moduleCategory
                        }
                        className={classes.margin}
                      >
                        <option value="" />
                        {countries.map((option) => (
                          <option key={option.code} value={option.label}>
                            {option.label}
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
                        {countries.map((option) => (
                          <option key={option.code} value={option.label}>
                            {option.label}
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
                        {countries.map((option) => (
                          <option key={option.code} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Organization Name" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Second Email"
                        {...getFieldProps('secondEmail')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
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
