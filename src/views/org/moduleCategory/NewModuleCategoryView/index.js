import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Page from 'src/components/Page';
import React, { useState, useEffect } from 'react';
import NewPostForm from './NewPostForm';
import { useSnackbar } from 'notistack';
import { PATH_APP } from 'src/routes/paths';
import fakeRequest from 'src/utils/fakeRequest';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Card, CardContent } from '@material-ui/core';
import { getModuleCategories } from 'src/redux/slices/moduleCategory';
import { getModules } from 'src/redux/slices/module';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

function NewPostView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { moduleCategoryList } = useSelector((state) => state.moduleCategory);
  const { modulesList } = useSelector((state) => state.modules);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('ModuleCategory Name Is Required')
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

  useEffect(() => {
    dispatch(getModuleCategories());
    dispatch(getModules());
  }, [dispatch]);

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
            <NewPostForm
              formik={formik}
              onOpenPreview={handleOpenPreview}
              modulesList={modulesList}
              moduleCategoryList={moduleCategoryList}
            />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default NewPostView;
