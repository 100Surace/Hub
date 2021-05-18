import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import React, { useState, useEffect } from 'react';
// import bellFill from '@iconify-icons/eva/bell-fill';
// import shareFill from '@iconify-icons/eva/share-fill';
import { useDispatch, useSelector } from 'react-redux';
// import roundVpnKey from '@iconify-icons/ic/round-vpn-key';
// import roundReceipt from '@iconify-icons/ic/round-receipt';
import roundAccountBox from '@iconify-icons/ic/round-account-box';
import { Container, Tab, Box, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import {
//   getCards,
//   getProfile,
//   getInvoices,
//   getAddressBook,
//   getNotifications
// } from 'src/redux/slices/user';
import { getMyOrg, updateOrg, addOrg } from '../redux/slices/organization';
import HeaderDashboard from '../components/HeaderDashboard';
import { PATH_DASHBOARD } from '../routes/paths';
import Page from '../components/Page';
import useIsMountedRef from '../hooks/useIsMountedRef';
import { General, UploadView } from '../components/user';
// import useAuth from 'src/hooks/useAuth';
// import Billing from './Billing';
// import ChangePassword from './ChangePassword';
// import Notifications from './Notifications';
// import SocialLinks from './SocialLinks';

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  root: {},
  tabBar: {
    marginBottom: theme.spacing(5)
  }
}));

// ----------------------------------------------------------------------

function AccountView() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('general');
  const dispatch = useDispatch();
  // const {
  //   cards,
  //   invoices,
  //   myProfile,
  //   addressBook,
  //   notifications
  // } = useSelector((state) => state.user);
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();
  // const { user, updateProfile } = useAuth();

  // Profile ---------------------------------------
  const { organizationsList: myOrg } = useSelector(
    (state) => state.organization
  );
  const { hasOrg } = useSelector((state) => state.organization);
  const { moduleCategoryList: mCategories } = useSelector(
    (state) => state.moduleCategory
  );
  const { modulesList: modules } = useSelector((state) => state.module);

  const OrgProfileSchema = Yup.object().shape({
    moduleCategoryId: Yup.string().required('Module name is required'),
    serviceType: Yup.string().required('Service type is required'),
    organizationType: Yup.string().required('Organization Type is required'),
    orgName: Yup.string().required('Organizaton name is required'),
    status: Yup.string().required('Status is required')
  });
  const OrgFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ids: 0,
      id: '',
      moduleCategoryId: 0,
      serviceType: 0,
      organizationType: 0,
      orgName: '',
      secondEmail: '',
      secondPhone: '',
      shortDesc: '',
      longDesc: '',
      logo: '',
      bannerImg: '',
      orgImg: '',
      status: false,
      imageFile: null,
      moduleId: 0
    },

    validationSchema: OrgProfileSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      delete values.moduleId;
      try {
        if (hasOrg)
          dispatch(updateOrg(values))
            .then(() => {
              enqueueSnackbar('Successfully updated', { variant: 'success' });
            })
            .catch(() => {
              enqueueSnackbar('Failed to update', { variant: 'error' });
            });
        else
          dispatch(addOrg(values))
            .then(() => {
              enqueueSnackbar('Organization added', { variant: 'success' });
            })
            .catch(() => {
              enqueueSnackbar('Failed to add organization', {
                variant: 'error'
              });
            });

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.code });
          setSubmitting(false);
        }
      }
    }
  });
  const orgProps = {
    OrgFormik,
    myOrg,
    mCategories,
    modules,
    hasOrg
  };

  // useEffect(() => {
  //   dispatch(getCards());
  //   dispatch(getAddressBook());
  //   dispatch(getInvoices());
  //   dispatch(getNotifications());
  //   dispatch(getProfile());
  // }, [dispatch]);

  // fetch necessary data on mount
  useEffect(() => {
    dispatch(getMyOrg());
  }, []);

  // if (!myProfile) {
  //   return null;
  // }

  // if (!cards) {
  //   return null;
  // }

  // if (!notifications) {
  //   return null;
  // }

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <General myProps={orgProps} />
    },
    {
      value: 'orgImage',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <UploadView />
    }
    // {
    //   value: 'billing',
    //   icon: <Icon icon={roundReceipt} width={20} height={20} />,
    //   component: (
    //     <Billing cards={cards} addressBook={addressBook} invoices={invoices} />
    //   )
    // },
    // {
    //   value: 'notifications',
    //   icon: <Icon icon={bellFill} width={20} height={20} />,
    //   component: <Notifications notifications={notifications} />
    // },
    // {
    //   value: 'social_links',
    //   icon: <Icon icon={shareFill} width={20} height={20} />,
    //   component: <SocialLinks myProfile={myProfile} />
    // },
    // {
    //   value: 'change_password',
    //   icon: <Icon icon={roundVpnKey} width={20} height={20} />,
    //   component: <ChangePassword />
    // }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page
      title="Account Settings-Management | Minimal-UI"
      className={classes.root}
    >
      <Container>
        <HeaderDashboard
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'General' },
            { name: 'User' },
            { name: 'Organization Profile' }
          ]}
        />

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
          className={classes.tabBar}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}

export default AccountView;
