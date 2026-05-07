import { ProgressBar } from "react-bootstrap";

const STEPS = ["Guest Details", "Payment", "Confirmation"];

/**
 * BookingWizard — step indicator shown at the top of the booking flow.
 *
 * Props:
 *   currentStep : 1 | 2 | 3
 */
export default function BookingWizard({ currentStep }) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mb-4">
      {/* Step labels */}
      <div className="d-flex justify-content-between mb-2">
        {STEPS.map((label, idx) => {
          const step = idx + 1;
          const isDone    = step < currentStep;
          const isActive  = step === currentStep;

          return (
            <div
              key={label}
              className="d-flex flex-column align-items-center"
              style={{ flex: 1 }}
            >
              {/* Circle */}
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mb-1 fw-bold"
                style={{
                  width: "32px",
                  height: "32px",
                  fontSize: "0.85rem",
                  backgroundColor: isDone
                    ? "#28a745"
                    : isActive
                    ? "#e94560"
                    : "#dee2e6",
                  color: isDone || isActive ? "#fff" : "#6c757d",
                  transition: "background-color 0.3s",
                }}
              >
                {isDone ? "✓" : step}
              </div>
              {/* Label */}
              <span
                className="small text-center"
                style={{
                  color: isActive ? "#e94560" : isDone ? "#28a745" : "#6c757d",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "0.75rem",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <ProgressBar
        now={progress}
        style={{ height: "4px", borderRadius: "2px" }}
        variant="danger"
      />
    </div>
  );
}
