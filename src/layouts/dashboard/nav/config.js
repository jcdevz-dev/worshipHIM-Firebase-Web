// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'artists',
    path: '/dashboard/artists',
    icon: icon('ic_user'),
  },
  {
    title: 'songs',
    path: '/dashboard/songs',
    icon: icon('ic_user'),
  },
];

export default navConfig;
