export type ToastEventDetail = { message: string; type: 'success' | 'error' };

export function toast(message: string, type: 'success' | 'error' = 'success') {
  const ev = new CustomEvent<ToastEventDetail>('app:toast', { detail: { message, type } as any });
  window.dispatchEvent(ev);
}

export function toastSuccess(message: string) {
  toast(message, 'success');
}

export function toastError(message: string) {
  toast(message, 'error');
}
