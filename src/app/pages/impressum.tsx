import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button
              variant="outline"
              className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 size-4" />
              Zurück zur Übersicht
            </Button>
          </Link>
          <h1 className="text-5xl mb-4">Impressum</h1>
          <p className="text-xl text-blue-50">Rechtliche Informationen</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-3xl mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="text-gray-700 leading-relaxed">
                DIVE Demo Tour<br />
                Musterstraße 123<br />
                12345 Hamburg<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Kontakt</h2>
              <p className="text-gray-700 leading-relaxed">
                Telefon: +49 (0) 40 123456-0<br />
                E-Mail: info@dive-demo-tour.eu<br />
                Web: <a href="https://dive-demo-tour.eu" className="text-blue-600 hover:underline">dive-demo-tour.eu</a>
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Vertreten durch</h2>
              <p className="text-gray-700 leading-relaxed">
                Dr. Maria Schmidt (Geschäftsführerin)<br />
                Prof. Dr. Lars Müller (Wissenschaftlicher Leiter)
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Registereintrag</h2>
              <p className="text-gray-700 leading-relaxed">
                Eintragung im Vereinsregister<br />
                Registergericht: Amtsgericht Hamburg<br />
                Registernummer: VR 12345
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">EU-Streitschlichtung</h2>
              <p className="text-gray-700 leading-relaxed">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://ec.europa.eu/consumers/odr/
                </a>
                <br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
              <p className="text-gray-700 leading-relaxed">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Haftung für Inhalte</h2>
              <p className="text-gray-700 leading-relaxed">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                Tätigkeit hinweisen.
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Haftung für Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">Urheberrecht</h2>
              <p className="text-gray-700 leading-relaxed">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}