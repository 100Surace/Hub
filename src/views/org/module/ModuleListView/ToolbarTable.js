import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import edit2Fill from '@iconify-icons/eva/edit-2-fill';
import searchFill from '@iconify-icons/eva/search-fill';
import trash2Fill from '@iconify-icons/eva/trash-2-fill';
import roundFilterList from '@iconify-icons/ic/round-filter-list';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  InputAdornment,
  OutlinedInput
} from '@material-ui/core';
import { deleteModule, getModules } from 'src/redux/slices/module';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => {
  const isLight = theme.palette.mode === 'light';
  return {
    root: {
      height: 96,
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 1, 0, 3)
    },
    search: {
      width: 240,
      transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
      }),
      '&.Mui-focused': { width: 320, boxShadow: theme.shadows[25].z8 },
      '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`
      }
    },
    highlight: isLight
      ? {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.lighter
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark
        }
  };
});

// ----------------------------------------------------------------------

ToolbarTable.propTypes = {
  selected: PropTypes.array,
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  resetStates: PropTypes.func,
  className: PropTypes.string
};

function ToolbarTable({
  selected,
  numSelected,
  filterName,
  onFilterName,
  resetStates,
  className
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const editSelected = () => {};

  const deleteSelected = () => {
    const onSuccess = () => {
      enqueueSnackbar('Module deleted', {
        variant: 'success'
      });
    };
    const onError = () => {
      enqueueSnackbar('Deleting module failed', {
        variant: 'error'
      });
    };

    dispatch(deleteModule(selected))
      .then(() => {
        onSuccess();
        dispatch(getModules());
        resetStates();
      })
      .catch(() => {
        onError();
      });
  };
  return (
    <Toolbar
      className={clsx(
        classes.root,
        { [classes.highlight]: numSelected > 0 },
        className
      )}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search module..."
          startAdornment={
            <InputAdornment position="start">
              <Box
                component={Icon}
                icon={searchFill}
                sx={{ color: 'text.disabled' }}
              />
            </InputAdornment>
          }
          className={classes.search}
        />
      )}

      {numSelected > 0 ? (
        numSelected === 1 ? (
          <div>
            <Tooltip title="Edit">
              <IconButton onClick={editSelected}>
                <Icon icon={edit2Fill} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={deleteSelected}>
                <Icon icon={trash2Fill} />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <Tooltip title="Delete">
            <IconButton onClick={deleteSelected}>
              <Icon icon={trash2Fill} />
            </IconButton>
          </Tooltip>
        )
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Icon icon={roundFilterList} />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default ToolbarTable;
