// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'One', path: PATH_DASHBOARD.general.pageOne, icon: ICONS.dashboard },
      { title: 'Two', path: PATH_DASHBOARD.general.pageTwo, icon: ICONS.ecommerce },
      { title: 'Three', path: PATH_DASHBOARD.general.pageThree, icon: ICONS.analytics }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: PATH_DASHBOARD.app.root,
        icon: ICONS.user,
        children: [
          { title: 'Four', path: PATH_DASHBOARD.app.pageFour },
          { title: 'Five', path: PATH_DASHBOARD.app.pageFive },
          { title: 'Six', path: PATH_DASHBOARD.app.pageSix }
        ]
      },
      // MANAGEMENT : E-COMMERCE
      {
        title: 'e-commerce',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
          { title: 'product', path: PATH_DASHBOARD.eCommerce.productById },
          { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'create', path: PATH_DASHBOARD.eCommerce.newProduct },
          { title: 'edit', path: PATH_DASHBOARD.eCommerce.editById },
          { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
          { title: 'invoice', path: PATH_DASHBOARD.eCommerce.invoice }
        ]
      }
    ]
  }
];

export default sidebarConfig;
