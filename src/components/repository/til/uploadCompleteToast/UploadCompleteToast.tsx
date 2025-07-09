'use client';

import { useEffect, useRef } from 'react';
import { useToastStore } from '@/store/useToastStore';
import './UploadCompleteToast.scss';

const UploadCompleteToast = () => {
  const toasts = useToastStore((state) => state.toasts);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const updateToastPosition = () => {
      const frame = document.querySelector('.layout__frame');
      const toast = toastRef.current;
      if (!frame || !toast) return;
      const rect = frame.getBoundingClientRect();
      toast.style.left = `${rect.right - 320}px`;
      toast.style.bottom = '120px';
      toast.style.opacity = '1';
    };

    updateToastPosition();
    window.addEventListener('resize', updateToastPosition);
    window.addEventListener('scroll', updateToastPosition);

    return () => {
      window.removeEventListener('resize', updateToastPosition);
      window.removeEventListener('scroll', updateToastPosition);
    };
  }, []);

  return (
    <div ref={toastRef} className="upload-complete-toast__container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`upload-complete-toast__message upload-complete-toast__message--${toast.type}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default UploadCompleteToast;
