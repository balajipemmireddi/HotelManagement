import { useState, useEffect } from "react";
import { Modal, Button, Badge, Spinner, Alert, ListGroup } from "react-bootstrap";
import { adminGetRoomCategories, adminToggleRoomStatus } from "../services/AdminService";

const STATUS_OPTIONS = ["AVAILABLE", "MAINTENANCE", "CLEANING"];

const STATUS_CONFIG = {
  AVAILABLE:   { bg: "success",  label: "Available"   },
  MAINTENANCE: { bg: "danger",   label: "Maintenance" },
  CLEANING:    { bg: "warning",  label: "Cleaning"    },
};

/**
 * RoomStatusModal — view and toggle room category statuses for a hotel.
 *
 * Props:
 *   show    : boolean
 *   hotel   : { id, name } | null
 *   onClose : () => void
 */
export default function RoomStatusModal({ show, hotel, onClose }) {
  const [rooms,    setRooms]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [toggling, setToggling] = useState(null); // roomId being toggled
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (show && hotel) {
      setLoading(true);
      setError("");
      adminGetRoomCategories(hotel.id)
        .then((data) => setRooms(data.map((r) => ({ ...r, status: r.status ?? "AVAILABLE" }))))
        .catch(() => setError("Failed to load room categories."))
        .finally(() => setLoading(false));
    }
  }, [show, hotel]);

  const handleToggle = async (room, newStatus) => {
    setToggling(room.id);
    try {
      await adminToggleRoomStatus(room.id, newStatus);
      setRooms((prev) => prev.map((r) => r.id === room.id ? { ...r, status: newStatus } : r));
    } catch {
      setError("Failed to update status.");
    } finally {
      setToggling(null);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>
          🛏️ Room Status — {hotel?.name}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger" className="py-2 small mb-3">{error}</Alert>}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="secondary" size="sm" />
            <p className="text-muted small mt-2 mb-0">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <p className="text-muted small text-center py-3">No room categories found for this hotel.</p>
        ) : (
          <ListGroup variant="flush">
            {rooms.map((room) => {
              const cfg = STATUS_CONFIG[room.status] ?? STATUS_CONFIG.AVAILABLE;
              const isToggling = toggling === room.id;

              return (
                <ListGroup.Item key={room.id} className="px-0 py-2">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div>
                      <p className="fw-semibold mb-0 small">{room.categoryName}</p>
                      <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                        ${room.basePrice}/night
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg={cfg.bg} style={{ fontSize: "0.72rem" }}>{cfg.label}</Badge>
                      {/* Cycle through statuses */}
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        disabled={isToggling}
                        style={{ fontSize: "0.72rem", minWidth: "70px" }}
                        onClick={() => {
                          const idx = STATUS_OPTIONS.indexOf(room.status);
                          const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
                          handleToggle(room, next);
                        }}
                      >
                        {isToggling
                          ? <Spinner as="span" animation="border" size="sm" />
                          : "Toggle"
                        }
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
