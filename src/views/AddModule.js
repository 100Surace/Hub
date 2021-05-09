import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { Container, Card, CardContent } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { addModule, getModuleById, updateModule } from '../redux/slices/module';
import { PATH_DASHBOARD } from '../routes/paths';
import HeaderDashboard from '../components/HeaderDashboard';
import Page from '../components/Page';
import ModuleForm from '../components/organization/module/ModuleForm';

// ----------------------------------------------------------------------
function AddModuleView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [editModule, setEditModule] = useState({});
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const ModuleSchema = Yup.object().shape({
    moduleName: Yup.string()
      .required('Module Name Is Required')
      .min(2, 'Minimum 2 chracters are required.')
  });

  const formik = useFormik({
    initialValues: {
      moduleName: ''
    },
    validationSchema: ModuleSchema,
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
          dispatch(updateModule(data.ids, data))
            .then(() => {
              onSuccess('Module updated');
              resetForm();
              setSubmitting(false);
              history.push(PATH_DASHBOARD.general.organization.module.list);
            })
            .catch(() => {
              onError('Cannot update module');
              setSubmitting(false);
            });
        } else {
          dispatch(addModule(values))
            .then(() => {
              onSuccess('Module added');
              resetForm();
              setSubmitting(false);
            })
            .catch(() => {
              onError('Cannot add module');
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
    if (editId) {
      dispatch(getModuleById(editId)).then((res) => {
        formik.values.moduleName = res.moduleName;
        setEditModule(res);
      });
    }
    // eslint-disable-next-line
  }, [editId, dispatch]);

  return (
    <Page title="Add New Module">
      <Container>
        <HeaderDashboard
          heading="Create a New Module"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root
            },
            {
              name: 'General',
              href: PATH_DASHBOARD.root
            },
            {
              name: 'Organization',
              href: PATH_DASHBOARD.root
            },
            {
              name: 'Module',
              href: PATH_DASHBOARD.general.organization.module.add
            },
            {
              name: 'Add Module'
            }
          ]}
        />

        <Card>
          <CardContent>
            <ModuleForm formik={formik} editModule={editModule} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default AddModuleView;
