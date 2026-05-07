import { useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import { MOCK_HOTELS } from "../data/mockHotels";

// Unique cities derived from mock data for the city filter dropdown
const CITIES = ["All Cities", ...new Set(MOCK_HOTELS.map((h) => h.city))];

// Sort options
const SORT_OPTIONS = [
  { value: "default",    label: "Default"           },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "stars_desc", label: "Stars: High → Low" },
  { value: "stars_asc",  label: "Stars: Low → High" },
];

export default function HotelListPage() {
  const [searchParams] = useSearchParams();

  // ── Filter state ──────────────────────────────────────
  const [search, setSearch]   = useState("");
  const [city, setCity]       = useState(searchParams.get("city") || "All Cities");
  const [minStars, setMinStars] = useState(0);
  const [sortBy, setSortBy]   = useState("default");

  // Simulate a brief loading state on first render (will be real API call in Phase 10)
  const [loading] = useState(false);

  // ── Derived filtered + sorted list ───────────────────
  const filtered = useMemo(() => {
    let list = [...MOCK_HOTELS];

    // Text search — matches name or city
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q)
      );
    }

    // City filter
    if (city && city !== "All Cities") {
      list = list.filter((h) => h.city === city);
    }

    // Minimum star rating
    if (minStars > 0) {
      list = list.filter((h) => h.starRating >= minStars);
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price_desc":
        list.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "stars_desc":
        list.sort((a, b) => b.starRating - a.starRating);
        break;
      case "stars_asc":
        list.sort((a, b) => a.starRating - b.starRating);
        break;
      default:
        break;
    }

    return list;
  }, [search, city, minStars, sortBy]);

  // ── Clear all filters ─────────────────────────────────
  const clearFilters = () => {
    setSearch("");
    setCity("All Cities");
    setMinStars(0);
    setSortBy("default");
  };

  const hasActiveFilters =
    search.trim() || city !== "All Cities" || minStars > 0 || sortBy !== "default";

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* ── Page Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          padding: "48px 0 32px",
        }}
      >
        <Container>
          <h1 className="text-white fw-bold mb-1">Browse Hotels</h1>
          <p className="mb-0" style={{ color: "rgba(255,255,255,0.65)" }}>
            {MOCK_HOTELS.length} hotels available worldwide
          </p>
        </Container>
      </div>

      <Container className="py-4">
        {/* ── Filter Bar ── */}
        <Row className="g-2 mb-4 align-items-end">
          {/* Search input */}
          <Col xs={12} md={4}>
            <Form.Label className="small fw-semibold text-muted mb-1">
              Search
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                🔍
              </InputGroup.Text>
              <Form.Control
                placeholder="Hotel name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Col>

          {/* City filter */}
          <Col xs={6} md={3}>
            <Form.Label className="small fw-semibold text-muted mb-1">
              City
            </Form.Label>
            <Form.Select value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Min stars filter */}
          <Col xs={6} md={2}>
            <Form.Label className="small fw-semibold text-muted mb-1">
              Min Stars
            </Form.Label>
            <Form.Select
              value={minStars}
              onChange={(e) => setMinStars(Number(e.target.value))}
            >
              <option value={0}>Any</option>
              <option value={3}>3★ +</option>
              <option value={4}>4★ +</option>
              <option value={5}>5★ only</option>
            </Form.Select>
          </Col>

          {/* Sort */}
          <Col xs={6} md={2}>
            <Form.Label className="small fw-semibold text-muted mb-1">
              Sort By
            </Form.Label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Clear filters button */}
          <Col xs={6} md={1} className="d-flex align-items-end">
            {hasActiveFilters && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100"
                onClick={clearFilters}
                title="Clear all filters"
              >
                ✕ Clear
              </Button>
            )}
          </Col>
        </Row>

        {/* ── Results summary ── */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="text-muted small">
            Showing{" "}
            <strong className="text-dark">{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "hotel" : "hotels"}
          </span>
          {hasActiveFilters && (
            <Badge bg="secondary" className="small">
              Filters active
            </Badge>
          )}
        </div>

        {/* ── Hotel Grid ── */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="secondary" />
            <p className="text-muted mt-3">Loading hotels...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem" }}>🏨</div>
            <h5 className="mt-3">No hotels found</h5>
            <p className="small">Try adjusting your search or filters.</p>
            <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {filtered.map((hotel) => (
              <Col key={hotel.id} xs={12} sm={6} lg={4} xl={3}>
                <HotelCard hotel={hotel} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
