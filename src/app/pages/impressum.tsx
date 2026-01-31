import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { PageHeader } from "@/app/components/page-header";

export function Impressum() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Impressum"
        subtitle="Rechtliche Informationen"
      >
        <Link to="/">
          <Button
            variant="outline"
            className="mb-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 size-4" />
            Zurück zur Übersicht
          </Button>
        </Link>
      </PageHeader>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-3xl mb-4">Gesetzliche Anbieterkennung</h2>
              <p className="text-gray-700 leading-relaxed">
                Upstream UG (haftungsbeschränkt)<br />
                Robert-Bosch-Straße 5<br />
                D-71093 Weil im Schönbuch<br />
                vertr. d. d. Geschäftsführer Michael Spanky<br />
                Telefon: 07157-9882473<br />
                E-Mail: info@upstream-tec.de<br />
                USt-IdNr.: DE300389727<br />
                Wi-ID-Nr.: DE 62786246<br />
                eingetragen im Handelsregister des Amtsgerichtes Stuttgart<br />
                Handelsregisternummer HRB 752718
              </p>
            </section>

                        <section>
              <h2 className="text-3xl mb-4">EU-Streitschlichtung</h2>
              <p className="text-gray-700 leading-relaxed">
                Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor Verbraucherschlichtungsstellen teilzunehmen.
Wir sind seit 26.12.2015 Mitglied der Initiative "FairCommerce".
Nähere Informationen hierzu finden Sie unter www.haendlerbund.de/faircommerce (https://www.haendlerbund.de/de/haendlerbund/interessenvertretung/faircommerce).
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