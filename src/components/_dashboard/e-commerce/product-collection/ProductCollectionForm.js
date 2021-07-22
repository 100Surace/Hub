import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField, FormControlLabel, Switch, LabelStyle } from '@material-ui/core';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useNavigate } from 'react-router-dom';
import { UploadSingleFile } from '../../../upload';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { addProductCollection, updateProductCollection } from '../../../../redux/slices/productCollection';

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
  isEdit: PropTypes.bool,
  currentCollection: PropTypes.object
};

function ProductCollectionForm({ isEdit, currentCollection }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      collectionName: currentCollection?.collectionName || '',
      aviliablefrom: currentCollection.aviliablefrom?.split('T')[0] || '',
      aviliableTill: currentCollection.aviliableTill?.split('T')[0] || '',
      cImage: '',
      status: currentCollection?.status || false,
      userId: currentCollection?.userId || reactLocalStorage.get('uid'),
      collectionImage: currentCollection?.collectionImage || null
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      if (isEdit) {
        dispatch(updateProductCollection(currentCollection.id, values)).then(() => {
          navigate(PATH_DASHBOARD.productCollection.list);
        });
      } else {
        dispatch(addProductCollection(values));
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (selectedFile) => {
      setFieldValue(
        'cImage',
        Object.assign(selectedFile[0], {
          preview: URL.createObjectURL(selectedFile[0])
        })
      );
    },
    [setFieldValue]
  );

  const handleRemove = (file) => {
    setFieldValue('cImage', '');
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
          value={values.aviliablefrom}
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
          value={values.aviliableTill}
        />
        <div>
          Add Image
          {typeof values.collectionImage === 'string' ? (
            <img
              src={process.env.REACT_APP_API_URL + '/' + values.collectionImage}
              alt="collection image"
              width="50%"
            />
          ) : (
            <UploadSingleFile
              showPreview
              maxSize={3145728}
              accept="image/*"
              file={values.cImage}
              onDrop={handleDrop}
              onRemove={handleRemove}
            />
          )}
        </div>
        <FormControlLabel
          control={<Switch {...getFieldProps('status')} checked={values.status} />}
          label="Status"
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton type="submit" variant="contained">
            {!isEdit ? 'Add Product Collection' : 'Save Changes'}
          </LoadingButton>
        </Box>
      </Form>
    </FormikProvider>
  );
}

export default ProductCollectionForm;
