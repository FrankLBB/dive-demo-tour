import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function Partner() {
  const partners = [
    {
      name: "Universität Hamburg - Institut für Meereskunde",
      description: "Führendes Forschungsinstitut für Ozeanographie und marine Wissenschaften in Deutschland.",
      category: "Forschung",
      location: "Hamburg, Deutschland",
      website: "https://www.uni-hamburg.de",
    },
    {
      name: "GEOMAR Helmholtz-Zentrum für Ozeanforschung",
      description: "Eines der weltweit führenden Institute auf dem Gebiet der Meeresforschung mit Fokus auf Tiefsee-Technologie.",
      category: "Forschung",
      location: "Kiel, Deutschland",
      website: "https://www.geomar.de",
    },
    {
      name: "TU Delft - Marine Technology",
      description: "Renommierte technische Universität mit Expertise in maritimer Technologie und Schiffbau.",
      category: "Forschung",
      location: "Delft, Niederlande",
      website: "https://www.tudelft.nl",
    },
    {
      name: "Norwegian University of Science and Technology (NTNU)",
      description: "Führende Forschungseinrichtung für Unterwasser-Robotik und autonome Systeme.",
      category: "Forschung",
      location: "Trondheim, Norwegen",
      website: "https://www.ntnu.no",
    },
    {
      name: "SubSea Tech Solutions GmbH",
      description: "Innovativer Hersteller von Unterwasser-Robotern und ROV-Systemen für kommerzielle Anwendungen.",
      category: "Industrie",
      location: "Bremen, Deutschland",
    },
    {
      name: "Marine Instruments Nordic AB",
      description: "Spezialist für hochpräzise Sensoren und Messtechnik für Unterwasseranwendungen.",
      category: "Industrie",
      location: "Stockholm, Schweden",
    },
    {
      name: "DeepDive Technologies",
      description: "Entwickler von innovativen Tauchcomputern und Sicherheitssystemen für Profitaucher.",
      category: "Industrie",
      location: "Amsterdam, Niederlande",
    },
    {
      name: "OceanEx Finland Oy",
      description: "Anbieter von Ausrüstung und Dienstleistungen für Tiefsee-Exploration und Forschung.",
      category: "Industrie",
      location: "Helsinki, Finnland",
    },
    {
      name: "Baltic Marine Alliance",
      description: "Netzwerk von Meeresforschern und Umweltschützern im Ostseeraum.",
      category: "Organisation",
      location: "Kopenhagen, Dänemark",
    },
    {
      name: "European Diving Technology Association (EDTA)",
      description: "Europäischer Branchenverband für Tauchtechnologie und maritime Ausrüstung.",
      category: "Organisation",
      location: "Brüssel, Belgien",
    },
  ];

  const categories = ["Forschung", "Industrie", "Organisation"];

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
          <h1 className="text-5xl mb-4">Unsere Partner</h1>
          <p className="text-xl text-blue-50">
            Gemeinsam für Innovation in der Unterwassertechnologie
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Die DIVE Demo Tour wird durch die Zusammenarbeit mit führenden europäischen 
              Forschungseinrichtungen, innovativen Unternehmen und engagierten Organisationen 
              ermöglicht. Gemeinsam treiben wir die Entwicklung nachhaltiger und 
              zukunftsweisender Technologien für die Meeresforschung voran.
            </p>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-3xl mb-6 pb-2 border-b-2 border-blue-500">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partners
                  .filter((partner) => partner.category === category)
                  .map((partner, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <h3 className="text-2xl text-blue-600">{partner.name}</h3>
                        <p className="text-gray-600">{partner.location}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{partner.description}</p>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website besuchen →
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}

          <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
            <h3 className="text-2xl mb-3">Partner werden</h3>
            <p className="text-gray-700 mb-4">
              Sie möchten Teil der DIVE Demo Tour werden? Wir freuen uns über neue Partner 
              aus Forschung, Industrie und gemeinnützigen Organisationen.
            </p>
            <p className="text-gray-700">
              Kontaktieren Sie uns unter:{" "}
              <a href="mailto:partner@dive-demo-tour.eu" className="text-blue-600 hover:underline">
                partner@dive-demo-tour.eu
              </a>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-blue-600 hover:underline text-lg">
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}