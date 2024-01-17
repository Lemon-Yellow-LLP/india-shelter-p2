import ConnectionLost from '../../assets/icons/connection-lost';
import Header from '../Header';

const Overlay = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 10000,
      textAlign: 'center',
    }}
  >
    <div>
      <Header />
      <p
        style={{
          color: '#fff',
          padding: '16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ConnectionLost />
      </p>
    </div>
  </div>
);

export default Overlay;
