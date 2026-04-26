/** File을 base64 data URI 문자열로 변환 */
export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', () => reject(new Error('파일을 읽는 데 실패했습니다.')));
    reader.readAsDataURL(file);
  });
}

/** 이미지를 브라우저 다운로드로 트리거 (data URI, blob URL, HTTP URL 모두 지원) */
export async function downloadImage(url: string, filename: string): Promise<void> {
  const anchor = document.createElement('a');
  anchor.download = filename;

  if (url.startsWith('data:')) {
    // data URI는 fetch 없이 직접 사용 (fetch('data:...')는 Safari에서 불안정)
    anchor.href = url;
  } else {
    const response = await fetch(url);
    const blob = await response.blob();
    anchor.href = URL.createObjectURL(blob);
  }

  // Firefox는 DOM에 붙어 있지 않은 앵커의 .click()을 무시한다
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  // blob URL인 경우에만 해제
  if (anchor.href.startsWith('blob:')) {
    URL.revokeObjectURL(anchor.href);
  }
}
