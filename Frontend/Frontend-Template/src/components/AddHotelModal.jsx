import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";

const EMPTY = { name: "", description: "", address: "", city: "", starRating: "3" };

const VALIDATORS = {
  name:        (v) => v.trim().length >= 2  ? null : "Hotel name is required (min 2 chars).",
  city:        (v) => v.trim().length >= 2  ? null : "City is required.",
  address:     (v) => v.trim().length >= 5  ? null : "Address is required (min 5 chars).",
  starRating:  (v) => [1,2,3,4,5].includes(Number(v)) ? null : "Select a star rating.",
  description: ()  => null, // optional
};

/**
 * AddHotelModal — create or edit a hotel.
 *
 * Props:
 *   show        : boolean
 *   hotel       : object | null  — if set, form is in edit mode
 *   onClose     : () => void
 *   onSave      : (formData, isEdit) => Promise<void>
 */
export default function AddHotelModal({ show, hotel, onClose, onSave }) {
  const isEdit = !!hotel;

  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [apiErr,  setApiErr]  = useState("");

  // Populate form when editing
  useEffect(() => {
    if (show) {
      setForm(hotel
        ? { name: hotel.name, description: hotel.description ?? "", address: hotel.address ?? "", city: hotel.city, starRating: String(hotel.starRating) }
        : EMPTY
      );
      setErrors({});
      setApiErr("");
    }
  }, [show, hotel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: VALIDATORS[name]?.(value) }));
  };

  const validate = () => {
    const errs = {};
    Object.keys(VALIDATORS).forEach((k) => {
      const e = VALIDATORS[k](form[k] ?? "");
      if (e) errs[k] = e;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiErr("");
    try {
      await onSave({ ...form, starRating: Number(form.starRating) }, isEdit);
      onClose();
    } catch (err) {
      setApiErr(typeof err === "string" ? err : err.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>
          {isEdit ? "✏️ Edit Hotel" : "🏨 Add New Hotel"}
        </Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body className="pt-2">
          {apiErr && <Alert variant="danger" className="py-2 small">{apiErr}</Alert>}

          <Row className="g-3">
            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Hotel Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="name"
                  placeholder="e.g. The Grand Horizon"
                  value={form.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  disabled={saving}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Star Rating <span className="text-danger">*</span></Form.Label>
                <Form.Select name="starRating" value={form.starRating} onChange={handleChange} isInvalid={!!errors.starRating} disabled={saving}>
                  {[1,2,3,4,5].map((s) => (
                    <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.starRating}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">City <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="city"
                  placeholder="e.g. New York"
                  value={form.city}
                  onChange={handleChange}
                  isInvalid={!!errors.city}
                  disabled={saving}
                />
                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  name="address"
                  placeholder="e.g. 100 Main Street"
                  value={form.address}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                  disabled={saving}
                />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description <span className="text-muted fw-normal">(optional)</span></Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={3}
                  placeholder="Brief description of the hotel..."
                  value={form.description}
                  onChange={handleChange}
                  disabled={saving}
                  style={{ resize: "none" }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            type="submit"
            disabled={saving}
            style={{ backgroundColor: "#e94560", border: "none", minWidth: "120px" }}
          >
            {saving
              ? <><Spinner as="span" animation="border" size="sm" className="me-2" />{isEdit ? "Saving..." : "Adding..."}</>
              : isEdit ? "Save Changes" : "Add Hotel"
            }
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
