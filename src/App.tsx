import { useEffect, useState } from 'react';

export default function App() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const mimeType = 'video/mp4; codecs="avc1.42E01E"';
    const supported = MediaRecorder.isTypeSupported(mimeType);
    setIsSupported(supported);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MP4 H.264 サポートチェック</h1>
      <p>
        <strong>ブラウザのサポート状況:</strong>{' '}
        {isSupported === null
          ? '判定中...'
          : isSupported
          ? 'サポートされています ✅'
          : 'サポートされていません ❌'}
      </p>
    </div>
  );
}
