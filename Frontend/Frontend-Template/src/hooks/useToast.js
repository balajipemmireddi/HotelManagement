import { useState, useCallback } from "react";

/**
 * useToast — lightweight hook for managing a single toast notification.
 *
 * Returns:
 *   toast      : { show, msg, variant }
 *   showToast  : (msg, variant?) => void
 *   hideToast  : () => void
 *
 * Usage:
 *   const { toast, showToast, hideToast } = useToast();
 *   showToast("Saved!", "success");
 *   showToast("Something went wrong.", "danger");
 *   <AppToast toast={toast} onClose={hideToast} />
 */
export function useToast() {
  const [toast, setToast] = useState({ show: false, msg: "", variant: "success" });

  const showToast = useCallback((msg, variant = "success") => {
    setToast({ show: true, msg, variant });
  }, []);

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, show: false }));
  }, []);

  return { toast, showToast, hideToast };
}
