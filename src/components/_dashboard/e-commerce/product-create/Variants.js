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
    const newProductVariants = productVariants.slice();
    newProductVariants.forEach((v) => {
      if (v.label === label) {
        v[name] = value;
      }
    });

    setProductVariants(newProductVariants);
  };

  useEffect(() => {
    const labels = [];
    const optionRows = [];
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
      optionRows.push({ label, price: '0.00', quantity: '1', sku: '', barcode: '' });
    });

    const newProductVariants = [];
    optionRows.forEach((o) => {
      /* eslint-disable-next-line no-plusplus */
      for (let i = 0; i < productVariants.length; i++) {
        if (o.label.match(productVariants[i].label)) {
          o.price = productVariants[i].price;
          o.quantity = productVariants[i].quantity;
          o.sku = productVariants[i].sku;
          o.barcode = productVariants[i].barcode;
          break;
        }
      }
      newProductVariants.push(o);
    });
    setProductVariants(newProductVariants);
    setLabels(labels);
  }, [variants]);

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
          {productVariants.map((variant) => (
            <VarRow onChangeHandler={onChangeHandler} variant={variant} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

VarRow.propTypes = {
  onChangeHandler: PropTypes.func,
  variant: PropTypes.object
};

function VarRow({ onChangeHandler, variant }) {
  return (
    <TableRow key={variant.label}>
      <TableCell>{variant.label}</TableCell>
      <TableCell>
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            name="price"
            type="number"
            value={variant.price}
            onChange={(e) => onChangeHandler(e, variant.label)}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
      </TableCell>
      <TableCell>
        <TextField
          name="quantity"
          value={variant.quantity}
          onChange={(e) => onChangeHandler(e, variant.label)}
          type="number"
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="sku"
          value={variant.sku}
          onChange={(e) => onChangeHandler(e, variant.label)}
          variant="outlined"
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="barcode"
          value={variant.barcode}
          onChange={(e) => onChangeHandler(e, variant.label)}
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
