import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, Autocomplete } from '@material-ui/core';

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
PostDetailsView.propTypes = {
  formik: PropTypes.object.isRequired,
  onOpenPreview: PropTypes.func,
  className: PropTypes.string
};

function PostDetailsView({
  options,
  formik,
  onOpenPreview,
  className,
  ...other
}) {
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
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => (
            <TextField {...params} margin="normal" label="Combo box" />
          )}
        />
        <TextField
          fullWidth
          label="Add ModuleCategory"
          {...getFieldProps('title')}
          error={Boolean(touched.title && errors.title)}
          helperText={touched.title && errors.title}
          className={classes.margin}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            pending={isSubmitting}
          >
            Add ModuleCategory
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default PostDetailsView;
