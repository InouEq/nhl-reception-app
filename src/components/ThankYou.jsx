import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qrHash = location.state?.qrHash;

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>登録ありがとうございました！</h1>
      <p>以下のQRコードを受付でご提示ください。</p>

      {/* QRコード表示（ハッシュがあるときのみ） */}
      {qrHash ? (
        <div style={{ margin: '30px auto' }}>
          <QRCodeSVG value={qrHash} size={256} />
          <p style={{ marginTop: '10px', wordBreak: 'break-word' }}>{qrHash}</p>
        </div>
      ) : (
        <p>QRコードを生成できませんでした。</p>
      )}

      {/* 戻るボタン */}
      <div style={{ marginTop: '30px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px' }}>
          戻る
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
