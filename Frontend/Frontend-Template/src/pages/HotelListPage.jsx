import { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Badge,
  Spinner,
  Offcanvas,
} from "react-bootstrap";
import HotelCard from "../components/HotelCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import { useHotelFilters } from "../hooks/useHotelFilters";
import { MOCK_HOTELS } from "../data/mockHotels";

// Sort options
const SORT_OPTIONS = [
  { value: "default",    label: "Default"           },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "stars_desc", label: "Stars: High → Low" },
  { value: "stars_asc",  label: "Stars: Low → High" },
];

// Parse a "min-max" price range string into { min, max }
function parsePriceRange(str) {
  if (!str || str === "0-Infinity") return { min: 0, max: Infinity };
  const [min, max] = str.split("-");
  return { min: Number(min), max: max === "Infinity" ? Infinity : Number(max) };
}

export default function HotelListPage() {
  const { filters, setFilter, applySearch, clearAll, activeCount } = useHotelFilters();

  // Mobile: offcanvas sidebar visibility
  const [showSidebar, setShowSidebar] = useState(false);

  // SearchBar local state (committed to URL on Search click)
  const [searchDraft, setSearchDraft] = useState({
    location: filters.location,
    checkIn:  filters.checkIn,
    checkOut: filters.checkOut,
    guests:   filters.guests || "1",
  });

  const handleSearchChange = (field, value) => {
    setSearchDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    applySearch({
      location: searchDraft.location,
      checkIn:  searchDraft.checkIn,
      checkOut: searchDraft.checkOut,
      guests:   searchDraft.guests,
    });
  };

  // Simulate loading (will be real API state in Phase 10)
  const [loading] = useState(false);

  // ── Derived filtered + sorted list ───────────────────
  const filtered = useMemo(() => {
    let list = [...MOCK_HOTELS];
    const { min: priceMin, max: priceMax } = parsePriceRange(filters.priceRange);

    // Location text search — matches name or city
    if (filters.location.trim()) {
      const q = filters.location.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q)
      );
    }

    // Price range
    if (priceMin > 0 || priceMax < Infinity) {
      list = list.filter(
        (h) => h.priceFrom >= priceMin && h.priceFrom <= priceMax
      );
    }

    // Star rating (multi-select — show if hotel matches ANY selected star)
    if (filters.stars.size > 0) {
      list = list.filter((h) => filters.stars.has(h.starRating));
    }

    // Amenities — mock: hotels with higher star ratings have more amenities.
    // In Phase 10 this will filter against real amenity data from the API.
    if (filters.amenities.size > 0) {
      const amenityStarMap = { wifi: 1, parking: 2, pool: 3, gym: 3, restaurant: 3, bar: 4, spa: 4, breakfast: 3 };
      list = list.filter((h) =>
        [...filters.amenities].every(
          (a) => h.starRating >= (amenityStarMap[a] ?? 1)
        )
      );
    }

    // Sort
    switch (filters.sort) {
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
  }, [filters]);

  const hasActiveSearch =
    filters.location || filters.checkIn || filters.checkOut;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Page Header + SearchBar ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
          padding: "40px 0 32px",
        }}
      >
        <Container>
          <h1 className="text-white fw-bold mb-1">Browse Hotels</h1>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            {MOCK_HOTELS.length} hotels available worldwide
          </p>

          {/* SearchBar sits inside the hero */}
          <div
            className="bg-white rounded p-3 shadow"
            style={{ borderRadius: "12px" }}
          >
            <SearchBar
              values={searchDraft}
              onChange={handleSearchChange}
              onSearch={handleSearch}
            />
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="g-4">

          {/* ── Sidebar — desktop (always visible ≥ lg) ── */}
          <Col lg={3} className="d-none d-lg-block">
            <FilterSidebar
              filters={filters}
              onChange={setFilter}
              onClear={clearAll}
              count={activeCount}
            />
          </Col>

          {/* ── Main content ── */}
          <Col xs={12} lg={9}>

            {/* Toolbar: results count + sort + mobile filter button */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">
                  Showing{" "}
                  <strong className="text-dark">{filtered.length}</strong>{" "}
                  {filtered.length === 1 ? "hotel" : "hotels"}
                </span>
                {(activeCount > 0 || hasActiveSearch) && (
                  <Badge bg="secondary" className="small">
                    Filters active
                  </Badge>
                )}
              </div>

              <div className="d-flex gap-2 align-items-center">
                {/* Sort dropdown */}
                <Form.Select
                  size="sm"
                  style={{ width: "auto" }}
                  value={filters.sort}
                  onChange={(e) => setFilter("sort", e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Form.Select>

                {/* Mobile: open filter sidebar */}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="d-lg-none"
                  onClick={() => setShowSidebar(true)}
                >
                  ⚙ Filters{activeCount > 0 && ` (${activeCount})`}
                </Button>
              </div>
            </div>

            {/* Hotel grid */}
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
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={clearAll}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <Row className="g-4">
                {filtered.map((hotel) => (
                  <Col key={hotel.id} xs={12} sm={6} xl={4}>
                    <HotelCard hotel={hotel} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      {/* ── Mobile Offcanvas Sidebar ── */}
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        style={{ width: "300px" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="p-3">
            <FilterSidebar
              filters={filters}
              onChange={setFilter}
              onClear={clearAll}
              count={activeCount}
            />
          </div>
          <div className="p-3 border-top">
            <Button
              className="w-100"
              style={{ backgroundColor: "#e94560", border: "none" }}
              onClick={() => setShowSidebar(false)}
            >
              Show {filtered.length} Results
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
