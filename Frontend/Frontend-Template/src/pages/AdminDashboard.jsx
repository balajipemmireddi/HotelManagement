import { Container, Card } from "react-bootstrap";

export default function AdminDashboard() {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-5 shadow text-center text-white" style={{ width: "500px", backgroundColor: '#4e73df' }}>
        <h2>Admin Control Panel</h2>
        <p className="mt-3">
          If you can see this page, your Role-Based Access Control (RBAC) and JWT Bouncer are working perfectly.
        </p>
      </Card>
    </Container>
  );
}