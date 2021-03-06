import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
//
import { PATH_DASHBOARD } from './paths';

// ----------------------------------------------------------------------

const DashboardRoutes = {
  path: PATH_DASHBOARD.root,
  layout: DashboardLayout,
  routes: [
    // GENERAL
    // Organization
    // Module
    {
      exact: true,
      path: PATH_DASHBOARD.general.organization.module.add,
      component: lazy(() => import('../views/AddModule'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.organization.module.list,
      component: lazy(() => import('../views/ModuleList'))
    },
    // Module Category
    {
      exact: true,
      path: PATH_DASHBOARD.general.organization.moduleCategory.add,
      component: lazy(() => import('../views/AddModuleCategory'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.organization.moduleCategory.list,
      component: lazy(() => import('../views/ModuleCategoryList'))
    },
    // GENERAL
    // User
    // Profile
    {
      exact: true,
      path: PATH_DASHBOARD.general.user.profile,
      component: lazy(() => import('../views/AccountView'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.pageOne,
      component: lazy(() => import('../views/PageOne'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.pageTwo,
      component: lazy(() => import('../views/PageTwo'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.general.pageThree,
      component: lazy(() => import('../views/PageThree'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.root,
      component: () => <Redirect to={PATH_DASHBOARD.general.pageOne} />
    },

    // ----------------------------------------------------------------------
    // APP
    {
      exact: true,
      path: PATH_DASHBOARD.app.pageFour,
      component: lazy(() => import('../views/PageFour'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.app.pageFive,
      component: lazy(() => import('../views/PageFive'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.app.pageSix,
      component: lazy(() => import('../views/PageSix'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.app.root,
      component: () => <Redirect to={PATH_DASHBOARD.app.pageFour} />
    },
    // ----------------------------------------------------------------------

    {
      component: () => <Redirect to="/404" />
    }
  ]
};

export default DashboardRoutes;
