'use client';

import { useToastStore } from '@/store/useToastStore';
import './UploadCompleteToast.scss';

const UploadCompleteToast = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="upload-complete-toast__container">
      {toasts.map((toast) => (
        <div key={toast.id} className="upload-complete-toast__wrapper">
          <div className={`upload-complete-toast__message upload-complete-toast__message--${toast.type}`}>
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadCompleteToast;
