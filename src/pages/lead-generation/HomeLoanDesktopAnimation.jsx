import Lottie from 'react-lottie-player';
import HomeLoanDesktopCongrats from '../../assets/anim/Home-Desktop-congrats.json';
import { forwardRef } from 'react';

const HomeLoanDesktopAnimation = forwardRef(function HomeLoanAnimation(props, ref) {
  return <Lottie animationData={HomeLoanDesktopCongrats} {...props} ref={ref} />;
});

export default HomeLoanDesktopAnimation;
