import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ColoringResult } from '@/entities/coloring';
import { canReconvert, getRemainingReconvertCount, useConvertStore } from './convert.store';

function makeResult(id: string): ColoringResult {
  return { id, imageDataUri: `data:image/webp;base64,${id}`, createdAt: 0 };
}

function makeFile(name: string, size: number): File {
  return new File([new ArrayBuffer(size)], name, { type: 'image/png' });
}

const initialSnapshot = useConvertStore.getState();

beforeEach(() => {
  // 각 테스트 격리: 상태와 액션을 모두 초기 스냅샷으로 복원
  useConvertStore.setState(initialSnapshot, true);
});

describe('canReconvert', () => {
  it('결과가 없으면 false를 반환한다 (첫 변환 전)', () => {
    expect(canReconvert([])).toBe(false);
  });

  it('결과 1개면 true를 반환한다 (첫 변환 직후, 재변환 가능)', () => {
    expect(canReconvert([makeResult('a')])).toBe(true);
  });

  it('결과 2개면 true를 반환한다 (MAX_RECONVERT_COUNT 경계)', () => {
    expect(canReconvert([makeResult('a'), makeResult('b')])).toBe(true);
  });

  it('결과 3개면 false를 반환한다 (재변환 한도 초과)', () => {
    expect(canReconvert([makeResult('a'), makeResult('b'), makeResult('c')])).toBe(false);
  });
});

describe('getRemainingReconvertCount', () => {
  it('결과가 없으면 2를 반환한다', () => {
    expect(getRemainingReconvertCount([])).toBe(2);
  });

  it('결과 1개여도 2를 반환한다 (첫 변환은 카운트하지 않음)', () => {
    expect(getRemainingReconvertCount([makeResult('a')])).toBe(2);
  });

  it('결과 2개면 1을 반환한다', () => {
    expect(getRemainingReconvertCount([makeResult('a'), makeResult('b')])).toBe(1);
  });

  it('결과 3개면 0을 반환한다', () => {
    expect(getRemainingReconvertCount([makeResult('a'), makeResult('b'), makeResult('c')])).toBe(0);
  });
});

describe('useConvertStore — setUploadedFile', () => {
  it('첫 업로드 시 identity와 previewUri를 저장한다', () => {
    useConvertStore.getState().setUploadedFile(makeFile('a.png', 100), 'data:preview-a');

    const state = useConvertStore.getState();
    expect(state.uploadedFileName).toBe('a.png:100');
    expect(state.previewUri).toBe('data:preview-a');
    expect(state.error).toBeNull();
  });

  it('동일 파일(name+size) 재업로드는 기존 results를 유지한다', () => {
    useConvertStore.setState({
      uploadedFileName: 'a.png:100',
      results: [makeResult('r1')],
    });

    useConvertStore.getState().setUploadedFile(makeFile('a.png', 100), 'data:preview-a-2');

    const state = useConvertStore.getState();
    expect(state.results).toHaveLength(1);
    expect(state.previewUri).toBe('data:preview-a-2');
    expect(state.error).toBeNull();
  });

  it('다른 파일 업로드 시 results와 error를 모두 초기화한다', () => {
    useConvertStore.setState({
      uploadedFileName: 'a.png:100',
      previewUri: 'data:preview-a',
      results: [makeResult('r1'), makeResult('r2')],
      error: '이전 에러',
      conversionDurationMs: 1234,
    });

    useConvertStore.getState().setUploadedFile(makeFile('b.png', 200), 'data:preview-b');

    const state = useConvertStore.getState();
    expect(state.uploadedFileName).toBe('b.png:200');
    expect(state.previewUri).toBe('data:preview-b');
    expect(state.results).toEqual([]);
    expect(state.error).toBeNull();
    expect(state.conversionDurationMs).toBeNull();
  });

  it('파일명은 같지만 size가 다르면 다른 파일로 간주한다', () => {
    useConvertStore.setState({
      uploadedFileName: 'a.png:100',
      results: [makeResult('r1')],
    });

    useConvertStore.getState().setUploadedFile(makeFile('a.png', 999), 'data:preview-x');

    const state = useConvertStore.getState();
    expect(state.uploadedFileName).toBe('a.png:999');
    expect(state.results).toEqual([]);
  });
});

describe('useConvertStore — setConverting / addResult (duration 계산)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('setConverting(true)는 isConverting/error/conversionStartedAt을 갱신한다', () => {
    useConvertStore.setState({ error: '이전 에러' });

    useConvertStore.getState().setConverting(true);

    const state = useConvertStore.getState();
    expect(state.isConverting).toBe(true);
    expect(state.error).toBeNull();
    expect(state.conversionStartedAt).toBe(Date.now());
  });

  it('setConverting(false)는 isConverting만 false로 만든다 (startedAt 유지)', () => {
    useConvertStore.setState({
      isConverting: true,
      conversionStartedAt: 12_345,
    });

    useConvertStore.getState().setConverting(false);

    const state = useConvertStore.getState();
    expect(state.isConverting).toBe(false);
    expect(state.conversionStartedAt).toBe(12_345);
  });

  it('addResult는 conversionStartedAt을 기준으로 durationMs를 계산하고 startedAt을 비운다', () => {
    useConvertStore.getState().setConverting(true);
    const startedAt = useConvertStore.getState().conversionStartedAt!;

    vi.advanceTimersByTime(2500);
    useConvertStore.getState().addResult(makeResult('r1'));

    const state = useConvertStore.getState();
    expect(state.results).toEqual([makeResult('r1')]);
    expect(state.isConverting).toBe(false);
    expect(state.error).toBeNull();
    expect(state.conversionStartedAt).toBeNull();
    expect(state.conversionDurationMs).toBe(Date.now() - startedAt);
    expect(state.conversionDurationMs).toBe(2500);
  });

  it('conversionStartedAt이 없으면 durationMs는 null로 둔다', () => {
    useConvertStore.setState({ conversionStartedAt: null });

    useConvertStore.getState().addResult(makeResult('r1'));

    expect(useConvertStore.getState().conversionDurationMs).toBeNull();
  });

  it('addResult는 기존 results 뒤에 새 결과를 append 한다', () => {
    useConvertStore.setState({ results: [makeResult('r1')] });

    useConvertStore.getState().addResult(makeResult('r2'));

    expect(useConvertStore.getState().results.map((r) => r.id)).toEqual(['r1', 'r2']);
  });
});

describe('useConvertStore — setError / reset', () => {
  it('setError는 error를 세팅하고 isConverting을 false로 만든다', () => {
    useConvertStore.setState({ isConverting: true });

    useConvertStore.getState().setError('변환 실패');

    const state = useConvertStore.getState();
    expect(state.error).toBe('변환 실패');
    expect(state.isConverting).toBe(false);
  });

  it('setError(null)로 에러를 비울 수 있다', () => {
    useConvertStore.setState({ error: '이전 에러' });

    useConvertStore.getState().setError(null);

    expect(useConvertStore.getState().error).toBeNull();
  });

  it('reset은 모든 상태를 초기값으로 되돌린다', () => {
    useConvertStore.setState({
      uploadedFileName: 'x',
      previewUri: 'data:x',
      results: [makeResult('r1')],
      isConverting: true,
      error: 'err',
      conversionStartedAt: 10,
      conversionDurationMs: 20,
    });

    useConvertStore.getState().reset();

    const state = useConvertStore.getState();
    expect(state.uploadedFileName).toBeNull();
    expect(state.previewUri).toBeNull();
    expect(state.results).toEqual([]);
    expect(state.isConverting).toBe(false);
    expect(state.error).toBeNull();
    expect(state.conversionStartedAt).toBeNull();
    expect(state.conversionDurationMs).toBeNull();
  });
});
