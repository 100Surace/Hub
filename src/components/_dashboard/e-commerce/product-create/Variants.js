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
  const renderRow = (variants) =>
    variants.map((opts) => {
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

      return (
        <TableRow key={label}>
          <TableCell>{label}</TableCell>
          <TableCell>
            <FormControl fullWidth variant="outlined" size="small">
              <OutlinedInput startAdornment={<InputAdornment position="start">$</InputAdornment>} />
            </FormControl>
          </TableCell>
          <TableCell>
            <TextField type="number" variant="outlined" size="small" />
          </TableCell>
          <TableCell>
            <TextField variant="outlined" size="small" />
          </TableCell>
          <TableCell>
            <TextField variant="outlined" size="small" />
          </TableCell>
          <TableCell>
            <Delete />
          </TableCell>
        </TableRow>
      );
    });

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
        <TableBody>{renderRow(variants)}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default PreviewVariant;
