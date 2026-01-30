import { Mail, Globe } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl mb-4">Wer steckt hinter "DIVE DEMO TOUR"?</h3>
            <p className="text-gray-400">
              Dies ist ein Projekt der  <Link to="/impressum" className="hover:text-white transition-colors">
                Upstream UG
              </Link>, um im Rahmen von Events gemeinsam mit <Link to="/partner" className="hover:text-white transition-colors">
                Partnern
              </Link> Tauchausrüstung oder Dienstleistungen zu präsentieren, bzw. zum Testen anzubieten.
            </p>
             <p className="text-gray-400">
              Die Events werden entweder von der Upstream UG, einem Partner oder als Kooperation organisiert.
            </p>
            <p className="text-gray-400">
              Jeder <Link to="/partner" className="hover:text-white transition-colors">
                Partner
              </Link> präsentiert sich und seine Produkte/Diensleistungen unabhängig und eigenverantwortlich.
            </p>
          </div>
          <div>
            <h3 className="text-xl mb-4">Kontakt</h3>
            <div className="flex flex-col gap-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <a href="mailto:info@dive-demo-tour.eu" className="hover:text-white transition-colors">
                  info@dive-demo-tour.eu
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-4" />
                <a href="https://dive-demo-tour.eu" className="hover:text-white transition-colors">
                  dive-demo-tour.eu
                </a>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl mb-4">Links</h3>
            <div className="flex flex-col gap-2 text-gray-400">
              <Link to="/about" className="hover:text-white transition-colors">
                Über uns
              </Link>
              <Link to="/partner" className="hover:text-white transition-colors">
                Partner
              </Link>
              <Link to="/impressum" className="hover:text-white transition-colors">
                Impressum
              </Link>
              <Link to="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 DIVE Demo Tour. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}