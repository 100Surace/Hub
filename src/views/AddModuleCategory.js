import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Container, Card, CardContent } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import Page from '../components/Page';
import { PATH_DASHBOARD } from '../routes/paths';
import HeaderDashboard from '../components/HeaderDashboard';
import { ModuleCategoryForm } from '../components/organization/moduleCategory';
import {
  getModuleCategories,
  updateModuleCategory,
  addModuleCategory,
  getModuleCategoryById
} from '../redux/slices/moduleCategory';
import { getModules } from '../redux/slices/module';

// ----------------------------------------------------------------------
function AddModuleCategory() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [editModule, setEditModule] = useState({});
  const [module, setModule] = useState({
    ids: 0,
    moduleName: 'Select Module Name'
  });
  const location = useLocation();
  const { moduleCategoryList } = useSelector((state) => state.moduleCategory);
  const { modulesList } = useSelector((state) => state.module);
  const { enqueueSnackbar } = useSnackbar();

  const ModuleCategorySchema = Yup.object().shape({
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
    validationSchema: ModuleCategorySchema,
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
              history.push(
                PATH_DASHBOARD.general.organization.moduleCategory.list
              );
            })
            .catch(() => {
              onError('Cannot update module category');
              setSubmitting(false);
            });
        } else {
          dispatch(addModuleCategory(values))
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

  const editId = location.search.split('=')[1];

  useEffect(() => {
    dispatch(getModuleCategories());
    dispatch(getModules());
    if (editId) {
      dispatch(getModuleCategoryById(editId)).then((res) => {
        formik.values.moduleCategoryName = res.moduleCategoryName;
        formik.values.moduleId = res.moduleId;
        setEditModule(res);
      });
    }
    // eslint-disable-next-line
  }, [editId, dispatch]);

  return (
    <Page title="New Post-Management | Minimal-UI">
      <Container>
        <HeaderDashboard
          heading="Create a new post"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'General' },
            { name: 'Organization' },
            { name: 'Module Category' },
            { name: 'New Module Category' }
          ]}
        />

        <Card>
          <CardContent>
            <ModuleCategoryForm
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

export default AddModuleCategory;
