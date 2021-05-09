// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: 22, height: 22 }}
  />
);

const ICONS = {
  page: getIcon('ic_page'),
  dashboard: getIcon('ic_dashboard')
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'Organization',
        href: PATH_DASHBOARD.app.root,
        icon: ICONS.dashboard,
        items: [
          {
            title: 'Module',
            href: PATH_DASHBOARD.root,
            items: [
              {
                title: 'Add Module',
                href: PATH_DASHBOARD.general.organization.module.add
              },
              {
                title: 'Module List',
                href: PATH_DASHBOARD.general.organization.module.list
              }
            ]
          }
        ]
      }
    ]
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'Drop',
        href: PATH_DASHBOARD.app.root,
        icon: ICONS.dashboard,
        items: [
          {
            title: 'page Four',
            href: PATH_DASHBOARD.app.pageFour
          },
          {
            title: 'Page Five',
            href: PATH_DASHBOARD.app.pageFive
          },
          {
            title: 'Page Six',
            href: PATH_DASHBOARD.app.pageSix
          }
        ]
      }
    ]
  }
];

export default sidebarConfig;
