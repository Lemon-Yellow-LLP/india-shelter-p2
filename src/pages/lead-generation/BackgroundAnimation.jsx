import Lottie from 'react-lottie-player';
import homeLoanBgAnimation from '../../assets/anim/home-loan-bg.json';

export default function BackgroundAnimation(props) {
  return <Lottie animationData={homeLoanBgAnimation} {...props} />;
}
