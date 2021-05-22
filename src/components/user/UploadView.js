import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Container, CardHeader, CardContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Page from '../Page';
import { UploadMultiFile } from '../Upload';
import {
  updateOrgImages,
  deleteOrgImage,
  addOrgImages
} from '../../redux/slices/organization';

// ----------------------------------------------------------------------

const useStyles = makeStyles(() => ({
  root: {}
}));

// ----------------------------------------------------------------------
UploadView.propTypes = {
  orgImages: PropTypes.array
};

function UploadView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const { orgImages } = useSelector((state) => state.organization);

  const remove = (image, local = false) => {
    dispatch(deleteOrgImage(image, local));
  };

  const addDroppedImages = (images) => {
    dispatch(addOrgImages(images));
  };

  const uploadImages = () => {
    dispatch(updateOrgImages(files))
      .then(() => {
        enqueueSnackbar('Successfully added images', { variant: 'success' });
        setFiles([]);
      })
      .catch(() => {
        enqueueSnackbar('Failed to add images', { variant: 'error' });
      });
  };

  return (
    <Page title="Upload-Components | Minimal-UI" className={classes.root}>
      <Container maxWidth="lg">
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Upload MultiFile" />
          <CardContent>
            <UploadMultiFile
              value={files}
              onChange={setFiles}
              uploadImages={uploadImages}
              images={orgImages}
              remove={remove}
              addDroppedImages={addDroppedImages}
            />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default UploadView;
