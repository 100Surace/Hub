import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core';

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
  className: PropTypes.string,
  moduleCategoryList: PropTypes.array,
  modulesList: PropTypes.array
};

function PostDetailsView({
  options,
  formik,
  onOpenPreview,
  className,
  moduleCategoryList,
  modulesList,
  ...other
}) {
  const classes = useStyles();
  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        className={clsx(classes.root, className)}
        {...other}
      >
        <FormControl
          fullWidth
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Module</InputLabel>
          <Select
            fullWidth
            label="Module"
            value={values.moduleId}
            {...getFieldProps('moduleId')}
            error={Boolean(touched.moduleId && errors.moduleId)}
            helperText={touched.moduleId && errors.moduleId}
            className={classes.margin}
          >
            {modulesList.map((m) => (
              <MenuItem key={m.ids} value={m.ids}>
                {m.moduleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Module Category"
          {...getFieldProps('moduleCategoryName')}
          error={Boolean(
            touched.moduleCategoryName && errors.moduleCategoryName
          )}
          helperText={touched.moduleCategoryName && errors.moduleCategoryName}
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
