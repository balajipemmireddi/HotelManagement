import { Toast, ToastContainer } from "react-bootstrap";

/**
 * AppToast — standardised bottom-right toast notification.
 *
 * Props:
 *   toast   : { show: boolean, msg: string, variant: string }
 *   onClose : () => void
 *   delay   : number (ms, default 4000)
 */
export default function AppToast({ toast, onClose, delay = 4000 }) {
  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={toast.show}
        onClose={onClose}
        delay={delay}
        autohide
        bg={toast.variant}
      >
        <Toast.Body className="text-white fw-semibold d-flex align-items-center gap-2">
          {toast.variant === "success" && "✓ "}
          {toast.variant === "danger"  && "✕ "}
          {toast.variant === "warning" && "⚠ "}
          {toast.msg}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
