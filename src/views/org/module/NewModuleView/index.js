import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Page from 'src/components/Page';
import NewModuleForm from './NewModuleForm';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { PATH_APP } from 'src/routes/paths';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Card, CardContent } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import {
  addNewModule,
  getModuleById,
  updateModule
} from 'src/redux/slices/module';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

function NewPostView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [editModule, setEditModule] = useState({});
  const location = useLocation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const NewBlogSchema = Yup.object().shape({
    moduleName: Yup.string().required('Module Name Is Required')
  });

  const formik = useFormik({
    initialValues: {
      moduleName: ''
    },
    validationSchema: NewBlogSchema,
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
              history.push(PATH_APP.management.org.list);
            })
            .catch(() => {
              onError('Cannot update module');
              setSubmitting(false);
            });
        } else {
          dispatch(addNewModule(values))
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

  const edit_id = location.search.split('=')[1];

  useEffect(() => {
    if (edit_id) {
      dispatch(getModuleById(edit_id)).then((res) => {
        formik.values.moduleName = res.moduleName;
        setEditModule(res);
      });
    }
  }, [edit_id, dispatch]);

  return (
    <Page title="New Module-Management" className={classes.root}>
      <Container>
        <HeaderDashboard
          heading="Create a new module"
          links={[
            { name: 'Dashboard', href: PATH_APP.root },
            { name: 'Management', href: PATH_APP.management.root },
            { name: 'Org', href: PATH_APP.management.org.root },
            { name: 'New Module' }
          ]}
        />

        <Card>
          <CardContent>
            <NewModuleForm formik={formik} editModule={editModule} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default NewPostView;
