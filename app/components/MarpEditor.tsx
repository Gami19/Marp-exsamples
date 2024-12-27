// components/MarpEditor.tsx
'use client'; // クライアントコンポーネントであることを明示

import React, { useState } from 'react';

async function convertMarkdown(markdown: string, css: string, format: string): Promise<string | Blob> {
  const res = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markdown, css, format }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Conversion failed');
  }

  if (format === 'pptx') {
    return res.blob();
  } else {
    return res.text();
  }
}

export default function MarpEditor() {
  const [markdown, setMarkdown] = useState<string>('# Hello Marp');
  const [css, setCss] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (format: string) => {
    try {
      const convertedResult = await convertMarkdown(markdown, css, format);
      if (format === 'pptx') {
        const blob = convertedResult as Blob; // Blob型にキャスト
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'presentation.docx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        setResult(convertedResult as string); // string型にキャスト
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} />
      <textarea value={css} onChange={(e) => setCss(e.target.value)} />
      <button onClick={() => handleConvert('html')}>Preview</button>
      <button onClick={() => handleConvert('pptx')}>Download PPTX</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {result && <div dangerouslySetInnerHTML={{ __html: result }} />}
    </div>
  );
}