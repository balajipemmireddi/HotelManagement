import { useEffect, useState, useCallback } from "react";
import {
  Container, Row, Col, Form, Button,
  Badge, Spinner, Alert, Offcanvas, Pagination,
} from "react-bootstrap";
import HotelCard    from "../components/HotelCard";
import SearchBar    from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import { useHotelFilters } from "../hooks/useHotelFilters";
import { searchHotels }    from "../services/HotelService";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "default",    label: "Default"           },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "stars_desc", label: "Stars: High → Low" },
  { value: "stars_asc",  label: "Stars: Low → High" },
];

export default function HotelListPage() {
  const { filters, setFilter, applySearch, clearAll, activeCount } = useHotelFilters();

  // ── API state ─────────────────────────────────────────
  const [hotels,      setHotels]      = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [currentPage, setCurrentPage] = useState(0);   // 0-indexed
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalItems,  setTotalItems]  = useState(0);

  // ── SearchBar draft (committed on Search click) ───────
  const [searchDraft, setSearchDraft] = useState({
    location: filters.location,
    checkIn:  filters.checkIn,
    checkOut: filters.checkOut,
    guests:   filters.guests || "1",
  });

  // ── Mobile sidebar ────────────────────────────────────
  const [showSidebar, setShowSidebar] = useState(false);

  // ── Fetch from API / mock fallback ────────────────────
  const fetchHotels = useCallback(async (page) => {
    setLoading(true);
    setError("");
    try {
      const result = await searchHotels(filters, page, PAGE_SIZE);
      setHotels(result.content);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalElements);
      setCurrentPage(result.number);
    } catch (err) {
      setError(err.message || "Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  }, [filters]); // re-run whenever filters change

  // Re-fetch when filters change; reset to page 0
  useEffect(() => {
    setCurrentPage(0);
    fetchHotels(0);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchHotels(page);
  };

  const handleSearch = () => {
    applySearch({
      location: searchDraft.location,
      checkIn:  searchDraft.checkIn,
      checkOut: searchDraft.checkOut,
      guests:   searchDraft.guests,
    });
  };

  const hasActiveSearch = filters.location || filters.checkIn || filters.checkOut;

  // ── Pagination items ──────────────────────────────────
  const buildPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end   = Math.min(totalPages - 1, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(0, end - maxVisible + 1);

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 0}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );
    if (start > 0) {
      items.push(<Pagination.Item key={0} onClick={() => handlePageChange(0)}>1</Pagination.Item>);
      if (start > 1) items.push(<Pagination.Ellipsis key="e1" disabled />);
    }
    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => i !== currentPage && handlePageChange(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }
    if (end < totalPages - 1) {
      if (end < totalPages - 2) items.push(<Pagination.Ellipsis key="e2" disabled />);
      items.push(
        <Pagination.Item key={totalPages - 1} onClick={() => handlePageChange(totalPages - 1)}>
          {totalPages}
        </Pagination.Item>
      );
    }
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage >= totalPages - 1}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );
    return items;
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* ── Hero + SearchBar ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)", padding: "40px 0 32px" }}>
        <Container>
          <h1 className="text-white fw-bold mb-1">Browse Hotels</h1>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
            {loading ? "Searching..." : `${totalItems} hotel${totalItems !== 1 ? "s" : ""} found`}
          </p>
          <div className="bg-white rounded p-3 shadow" style={{ borderRadius: "12px" }}>
            <SearchBar
              values={searchDraft}
              onChange={(field, value) => setSearchDraft((prev) => ({ ...prev, [field]: value }))}
              onSearch={handleSearch}
            />
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="g-4">

          {/* ── Desktop sidebar ── */}
          <Col lg={3} className="d-none d-lg-block">
            <FilterSidebar filters={filters} onChange={setFilter} onClear={clearAll} count={activeCount} />
          </Col>

          {/* ── Main content ── */}
          <Col xs={12} lg={9}>

            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">
                  {loading
                    ? "Loading..."
                    : <>Showing <strong className="text-dark">{hotels.length}</strong> of <strong className="text-dark">{totalItems}</strong> hotels</>
                  }
                </span>
                {(activeCount > 0 || hasActiveSearch) && (
                  <Badge bg="secondary" className="small">Filters active</Badge>
                )}
              </div>
              <div className="d-flex gap-2 align-items-center">
                <Form.Select
                  size="sm"
                  style={{ width: "auto" }}
                  value={filters.sort}
                  onChange={(e) => setFilter("sort", e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Form.Select>
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

            {/* Error */}
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-3">
                {error}
              </Alert>
            )}

            {/* Loading */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="secondary" />
                <p className="text-muted mt-3 small">Searching hotels...</p>
              </div>

            /* Empty */
            ) : hotels.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div style={{ fontSize: "3rem" }}>🏨</div>
                <h5 className="mt-3">No hotels found</h5>
                <p className="small">Try adjusting your search or filters.</p>
                <Button variant="outline-secondary" size="sm" onClick={clearAll}>
                  Clear All Filters
                </Button>
              </div>

            /* Grid */
            ) : (
              <>
                <Row className="g-4 mb-4">
                  {hotels.map((hotel) => (
                    <Col key={hotel.id} xs={12} sm={6} xl={4}>
                      <HotelCard hotel={hotel} />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex flex-column align-items-center gap-1">
                    <Pagination className="mb-1">{buildPaginationItems()}</Pagination>
                    <p className="text-muted small mb-0">
                      Page {currentPage + 1} of {totalPages}
                    </p>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* ── Mobile Offcanvas ── */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start" style={{ width: "300px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="p-3">
            <FilterSidebar filters={filters} onChange={setFilter} onClear={clearAll} count={activeCount} />
          </div>
          <div className="p-3 border-top">
            <Button
              className="w-100"
              style={{ backgroundColor: "#e94560", border: "none" }}
              onClick={() => setShowSidebar(false)}
            >
              Show {totalItems} Results
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
