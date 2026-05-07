import { useState, useEffect, useCallback } from "react";
import {
  Container, Row, Col, Card, Table, Badge,
  Button, Spinner, Alert, Toast, ToastContainer,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  adminGetAllHotels,
  adminCreateHotel,
  adminUpdateHotel,
  adminDeleteHotel,
  adminGetRevenue,
  adminGetOccupancy,
} from "../services/AdminService";
import AddHotelModal   from "../components/AddHotelModal";
import RoomStatusModal from "../components/RoomStatusModal";

export default function AdminDashboard() {
  // ── Hotels list ───────────────────────────────────────
  const [hotels,       setHotels]       = useState([]);
  const [loadingList,  setLoadingList]  = useState(false);
  const [listError,    setListError]    = useState("");

  // ── Stats ─────────────────────────────────────────────
  const [revenue,      setRevenue]      = useState(null);
  const [occupancy,    setOccupancy]    = useState([]);

  // ── Modal state ───────────────────────────────────────
  const [showAddModal,    setShowAddModal]    = useState(false);
  const [editTarget,      setEditTarget]      = useState(null);  // hotel being edited
  const [showRoomModal,   setShowRoomModal]   = useState(false);
  const [roomTarget,      setRoomTarget]      = useState(null);  // hotel for room status
  const [deleteTarget,    setDeleteTarget]    = useState(null);  // hotel to delete
  const [deleting,        setDeleting]        = useState(false);

  // ── Toast ─────────────────────────────────────────────
  const [toast, setToast] = useState({ show: false, msg: "", variant: "success" });
  const showToast = (msg, variant = "success") => setToast({ show: true, msg, variant });

  // ── Load hotels ───────────────────────────────────────
  const loadHotels = useCallback(async () => {
    setLoadingList(true);
    setListError("");
    try {
      const data = await adminGetAllHotels();
      setHotels(data);
    } catch (err) {
      setListError(err.message ?? "Failed to load hotels.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  // ── Load stats ────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
      const [rev, occ] = await Promise.all([
        adminGetRevenue(monthAgo, today),
        adminGetOccupancy(),
      ]);
      setRevenue(rev);
      setOccupancy(occ);
    } catch {
      // Stats are non-critical — fail silently
    }
  }, []);

  useEffect(() => {
    loadHotels();
    loadStats();
  }, [loadHotels, loadStats]);

  // ── Create / Edit hotel ───────────────────────────────
  const handleSaveHotel = async (formData, isEdit) => {
    if (isEdit) {
      const updated = await adminUpdateHotel(editTarget.id, formData);
      setHotels((prev) => prev.map((h) => h.id === editTarget.id ? { ...h, ...updated } : h));
      showToast(`"${formData.name}" updated successfully.`);
    } else {
      const created = await adminCreateHotel(formData);
      setHotels((prev) => [created, ...prev]);
      showToast(`"${formData.name}" added successfully.`);
    }
    setEditTarget(null);
  };

  // ── Delete hotel ──────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteHotel(deleteTarget.id);
      setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      showToast(`"${deleteTarget.name}" deleted.`, "danger");
    } catch (err) {
      showToast(err.message ?? "Delete failed.", "danger");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)", padding: "40px 0 28px" }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="text-white fw-bold mb-1" style={{ fontSize: "1.6rem" }}>⚙️ Admin Panel</h1>
              <p className="mb-0" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
                Hotel & room management
              </p>
            </div>
            <Button
              style={{ backgroundColor: "#e94560", border: "none" }}
              onClick={() => { setEditTarget(null); setShowAddModal(true); }}
            >
              + Add Hotel
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-4">

        {/* ── Stats Row ── */}
        <Row className="g-3 mb-4">
          {[
            { label: "Total Hotels",   value: hotels.length,                          icon: "🏨", color: "#0f3460" },
            { label: "Active Hotels",  value: hotels.filter((h) => h.isActive !== false).length, icon: "✅", color: "#28a745" },
            { label: "Monthly Revenue",value: revenue ? `$${revenue.totalRevenue?.toLocaleString() ?? "—"}` : "—", icon: "💰", color: "#e94560" },
            { label: "Bookings (30d)", value: revenue?.bookingCount ?? "—",            icon: "📋", color: "#6c757d" },
          ].map((s) => (
            <Col xs={6} lg={3} key={s.label}>
              <Card className="border-0 shadow-sm h-100 p-3" style={{ borderRadius: "10px" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                  <span className="text-muted small">{s.label}</span>
                </div>
                <p className="fw-bold mb-0" style={{ fontSize: "1.5rem", color: s.color }}>{s.value}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* ── Hotel List ── */}
          <Col xs={12} xl={8}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <Card.Header className="bg-white border-0 pt-3 pb-2 px-3" style={{ borderRadius: "12px 12px 0 0" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Hotel List</h5>
                  <Badge bg="light" text="dark" className="border">{hotels.length} hotels</Badge>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                {listError && (
                  <Alert variant="danger" className="m-3 py-2 small">{listError}</Alert>
                )}

                {loadingList ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="secondary" size="sm" />
                    <p className="text-muted small mt-2">Loading hotels...</p>
                  </div>
                ) : hotels.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <div style={{ fontSize: "2.5rem" }}>🏨</div>
                    <p className="mt-2 small">No hotels yet. Add one to get started.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0" style={{ fontSize: "0.85rem" }}>
                      <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr className="text-muted" style={{ fontSize: "0.75rem" }}>
                          <th className="fw-semibold py-3 ps-3">Hotel</th>
                          <th className="fw-semibold py-3">City</th>
                          <th className="fw-semibold py-3 text-center">Stars</th>
                          <th className="fw-semibold py-3 text-center">Status</th>
                          <th className="fw-semibold py-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotels.map((hotel) => (
                          <tr key={hotel.id} style={{ verticalAlign: "middle" }}>
                            <td className="ps-3">
                              <div className="d-flex align-items-center gap-2">
                                {hotel.image && (
                                  <img
                                    src={hotel.image}
                                    alt={hotel.name}
                                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                  />
                                )}
                                <div>
                                  <p className="fw-semibold mb-0" style={{ fontSize: "0.875rem" }}>{hotel.name}</p>
                                  <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>ID: {hotel.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted">{hotel.city}</td>
                            <td className="text-center" style={{ color: "#f5a623", letterSpacing: "1px" }}>
                              {stars(hotel.starRating)}
                            </td>
                            <td className="text-center">
                              <Badge bg={hotel.isActive !== false ? "success" : "secondary"} style={{ fontSize: "0.7rem" }}>
                                {hotel.isActive !== false ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="text-center">
                              <div className="d-flex gap-1 justify-content-center">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  style={{ fontSize: "0.72rem" }}
                                  onClick={() => { setEditTarget(hotel); setShowAddModal(true); }}
                                  title="Edit hotel"
                                >
                                  ✏️ Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  style={{ fontSize: "0.72rem" }}
                                  onClick={() => { setRoomTarget(hotel); setShowRoomModal(true); }}
                                  title="Manage room status"
                                >
                                  🛏️ Rooms
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  style={{ fontSize: "0.72rem" }}
                                  onClick={() => setDeleteTarget(hotel)}
                                  title="Delete hotel"
                                >
                                  🗑️
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* ── Right column: Occupancy + Quick Links ── */}
          <Col xs={12} xl={4}>
            {/* Occupancy */}
            <Card className="border-0 shadow-sm mb-3 p-3" style={{ borderRadius: "12px" }}>
              <h6 className="fw-bold mb-3">📊 Occupancy (Top Hotels)</h6>
              {occupancy.length === 0 ? (
                <p className="text-muted small mb-0">Loading occupancy data...</p>
              ) : (
                occupancy.map((o) => (
                  <div key={o.hotelId} className="mb-2">
                    <div className="d-flex justify-content-between small mb-1">
                      <span className="text-muted" style={{ fontSize: "0.8rem" }}>{o.hotelName}</span>
                      <span className="fw-semibold" style={{ fontSize: "0.8rem" }}>{o.occupancyRate}%</span>
                    </div>
                    <div className="progress" style={{ height: "6px", borderRadius: "3px" }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${o.occupancyRate}%`,
                          backgroundColor: o.occupancyRate > 80 ? "#28a745" : o.occupancyRate > 60 ? "#f5a623" : "#e94560",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </Card>

            {/* Quick links */}
            <Card className="border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <h6 className="fw-bold mb-3">⚡ Quick Links</h6>
              <div className="d-grid gap-2">
                <Button
                  style={{ backgroundColor: "#e94560", border: "none" }}
                  size="sm"
                  onClick={() => { setEditTarget(null); setShowAddModal(true); }}
                >
                  + Add New Hotel
                </Button>
                <Button as={Link} to="/hotels" variant="outline-secondary" size="sm">
                  🔍 View Public Listing
                </Button>
                <Button as={Link} to="/dashboard" variant="outline-secondary" size="sm">
                  👤 User Dashboard
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ── Add / Edit Hotel Modal ── */}
      <AddHotelModal
        show={showAddModal}
        hotel={editTarget}
        onClose={() => { setShowAddModal(false); setEditTarget(null); }}
        onSave={handleSaveHotel}
      />

      {/* ── Room Status Modal ── */}
      <RoomStatusModal
        show={showRoomModal}
        hotel={roomTarget}
        onClose={() => { setShowRoomModal(false); setRoomTarget(null); }}
      />

      {/* ── Delete Confirmation Modal ── */}
      <Modal show={!!deleteTarget} onHide={() => !deleting && setDeleteTarget(null)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>Delete Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <div className="text-center mb-3">
            <div style={{ fontSize: "2.5rem" }}>🗑️</div>
          </div>
          <p className="text-center mb-2">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          </p>
          <p className="text-muted small text-center mb-0">
            This will permanently remove the hotel and all associated data. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting} style={{ minWidth: "120px" }}>
            {deleting
              ? <><Spinner as="span" animation="border" size="sm" className="me-2" />Deleting...</>
              : "Delete Hotel"
            }
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Toast ── */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={4000}
          autohide
          bg={toast.variant}
        >
          <Toast.Body className="text-white fw-semibold">{toast.msg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}
