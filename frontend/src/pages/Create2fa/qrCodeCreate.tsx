import { useEffect, useState } from 'react';
import axios from 'axios';

const QRCodeImage = () => {
  const [qrCode, setQRCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await  axios.get('http://f1r1s3.codam.nl:3001/auth/enable2fa', {
            withCredentials:true,
          responseType: 'arraybuffer',
        });

        const arrayBufferView = new Uint8Array(response.data);
        const blob = new Blob([arrayBufferView], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        setQRCode(imageUrl);
      } catch (error) {
        localStorage.clear()
        window.location.href= '/login'
      }
    };

    fetchQRCode();
  }, []);

  return <img src={qrCode || ''} alt="QR Code" className='QRimage' />;
};

export default QRCodeImage;
