import { Link } from "react-router";
import { 
  ArrowLeft, 
  Target, 
  Users, 
  Globe, 
  Waves,
  Award,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
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
          <h1 className="text-5xl md:text-6xl mb-6">
            Über die DIVE Demo Tour
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 max-w-3xl">
            Europas führende Roadshow für innovative Tauchtechnologien und maritime Innovationen
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Target className="size-8 text-blue-600" />
            </div>
            <h2 className="text-4xl mb-6">Unsere Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Die DIVE Demo Tour verbindet führende Hersteller von Tauchtechnologien mit 
              professionellen Tauchern, Instruktoren und Enthusiasten in ganz Europa. 
              Wir bringen Innovation direkt zu den Menschen, die sie nutzen.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Waves className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Hands-On Erfahrung</h3>
                    <p className="text-gray-600">
                      Testen Sie die neueste Ausrüstung unter realen Bedingungen 
                      und erleben Sie Innovationen hautnah.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Expert*innen vor Ort</h3>
                    <p className="text-gray-600">
                      Treffen Sie Produktspezialist*innen, Entwickler*innen und 
                      erfahrene Taucher*innen für persönlichen Austausch.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Premium Marken</h3>
                    <p className="text-gray-600">
                      Entdecken Sie Produkte von weltweit führenden Herstellern 
                      der Tauch- und Wassersportbranche.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Globe className="size-6 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">Europaweit</h3>
                    <p className="text-gray-600">
                      Wir besuchen die wichtigsten Tauchzentren und bringen 
                      Innovation in Ihre Stadt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What to Expect Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="size-8 text-green-600" />
              <h2 className="text-3xl">Was Sie erwartet</h2>
            </div>
            <div className="space-y-4">
              {[
                "Live-Demonstrationen der neuesten Tauchtechnologien und Ausrüstung",
                "Persönliche Beratung durch Produktexpert*innen und Techniker*innen",
                "Praktische Test-Möglichkeiten ausgewählter Produkte",
                "Networking mit anderen Taucher*innen und Branchenprofis",
                "Exklusive Angebote und Sonderkonditionen vor Ort",
                "Workshops und Präsentationen zu aktuellen Themen",
                "Verlosungen und Gewinnspiele mit hochwertigen Preisen",
                "Kostenlose Teilnahme und Verpflegung"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
              <MapPin className="size-12 mx-auto mb-4 opacity-80" />
              <div className="text-5xl mb-2">6</div>
              <p className="text-blue-100">Städte in Europa</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
              <Calendar className="size-12 mx-auto mb-4 opacity-80" />
              <div className="text-5xl mb-2">3</div>
              <p className="text-green-100">Monate Tour-Dauer</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white text-center">
              <TrendingUp className="size-12 mx-auto mb-4 opacity-80" />
              <div className="text-5xl mb-2">1000+</div>
              <p className="text-purple-100">Erwartete Besucher</p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="size-8 text-blue-600" />
              <h2 className="text-3xl">Unsere Vision</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Wir glauben an eine Zukunft, in der Tauchtechnologie zugänglicher, 
              nachhaltiger und innovativer wird. Die DIVE Demo Tour ist mehr als eine 
              Produktpräsentation – sie ist eine Plattform für den Austausch von Ideen, 
              die Förderung von Sicherheit und die Begeisterung für die Unterwasserwelt.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Durch den direkten Kontakt zwischen Herstellern und Anwendern möchten wir 
              die Entwicklung besserer Produkte fördern und gleichzeitig die Tauchgemeinschaft 
              stärken. Jede Station unserer Tour ist eine Gelegenheit, zu lernen, zu 
              erleben und Teil einer wachsenden Community zu werden.
            </p>
          </div>

          {/* Tour Cities Preview */}
          <div className="mb-16">
            <h2 className="text-3xl mb-8 text-center">Unsere Tour-Stationen 2026</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { city: "Hamburg", country: "Deutschland", flag: "🇩🇪" },
                { city: "Amsterdam", country: "Niederlande", flag: "🇳🇱" },
                { city: "Kopenhagen", country: "Dänemark", flag: "🇩🇰" },
                { city: "Bergen", country: "Norwegen", flag: "🇳🇴" },
                { city: "Stockholm", country: "Schweden", flag: "🇸🇪" },
                { city: "Helsinki", country: "Finnland", flag: "🇫🇮" }
              ].map((location, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-2">{location.flag}</div>
                  <h3 className="text-lg mb-1">{location.city}</h3>
                  <p className="text-sm text-gray-600">{location.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl mb-4">
              Seien Sie dabei!
            </h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Melden Sie sich jetzt für die DIVE Demo Tour in Ihrer Stadt an 
              und erleben Sie Tauchtechnologie der nächsten Generation.
            </p>
            <Link 
              to="/"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              Zu den Events
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">
              Zurück zur Startseite
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}