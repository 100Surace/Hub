import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import Page from 'src/components/Page';
import React, { useState, useEffect } from 'react';
import NewPostForm from './NewPostForm';
import { useSnackbar } from 'notistack';
import { PATH_APP } from 'src/routes/paths';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Card, CardContent } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import {
  getModuleCategories,
  updateModuleCategory,
  addNewModuleCategory,
  getModuleCategoryById
} from 'src/redux/slices/moduleCategory';
import { getModules } from 'src/redux/slices/module';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

function NewPostView() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [editModule, setEditModule] = useState({});
  const [module, setModule] = useState({
    ids: 0,
    moduleName: 'Select Module Name'
  });
  const location = useLocation();
  const { moduleCategoryList } = useSelector((state) => state.moduleCategory);
  const { modulesList } = useSelector((state) => state.modules);
  const { enqueueSnackbar } = useSnackbar();

  const ModuleCategoryForm = Yup.object().shape({
    moduleId: Yup.number().positive().required('Module name is required'),
    moduleCategoryName: Yup.string()
      .required('This field is required')
      .min(2, 'This filed must have atleast 2 characters.')
  });

  const formik = useFormik({
    initialValues: {
      moduleId: 0,
      moduleCategoryName: ''
    },
    validationSchema: ModuleCategoryForm,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        const onSuccess = (msg) => {
          enqueueSnackbar(msg, {
            variant: 'success'
          });
        };
        const onError = (msg) => {
          enqueueSnackbar(msg, {
            variant: 'error'
          });
        };
        if (editModule.ids) {
          const data = { ids: editModule.ids, ...values };
          dispatch(updateModuleCategory(data.ids, data))
            .then(() => {
              onSuccess('Module category updated');
              resetForm();
              setSubmitting(false);
              history.push(PATH_APP.management.org.moduleCategory.list);
            })
            .catch(() => {
              onError('Cannot update module category');
              setSubmitting(false);
            });
        } else {
          dispatch(addNewModuleCategory(values))
            .then(() => {
              onSuccess('Module category added');
              resetForm();
              setSubmitting(false);
              setModule({ ids: 0, moduleName: 'Select Module Name' });
            })
            .catch(() => {
              onError('Cannot add module category');
              setSubmitting(false);
            });
        }
      } catch (error) {
        setSubmitting(false);
        setErrors({ afterSubmit: error.code });
      }
    }
  });

  const edit_id = location.search.split('=')[1];

  useEffect(() => {
    dispatch(getModuleCategories());
    dispatch(getModules());
    if (edit_id) {
      dispatch(getModuleCategoryById(edit_id)).then((res) => {
        formik.values.moduleCategoryName = res.moduleCategoryName;
        formik.values.moduleId = res.moduleId;
        setEditModule(res);
      });
    }
    // eslint-disable-next-line
  }, [edit_id, dispatch]);

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
              modulesList={modulesList}
              moduleCategoryList={moduleCategoryList}
              editModule={editModule}
              setModule={setModule}
              module={module}
            />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default NewPostView;
