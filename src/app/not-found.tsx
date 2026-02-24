export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#eee',
      fontFamily: 'Courier New, monospace',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '72px', marginBottom: '20px' }}>🎰</h1>
      <h2 style={{ color: '#ffd700', marginBottom: '16px' }}>404</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>
        Page not found. Better luck next spin!
      </p>
      <a 
        href="/"
        style={{
          padding: '16px 32px',
          background: '#e94560',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Back to Casino
      </a>
    </div>
  );
}