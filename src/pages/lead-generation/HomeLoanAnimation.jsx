import Lottie from 'react-lottie-player';
import homeLoanAnimation from '../../assets/anim/home-loan.json';
import { forwardRef } from 'react';

const HomeLoanAnimation = forwardRef(function HomeLoanAnimation(props, ref) {
  return <Lottie animationData={homeLoanAnimation} {...props} ref={ref} />;
});

export default HomeLoanAnimation;
