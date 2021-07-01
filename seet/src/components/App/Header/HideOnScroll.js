import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return matches ? (
    children
  ) : (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
