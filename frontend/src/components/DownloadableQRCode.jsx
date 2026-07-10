import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';

export default function DownloadableQRCode({ value, size = 150 }) {
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-qr-${value}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
      <div 
        ref={qrRef} 
        style={{ 
          background: '#fff', 
          padding: '10px', 
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <QRCodeCanvas value={value} size={size} level="H" />
      </div>
      <button 
        onClick={handleDownload}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(124, 58, 237, 0.2)',
          border: '1px solid rgba(124, 58, 237, 0.5)',
          color: '#fff',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 600,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(124, 58, 237, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(124, 58, 237, 0.2)';
        }}
      >
        <Download size={16} />
        Download QR
      </button>
    </div>
  );
}
