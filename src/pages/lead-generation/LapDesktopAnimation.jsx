import Lottie from 'react-lottie-player';
import LapDesktopCongrats from '../../assets/anim/Lap-Desktop-congrats.json';
import { forwardRef } from 'react';

const LoanAgainstPropertyDesktopAnimation = forwardRef(function HomeLoanAnimation(props, ref) {
  return <Lottie animationData={LapDesktopCongrats} {...props} ref={ref} />;
});

export default LoanAgainstPropertyDesktopAnimation;
