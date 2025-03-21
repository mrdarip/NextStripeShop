'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          overflow-y: auto;
          gap: 20px;
          background: white;
          padding: 20px;
          border-radius: 5px;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: red;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `}</style>
    </div>,
    document.body
  );
}