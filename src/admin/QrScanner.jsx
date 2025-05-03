import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { supabase } from '../supabaseClient';  // Supabaseクライアントをインポート

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const streamRef = useRef(null);

  // QRコードをスキャンしてデータベースを更新する関数
  const handleScanResult = async (data) => {
    try {
      const { error } = await supabase
        .from('reception')
        .update({ is_checked_in: true })
        .eq('id', data);

      if (error) {
        console.error('データ更新失敗:', error.message);
      } else {
        console.log('データが正常に更新されました');
        setScanResult(`ID ${data} がチェックインされました。`);
      }
    } catch (error) {
      console.error('データベースの更新に失敗しました:', error.message);
    }
  };

  // カメラを起動する関数
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      videoRef.current.srcObject = stream;
      streamRef.current = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch((err) => {
          console.error('Video play failed:', err);
        });
        setIsCameraActive(true);
        requestAnimationFrame(scanQRCode);
      };
    } catch (err) {
      setErrorMessage('カメラの起動に失敗しました');
    }
  };

  // QRコードをスキャンする関数
  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // 高解像度の設定
      const videoWidth = 1280;
      const videoHeight = 720;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      context.drawImage(video, 0, 0, videoWidth, videoHeight);

      const imageData = context.getImageData(0, 0, videoWidth, videoHeight);

      if (imageData.width > 0 && imageData.height > 0) {
        const qrCode = jsQR(imageData.data, videoWidth, videoHeight);

        if (qrCode) {
          handleScanResult(qrCode.data);
          setIsCameraActive(false);
        } else {
          requestAnimationFrame(scanQRCode);
        }
      }
    }
  };

  // コンポーネントがマウントされたときにカメラを起動
  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>QRコードスキャナー</h2>

      <video ref={videoRef} width="1280" height="720" style={{ border: '1px solid black' }}></video>

      {scanResult && (
        <div>
          <h3>QRコードが読み取られました:</h3>
          <p>{scanResult}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {!isCameraActive && <button onClick={startCamera}>カメラを再起動</button>}
    </div>
  );
};

export default QRScanner;
