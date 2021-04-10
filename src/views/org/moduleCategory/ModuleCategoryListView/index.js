import { filter } from 'lodash';
import HeadTable from './HeadTable';
import { Icon } from '@iconify/react';
import Page from 'src/components/Page';
import ToolbarTable from './ToolbarTable';
import { PATH_APP } from 'src/routes/paths';
import LazySize from 'src/components/LazySize';
import React, { useState, useEffect } from 'react';
import Scrollbars from 'src/components/Scrollbars';
import { visuallyHidden } from '@material-ui/utils';
import { HeaderDashboard } from 'src/layouts/Common';
import { getProducts } from 'src/redux/slices/product';
import { useDispatch, useSelector } from 'react-redux';
import SearchNotFound from 'src/components/SearchNotFound';
import plusFill from '@iconify-icons/eva/plus-fill';
import moreVerticalFill from '@iconify-icons/eva/more-vertical-fill';
import { Link as RouterLink } from 'react-router-dom';
import roundPostAdd from '@iconify-icons/ic/round-post-add';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Hidden,
  TableRow,
  Button,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { MFab } from 'src/theme';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'ModuleCategory', alignRight: false },
  { id: '' }
];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    array = filter(array, (_product) => {
      return _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    return array;
  }
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {},
  sortSpan: visuallyHidden
}));

// ----------------------------------------------------------------------

function ProductListView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const filteredProducts = applySortFilter(
    products,
    getComparator(order, orderBy),
    filterName
  );

  const isProductNotFound = filteredProducts.length === 0;

  return (
    <Page
      title="ModuleCategory | 
      SewaHub"
      className={classes.root}
    >
      <Container>
        <HeaderDashboard
          heading="ModuleCategory List"
          links={[
            { name: 'Dashboard', href: PATH_APP.root },
            { name: 'Management', href: PATH_APP.management.root },
            { name: 'org', href: PATH_APP.management.eCommerce.root },
            { name: 'ModuleCategory List' }
          ]}
          action={
            <Hidden smDown>
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_APP.management.org.newPost}
                startIcon={<Icon icon={plusFill} />}
              >
                Add ModuleCategory
              </Button>
            </Hidden>
          }
        />
        <Hidden smUp>
          <Box
            sx={{
              right: 24,
              bottom: 24,
              zIndex: 999,
              position: 'fixed'
            }}
          >
            <MFab component={RouterLink} to={PATH_APP.management.org.newPost}>
              <Icon icon={roundPostAdd} width={24} height={24} />
            </MFab>
          </Box>
        </Hidden>
        <Card className={classes.card}>
          <ToolbarTable
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbars>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <HeadTable
                  order={order}
                  classes={classes}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { id, name, cover } = row;

                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={(event) => handleClick(event, name)}
                          className={classes.row}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Box
                              sx={{
                                py: 2,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <LazySize
                                alt={name}
                                src={cover.thumb}
                                sx={{
                                  mx: 2,
                                  width: 64,
                                  height: 64,
                                  borderRadius: 1.5
                                }}
                              />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton>
                              <Icon
                                icon={moreVerticalFill}
                                width={20}
                                height={20}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isProductNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbars>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ProductListView;