import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SHA256 from 'crypto-js/sha256';

const QRCodeGenerator = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const generateHash = (input) => SHA256(input).toString();

  const saveToDB = async () => {
    if (!name) {
      alert('名前を入力してください');
      return;
    }

    const hash = generateHash(name);

    const { error } = await supabase
      .from('reception')
      .insert([{ name, qr_hash: hash }]);

    //ここでメールを送信する予定
    //画像を添付して送信する必要あり
    if (error) {
      console.error('保存失敗:', error.message);
      alert('DBへの保存に失敗しました。');
    } else {
      navigate('/thanks', { state: { qrHash: hash } });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>受付QRコード生成</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
        style={{ padding: '10px', width: '300px' }}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={saveToDB} style={{ padding: '10px 20px' }}>
          DBに保存する
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
