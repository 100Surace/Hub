import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import fileFill from '@iconify-icons/eva/file-fill';
import closeFill from '@iconify-icons/eva/close-fill';
import { motion, AnimatePresence } from 'framer-motion';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  List,
  Link,
  Button,
  ListItem,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core';
import { fData } from '../../utils/formatNumber';
import { varFadeInRight } from '../animate';
import { Gallery } from '../user';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: { width: '100%' },
  dropZone: {
    outline: 'none',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral,
    border: `1px dashed ${theme.palette.grey[500_32]}`,
    '&:hover': {
      opacity: 0.72,
      cursor: 'pointer'
    },
    [theme.breakpoints.up('md')]: {
      textAlign: 'left',
      flexDirection: 'row'
    }
  },
  list: {
    margin: theme.spacing(5, 0)
  },
  listItem: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(0.5, 2),
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  },
  dragActive: {
    opacity: 0.72
  },
  isDragReject: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.light,
    backgroundColor: theme.palette.error.lighter
  },
  isDragAccept: {}
}));

// ----------------------------------------------------------------------

UploadMultiFile.propTypes = {
  caption: PropTypes.string,
  error: PropTypes.bool,
  files: PropTypes.object,
  value: PropTypes.array,
  onChange: PropTypes.func,
  uploadImages: PropTypes.func,
  addDroppedImages: PropTypes.func,
  remove: PropTypes.func,
  images: PropTypes.array,
  className: PropTypes.string
};

function UploadMultiFile({
  caption,
  error = false,
  value: files,
  onChange: setFiles,
  addDroppedImages,
  uploadImages,
  className,
  images,
  remove,
  ...other
}) {
  const classes = useStyles();
  const hasFile = files.length > 0;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFiles(acceptedFiles);
      addDroppedImages(acceptedFiles);
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemoveFile = (file) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept
  } = useDropzone({
    onDrop: handleDrop
  });

  return (
    <div className={clsx(classes.root, className)} {...other}>
      <div
        className={clsx(classes.dropZone, {
          [classes.isDragActive]: isDragActive,
          [classes.isDragAccept]: isDragAccept,
          [classes.isDragReject]: isDragReject || error
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <Box
          component="img"
          alt="select file"
          src="/static/illustrations/illustration_upload.svg"
          sx={{ height: 160 }}
        />

        <Box sx={{ ml: { md: 5 } }}>
          <Typography gutterBottom variant="h5">
            Drop or Select file
          </Typography>

          {caption ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {caption}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Drop files here or click&nbsp;
              <Link underline="always">browse</Link>&nbsp;thorough your machine
            </Typography>
          )}
        </Box>
      </div>

      <Gallery gallery={images} remove={remove} />

      {/* <List disablePadding className={clsx({ [classes.list]: hasFile })}>
        <AnimatePresence>
          {files.map((file) => (
            <ListItem
              key={file.name}
              component={motion.div}
              className={classes.listItem}
              {...varFadeInRight}
            >
              <ListItemIcon>
                <Icon icon={fileFill} width={32} height={32} />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={fData(file.size)}
                primaryTypographyProps={{ variant: 'subtitle2' }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => handleRemoveFile(file)}
                >
                  <Icon icon={closeFill} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </AnimatePresence>
      </List> */}

      {hasFile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            '& > *': { ml: 1.5 }
          }}
        >
          <Button onClick={handleRemoveAll} sx={{ ml: 1.5 }}>
            Remove all
          </Button>
          <Button onClick={uploadImages} variant="contained">
            Upload files
          </Button>
        </Box>
      )}
    </div>
  );
}

export default UploadMultiFile;
