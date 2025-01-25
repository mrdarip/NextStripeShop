import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
          background: white;
          padding: 20px;
          border-radius: 8px;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ff0000; /* Change this to your desired background color */
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-close:hover {
          background: #cc0000; /* Darker shade for hover effect */
        }
      `}</style>
    </div>
  );
};

export default Modal;