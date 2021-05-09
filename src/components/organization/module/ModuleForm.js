import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField } from '@material-ui/core';

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  root: {},
  margin: {
    marginBottom: theme.spacing(3)
  },
  helperText: {
    padding: theme.spacing(0, 2)
  }
}));

// ----------------------------------------------------------------------
ModuleForm.propTypes = {
  formik: PropTypes.object.isRequired,
  className: PropTypes.string,
  editModule: PropTypes.object
};

function ModuleForm({ formik, className, editModule, ...other }) {
  const classes = useStyles();
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        className={clsx(classes.root, className)}
        {...other}
      >
        <TextField
          fullWidth
          label="Add Module"
          {...getFieldProps('moduleName')}
          error={Boolean(touched.moduleName && errors.moduleName)}
          helperText={touched.moduleName && errors.moduleName}
          className={classes.margin}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            pending={isSubmitting}
          >
            {editModule.ids ? 'Save Module' : 'Add Module'}
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default ModuleForm;
