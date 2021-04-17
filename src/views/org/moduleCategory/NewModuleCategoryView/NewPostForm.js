import clsx from 'clsx';
import React, { useEffect } from 'react';
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
  className: PropTypes.string,
  moduleCategoryList: PropTypes.array,
  modulesList: PropTypes.array,
  editModule: PropTypes.object,
  module: PropTypes.object,
  setModule: PropTypes.func
};

function PostDetailsView({
  options,
  formik,
  onOpenPreview,
  className,
  moduleCategoryList,
  modulesList,
  editModule,
  module,
  setModule,
  ...other
}) {
  const classes = useStyles();
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    values
  } = formik;

  const hanldeModuleChange = (e, value) => {
    setModule(value);
    if (value) setFieldValue('moduleId', value.ids);
    else setFieldValue('moduleId', 0);
  };

  useEffect(() => {
    if (values.moduleId)
      setModule(modulesList.filter((m) => m.ids === values.moduleId)[0]);
    // eslint-disable-next-line
  });

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
          options={modulesList}
          getOptionLabel={(m) => m.moduleName}
          onChange={hanldeModuleChange}
          value={module}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Module"
              error={Boolean(touched.moduleId && errors.moduleId)}
            />
          )}
        />
        {/* <FormControl
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
            className={classes.margin}
          >
            {modulesList.map((m) => (
              <MenuItem key={m.ids} value={m.ids}>
                {m.moduleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <TextField
          fullWidth
          label="Module Category"
          {...getFieldProps('moduleCategoryName')}
          error={Boolean(
            touched.moduleCategoryName && errors.moduleCategoryName
          )}
          className={classes.margin}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            pending={isSubmitting}
          >
            {editModule.ids ? 'Save Module Category' : 'Add Module Category'}
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default PostDetailsView;
