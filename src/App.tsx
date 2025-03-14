import { useState, useRef } from 'react';

export default function App() {
  const [mimeType, setMimeType] = useState('');
  const [mimeTypeAfter, setMimeTypeAfter] = useState('');
  const [error, setError] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mimeTypes = [
        'video/mp4;',
        'video/webm; codecs="vp9"',
        'video/mp4; codecs="avc1"',
        'video/mp4; codecs="avc1.42E01E"',
        'video/webm; codecs="vp8"',
      ];

      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
      if (!supportedMimeType) {
        setError('サポートされているMIMEタイプが見つかりませんでした');
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
      mediaRecorderRef.current = mediaRecorder;
      setMimeType(supportedMimeType);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setMimeTypeAfter(event.data.type)
          recordedChunks.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setError('');
      console.log('録画を開始しました');
    } catch (err) {
      setError(`エラーが発生しました: ${err}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        recordedChunks.current = [];
        console.log('録画が停止されました');
      };
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MediaRecorder MIMEタイプ確認</h1>
      <strong>video/mp4;:</strong> {`${MediaRecorder.isTypeSupported('video/mp4;')}`}<br />
      <strong>video/mp4; codecs="avc1": </strong>{`${MediaRecorder.isTypeSupported('video/mp4; codecs="avc1"')}`}<br />
      <strong>video/mp4; codecs="avc1.42E01E":</strong> {`${MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E"')}`}<br />
      <strong>video/webm; codecs="vp8":</strong> {`${MediaRecorder.isTypeSupported('video/webm; codecs="vp8"')}`}<br />
      <strong>video/webm; codecs="vp9":</strong> {`${MediaRecorder.isTypeSupported('video/webm; codecs="vp9"')}`}<br />
      <button onClick={startRecording}>録画を開始</button>
      <button onClick={stopRecording} style={{ marginLeft: '10px' }}>
        録画を停止
      </button>
      <p>
        <strong>MediaRecorderのMIMEタイプ:</strong> {mimeType || '未確認'}<br />
        <strong>MediaRecorderのMIMEタイプ撮影後:</strong> {mimeTypeAfter || '未確認'}
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {videoURL && (
        <div>
          <h2>録画したビデオ:</h2>
          <video src={videoURL} controls style={{ maxWidth: '100%' }}></video>
        </div>
      )}
    </div>
  );
}
