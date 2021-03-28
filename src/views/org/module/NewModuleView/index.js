import * as Yup from 'yup';
import { useFormik } from 'formik';
import Page from 'src/components/Page';
import React, { useState } from 'react';
import NewModuleForm from './NewModuleForm';
import { useSnackbar } from 'notistack';
import { PATH_APP } from 'src/routes/paths';
import fakeRequest from 'src/utils/fakeRequest';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Card, CardContent } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

function NewPostView() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Module Name Is Required')
  });

  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: NewBlogSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);
        resetForm();
        handleClosePreview();
        setSubmitting(false);
        enqueueSnackbar('Post success', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors({ afterSubmit: error.code });
      }
    }
  });

  return (
    <Page title="New Post-Management | Minimal-UI" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading="Create a new post"
          links={[
            { name: 'Dashboard', href: PATH_APP.root },
            { name: 'Management', href: PATH_APP.management.root },
            { name: 'Blog', href: PATH_APP.management.blog.root },
            { name: 'New Post' }
          ]}
        />

        <Card>
          <CardContent>
            <NewModuleForm formik={formik} onOpenPreview={handleOpenPreview} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default NewPostView;
