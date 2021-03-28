import * as Yup from 'yup';
import { useFormik } from 'formik';
import Page from 'src/components/Page';
import NewModuleForm from './NewModuleForm';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { PATH_APP } from 'src/routes/paths';
import { HeaderDashboard } from 'src/layouts/Common';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Card, CardContent } from '@material-ui/core';
import { addNewModule } from 'src/redux/slices/module';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {}
}));

// ----------------------------------------------------------------------

function NewPostView() {
  const dispatch = useDispatch();
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
        const onSuccess = () => {
          enqueueSnackbar('Module added', {
            variant: 'success'
          });
        };
        const onError = () => {
          enqueueSnackbar('Cannot add mdule', {
            variant: 'error'
          });
        };
        dispatch(addNewModule(values))
          .then(() => {
            onSuccess();
            resetForm();
            setSubmitting(false);
          })
          .catch(() => {
            onError();
            setSubmitting(false);
          });
      } catch (error) {
        setSubmitting(false);
        setErrors({ afterSubmit: error.code });
      }
    }
  });

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
            <NewModuleForm formik={formik} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default NewPostView;
