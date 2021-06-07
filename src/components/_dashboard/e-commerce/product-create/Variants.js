import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';

PreviewVariant.propTypes = {
  variants: PropTypes.array
};

function PreviewVariant({ variants }) {
  const [labels, setLabels] = useState([]);
  const [productVariants, setProductVariants] = useState([]);

  const onChangeHandler = ({ target: { name, value } }, label) => {
    console.log(productVariants);
    const newProductVariants = productVariants.slice();
    newProductVariants.forEach((v) => {
      console.log(v.label);
      if (v.label === label) {
        v[name] = value;
      }
    });
    console.log(label);
    console.log(newProductVariants);
  };

  useEffect(() => {
    const labels = [];
    variants.forEach((opts) => {
      let variant = '';
      let label;
      if (opts instanceof Array) {
        opts.map((option) => (variant += `${option} /`));

        label = variant.split('/');
        label.pop();
        label = label.join(' / ');
      } else {
        label = opts;
      }
      labels.push(label);
    });
    setLabels(labels);
  }, [variants]);

  useEffect(() => {
    setProductVariants([]);
  }, [labels]);

  return (
    <TableContainer component={Paper}>
      <Table style={{ width: '900px' }}>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '200px' }}>Variant</TableCell>
            <TableCell align="left" style={{ width: '200px' }}>
              Price
            </TableCell>
            <TableCell align="left" style={{ width: '50px' }}>
              Quantity
            </TableCell>
            <TableCell align="left" style={{ width: '200px' }}>
              SKU
            </TableCell>
            <TableCell align="left" style={{ width: '200px' }}>
              Barcode
            </TableCell>
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {labels.map((label) => (
            <VarRow
              label={label}
              onChangeHandler={onChangeHandler}
              productVariants={productVariants}
              setProductVariants={setProductVariants}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

VarRow.propTypes = {
  label: PropTypes.string,
  onChangeHandler: PropTypes.func,
  setProductVariants: PropTypes.func,
  productVariants: PropTypes.array
};

function VarRow({ label, onChangeHandler, productVariants, setProductVariants }) {
  useEffect(() => {
    setProductVariants([...productVariants, { label, price: '0.00', quantity: '1', sku: '', barcode: '' }]);
  }, []);

  return (
    <TableRow key={label}>
      <TableCell>{label}</TableCell>
      <TableCell>
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            name="price"
            type="number"
            value={productVariants.price}
            onChange={(e) => onChangeHandler(e, label)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
      </TableCell>
      <TableCell>
        <TextField
          name="quantity"
          value={productVariants.quantity}
          onChange={(e) => onChangeHandler(e, label)}
          type="number"
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="sku"
          value={productVariants.sku}
          onChange={(e) => onChangeHandler(e, label)}
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="barcode"
          value={productVariants.barcode}
          onChange={(e) => onChangeHandler(e, label)}
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <Delete />
      </TableCell>
    </TableRow>
  );
}

export default PreviewVariant;
