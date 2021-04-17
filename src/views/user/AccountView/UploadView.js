import React, { useState } from 'react';
import Page from 'src/components/Page';
import { UploadMultiFile } from 'src/components/Upload';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Container, CardHeader, CardContent } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

function UploadView() {
  const classes = useStyles();
  const [files, setFiles] = useState([]);

  return (
    <Page title="Upload-Components | Minimal-UI" className={classes.root}>
      <Container maxWidth="lg">
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Upload MultiFile" />
          <CardContent>
            <UploadMultiFile value={files} onChange={setFiles} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default UploadView;
