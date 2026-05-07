import AppNavbar from "./Navbar";
import Footer from "./Footer";

/**
 * MainLayout wraps every page with the shared Navbar and Footer.
 * Usage: wrap page content with <MainLayout> in App.jsx routes.
 */
export default function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
