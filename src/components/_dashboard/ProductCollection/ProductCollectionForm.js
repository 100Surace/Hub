import clsx from 'clsx';
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, FormControlLabel, Switch, LabelStyle } from '@material-ui/core';
import { UploadSingleFile } from '../../upload';
import { addProductCollection } from '../../../redux/slices/productCollection';

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
ProductCollectionForm.propTypes = {
  formik: PropTypes.object,
  className: PropTypes.string,
  editModule: PropTypes.object
};

function ProductCollectionForm() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collectionName: '',
      aviliablefrom: '',
      aviliableTill: '',
      collectionImage: '',
      status: false
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      dispatch(addProductCollection(values));
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (selectedFile) => {
      setFieldValue(
        'collectionImage',
        Object.assign(selectedFile[0], {
          preview: URL.createObjectURL(selectedFile[0])
        })
      );
    },
    [setFieldValue]
  );

  const handleRemove = (file) => {
    setFieldValue('collectionImage', '');
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off">
        <TextField fullWidth label="Add Product Collection" {...getFieldProps('collectionName')} />
        <TextField
          id="date"
          label="Available From"
          type="date"
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true
          }}
          {...getFieldProps('aviliablefrom')}
        />
        <TextField
          id="date"
          label="Available Till"
          type="date"
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true
          }}
          {...getFieldProps('aviliableTill')}
        />
        <div>
          Add Images
          <UploadSingleFile
            showPreview
            maxSize={3145728}
            accept="image/*"
            file={values.collectionImage}
            onDrop={handleDrop}
            onRemove={handleRemove}
          />
        </div>
        <FormControlLabel control={<Switch {...getFieldProps('status')} />} label="Status" sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained">
            Add Product Collection
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default ProductCollectionForm;
