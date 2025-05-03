// Admin.jsx
import React, { useState, useEffect } from 'react';
import QRScanner from './QrScanner';

const Admin = () => {
  const [viewScanner, setViewScanner] = useState(false);

  useEffect(() => {
    // 必要に応じてadminの初期化処理
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>管理者ページ</h1>

      {/* QRスキャナーのトグルボタン */}
      <button onClick={() => setViewScanner(!viewScanner)}>
        {viewScanner ? 'スキャナーを閉じる' : 'QRスキャナーを開く'}
      </button>

      {/* スキャナー表示 */}
      {viewScanner && <QRScanner />}

      {/* 他のadminコンテンツもここに表示 */}
      <div>
        {/* 他の管理者用の内容 */}
      </div>
    </div>
  );
};

export default Admin;
