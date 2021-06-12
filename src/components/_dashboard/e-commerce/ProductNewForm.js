import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { LoadingButton } from '@material-ui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Select,
  Button,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel
} from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import { PreviewVariant } from './product-create';
import { addNewProduct } from '../../../redux/slices/product';
import { getVendors } from '../../../redux/slices/vendor';

// ----------------------------------------------------------------------

const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] }
];

// product status
const PRODUCT_STATUS = ['Draft', 'Active', 'Disable'];

const TAGS_OPTION = ['product'];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

const VARIANTS = [
  {
    id: 1,
    name: 'Color'
  },
  {
    id: 2,
    name: 'Size'
  },
  {
    id: 3,
    name: 'Gender'
  },
  {
    id: 4,
    name: 'Material'
  },
  {
    id: 5,
    name: 'Style'
  },
  {
    id: 6,
    name: 'Title'
  }
];

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function ProductNewForm({ isEdit, currentProduct }) {
  const defaultVariantOption = {
    id: 1,
    optName: 'Color',
    optValues: []
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [optionRow, setOptionRow] = useState([defaultVariantOption]);
  // remove first element to get rest available options
  const REST_OPTIONS = VARIANTS.slice();
  REST_OPTIONS.splice(0, 1);
  const [restOptions, setRestOptions] = useState(REST_OPTIONS);
  // states from store
  const { vendors } = useSelector((state) => state.vendor);

  const NewProductSchema = Yup.object().shape({
    productTitle: Yup.string()
      .required('Name is required')
      .matches(/^[A-Z]+/, 'First letter must be in UPPERCASE'),
    description: Yup.string().required('Description is required')
    // images: Yup.array().min(1, 'Images is required'),
    // price: Yup.number().required('Price is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productTitle: currentProduct?.productTitle || '',
      description: currentProduct?.description || '',
      images: currentProduct?.images || [],
      productStatus: currentProduct?.productStatus || PRODUCT_STATUS[0],
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || '',
      priceSale: currentProduct?.priceSale || '',
      tags: currentProduct?.tags || [TAGS_OPTION[0]],
      inStock: Boolean(currentProduct?.inventoryType !== 'out_of_stock'),
      taxes: true,
      // gender: currentProduct?.gender || GENDER_OPTION[2],
      category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
      vendorId: currentProduct?.vendorId || vendors[0]?.id,
      option: ''
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        dispatch(addNewProduct(values));
        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.eCommerce.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  const handleAddOption = () => {
    let maxId = 0;

    // gets max id number
    optionRow.forEach((or) => {
      if (or.id > maxId) maxId = or.id;
    });
    const options = restOptions.slice();

    if (options.length !== 0) {
      setOptionRow([...optionRow, { id: maxId + 1, optName: options[0].name, optValues: [] }]);
      options.splice(0, 1);
    }

    // sort options by id (ASC)
    sortOptions(options);
    setRestOptions(options);
  };

  const sortOptions = (arr) =>
    arr.sort((a, b) => {
      if (a.id < b.id) return -1;
      return a.id > b.id ? 1 : 0;
    });

  const removeOption = (index) => {
    const newOptions = optionRow.slice();
    const curName = optionRow[index].optName;
    let id = 0;

    // get id of deleted option name
    VARIANTS.forEach((v) => {
      if (v.name === curName) id = v.id;
    });

    newOptions.splice(index, 1);
    if (newOptions.length === 0) newOptions.push(defaultVariantOption);
    setOptionRow(newOptions);

    // adds deleted option name as available select option
    const selectOptions = [...restOptions, { id, name: curName }];
    // sort by id (ASC)
    sortOptions(selectOptions);

    setRestOptions(selectOptions);
  };

  const handleOptValueChange = (id, newValue) => {
    const newOptions = optionRow.map((opt) => {
      if (opt.id === id) {
        opt.optValues = newValue.slice();
      }
      return opt;
    });

    setOptionRow(newOptions);
  };

  const handleOptNameChange = ({ target: { value } }, id) => {
    let oldValue = '';
    let oId = 0;

    const newOptions = optionRow.map((opt) => {
      if (opt.id === id) {
        oldValue = opt.optName;
        opt.optName = value;
      }
      return opt;
    });

    VARIANTS.forEach((v) => {
      if (v.name === oldValue) oId = v.id;
    });
    const selectOptions = restOptions.slice();
    restOptions.forEach((o, index) => {
      if (o.name === value) {
        selectOptions.splice(index, 1);
        selectOptions.push({ id: oId, name: oldValue });
      }
    });
    sortOptions(selectOptions);

    setRestOptions(selectOptions);
    setOptionRow(newOptions);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images.filter((_file) => _file !== file);
    setFieldValue('images', filteredItems);
  };

  const variants = [];
  optionRow.forEach((opt) => {
    if (opt.optValues.length) variants.push(opt.optValues);
  });

  const cartesianVariants = variants.length
    ? variants.reduce((vars, arr) => vars.flatMap((v) => arr.map((a) => [v, a].flat())))
    : [];

  useEffect(() => {
    dispatch(getVendors());
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...getFieldProps('productTitle')}
                  error={Boolean(touched.productTitle && errors.productTitle)}
                  helperText={touched.productTitle && errors.productTitle}
                />

                <div>
                  <LabelStyle>Description</LabelStyle>
                  <QuillEditor
                    simple
                    id="product-description"
                    value={values.description}
                    onChange={(val) => setFieldValue('description', val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>

                <div>
                  <LabelStyle>Add Images</LabelStyle>
                  <UploadMultiFile
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    files={values.images}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    error={Boolean(touched.images && errors.images)}
                  />
                  {touched.images && errors.images && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.images && errors.images}
                    </FormHelperText>
                  )}
                </div>

                <div>
                  <LabelStyle>Variants</LabelStyle>
                  {optionRow.map(({ id, optName, optValues }, index) => (
                    <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} mb={1}>
                      <FormControl fullWidth>
                        <InputLabel id="opt-name" shrink>
                          Option {index + 1}
                        </InputLabel>
                        <Select
                          labelId="opt-name"
                          label="Option"
                          native
                          value={optName}
                          onChange={(e) => handleOptNameChange(e, id)}
                        >
                          <option key={id} value={optName}>
                            {optName}
                          </option>
                          {restOptions
                            .filter((a) => a.name !== optName)
                            .map(({ id, name }) => (
                              <option key={id} value={name}>
                                {name}
                              </option>
                            ))}
                        </Select>
                      </FormControl>
                      <Autocomplete
                        fullWidth
                        multiple
                        freeSolo
                        value={optValues}
                        onChange={(event, newValue) => {
                          handleOptValueChange(id, newValue);
                        }}
                        options={TAGS_OPTION.map((option) => option)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => <TextField label="Values" {...params} />}
                      />
                      <Button size="small" color="secondary" variant="text" onClick={() => removeOption(index)}>
                        Remove
                      </Button>
                    </Stack>
                  ))}
                  <Stack direction="row" mt={1}>
                    {restOptions.length === 0 ? (
                      ''
                    ) : (
                      <LoadingButton variant="outlined" size="medium" onClick={handleAddOption}>
                        Add Option
                      </LoadingButton>
                    )}
                  </Stack>
                </div>
                {cartesianVariants.length ? (
                  <div>
                    <LabelStyle>Preview</LabelStyle>
                    <PreviewVariant variants={cartesianVariants} />
                  </div>
                ) : null}
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="productStatus"
                      native
                      {...getFieldProps('productStatus')}
                      value={values.productStatus}
                    >
                      {PRODUCT_STATUS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel shrink>Vendor</InputLabel>
                    <Select label="Vendor" native {...getFieldProps('vendorId')} value={values.vendorId}>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.vendorName}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Collection</InputLabel>
                    <Select label="Category" native {...getFieldProps('category')} value={values.category}>
                      {CATEGORY_OPTION.map((category) => (
                        <optgroup key={category.group} label={category.group}>
                          {category.classify.map((classify) => (
                            <option key={classify} value={classify}>
                              {classify}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField fullWidth label="Product Barcode" {...getFieldProps('code')} />
                  <TextField fullWidth label="Product SKU" {...getFieldProps('sku')} />
                  <TextField fullWidth label="Quantity" type="number" InputLabelProps={{ shrink: true }} />

                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.tags}
                    onChange={(event, newValue) => {
                      setFieldValue('tags', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip key={option} size="small" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Tags" {...params} />}
                  />
                  <FormControlLabel
                    control={<Switch {...getFieldProps('inStock')} checked={values.inStock} />}
                    label="In stock"
                    sx={{ mb: 2 }}
                  />
                </Stack>
              </Card>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Category A</InputLabel>
                      <Select label="Category" native {...getFieldProps('category')} value={values.category}>
                        {CATEGORY_OPTION.map((category) => (
                          <optgroup key={category.group} label={category.group}>
                            {category.classify.map((classify) => (
                              <option key={classify} value={classify}>
                                {classify}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Category B</InputLabel>
                      <Select label="Category" native {...getFieldProps('category')} value={values.category}>
                        {CATEGORY_OPTION.map((category) => (
                          <optgroup key={category.group} label={category.group}>
                            {category.classify.map((classify) => (
                              <option key={classify} value={classify}>
                                {classify}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth m={1}>
                      <InputLabel>Category C</InputLabel>
                      <Select label="Category" native {...getFieldProps('category')} value={values.category}>
                        {CATEGORY_OPTION.map((category) => (
                          <optgroup key={category.group} label={category.group}>
                            {category.classify.map((classify) => (
                              <option key={classify} value={classify}>
                                {classify}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Card>
              </Stack>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Regular Price"
                    {...getFieldProps('price')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number',
                      shrink: true
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />

                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Sale Price"
                    {...getFieldProps('priceSale')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number'
                    }}
                  />

                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Cost Price"
                    {...getFieldProps('price')}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      type: 'number',
                      shrink: true
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Stack>

                <FormControlLabel
                  control={<Switch {...getFieldProps('taxes')} checked={values.taxes} />}
                  label="Price includes taxes"
                  sx={{ mt: 2 }}
                />
              </Card>

              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Product' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
