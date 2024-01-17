const Overlay = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      padding: '16px',
      textAlign: 'center',
    }}
  >
    <p style={{ color: '#fff' }}>No internet connection. Please check your connection.</p>
  </div>
);

export default Overlay;
