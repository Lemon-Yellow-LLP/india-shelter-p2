import Lottie from 'react-lottie-player';
import loanAgainstPropertyAnimation from '../../assets/anim/loan-against-property.json';

export default function LoanAgainstPropertyAnimation(props) {
  return <Lottie animationData={loanAgainstPropertyAnimation} {...props} />;
}
