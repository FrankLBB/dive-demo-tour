import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { PageHeader } from "@/app/components/page-header";

export function Datenschutz() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Datenschutzerklärung"
        subtitle="Informationen zum Datenschutz"
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
              <h2 className="text-3xl mb-4">1. Datenschutz auf einen Blick</h2>
              
              <h3 className="text-2xl mb-3 mt-6">Allgemeine Hinweise</h3>
              <p className="text-gray-700 leading-relaxed">
                Soweit nachstehend keine anderen Angaben gemacht werden, ist die Bereitstellung Ihrer personenbezogenen Daten weder gesetzlich oder vertraglich vorgeschrieben, noch für einen Vertragsabschluss erforderlich. Sie sind zur Bereitstellung der Daten nicht verpflichtet. Eine Nichtbereitstellung hat keine Folgen. Dies gilt nur soweit bei den nachfolgenden Verarbeitungsvorgängen keine anderweitige Angabe gemacht wird.
"Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen.

              </p>

              <h3 className="text-2xl mb-3 mt-6">Server-Logfiles</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sie können unsere Webseiten besuchen, ohne Angaben zu Ihrer Person zu machen.  
Bei jedem Zugriff auf unsere Website werden an uns oder unseren Webhoster / IT-Dienstleister Nutzungsdaten durch Ihren Internet Browser übermittelt und in Protokolldaten (sog. Server-Logfiles) gespeichert. Zu diesen gespeicherten Daten gehören z.B. der Name der aufgerufenen Seite, Datum und Uhrzeit des Abrufs, die IP-Adresse, die übertragene Datenmenge und der anfragende Provider.
Die Verarbeitung erfolgt auf Grundlage des Art. 6 Abs. 1 lit. f DSGVO aus unserem überwiegenden berechtigten Interesse an der Gewährleistung eines störungsfreien Betriebs unserer Website sowie zur Verbesserung unseres Angebotes. 
Kontakt
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Verantwortlicher</strong><br />
                Kontaktieren Sie uns auf Wunsch. Verantwortlicher für die Datenverarbeitung ist: Michael Spanky, Robert-Bosch-Str. 5, 71093 Weil im Schönbuch Deutschland, +49 (0) 7157-98824-72, info@upstream-tec.de
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Initiativ-Kontaktaufnahme von Interessenten per E-Mail</strong><br />
                Wenn Sie per E-Mail initiativ mit uns in Geschäftskontakt treten, erheben wir Ihre personenbezogenen Daten (Name, E-Mail-Adresse, Nachrichtentext) nur in dem von Ihnen zur Verfügung gestellten Umfang. Die Datenverarbeitung dient der Bearbeitung und Beantwortung Ihrer Kontaktanfrage.
Wenn die Kontaktaufnahme der Durchführung vorvertraglichen Maßnahmen (bspw. Beratung bei Kaufinteresse, Angebotserstellung) dient oder einen bereits zwischen Ihnen und uns geschlossenen Vertrag betrifft, erfolgt diese Datenverarbeitung auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO.
Erfolgt die Kontaktaufnahme aus anderen Gründen, erfolgt diese Datenverarbeitung auf Grundlage des Art. 6 Abs. 1 lit. f DSGVO aus unserem überwiegenden berechtigten Interesse an der Bearbeitung und Beantwortung Ihrer Anfrage. In diesem Fall haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit dieser auf Art. 6 Abs. 1 lit. f DSGVO beruhenden Verarbeitungen Sie betreffender personenbezogener Daten zu widersprechen.
Ihre E-Mail-Adresse nutzen wir nur zur Bearbeitung Ihrer Anfrage. Ihre Daten werden anschließend unter Beachtung gesetzlicher Aufbewahrungsfristen gelöscht, sofern Sie der weitergehenden Verarbeitung und Nutzung nicht zugestimmt haben.
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>Erhebung und Verarbeitung bei Nutzung des Kontaktformulars</strong><br />
                Bei der Nutzung des Kontaktformulars erheben wir Ihre personenbezogenen Daten (Name, E-Mail-Adresse, Nachrichtentext) nur in dem von Ihnen zur Verfügung gestellten Umfang. Die Datenverarbeitung dient dem Zweck der Kontaktaufnahme.
Wenn die Kontaktaufnahme der Durchführung vorvertraglichen Maßnahmen (bspw. Beratung bei Kaufinteresse, Angebotserstellung) dient oder einen bereits zwischen Ihnen und uns geschlossenen Vertrag betrifft, erfolgt diese Datenverarbeitung auf Grundlage des Art. 6 Abs. 1 lit. b DSGVO. Erfolgt die Kontaktaufnahme aus anderen Gründen, erfolgt diese Datenverarbeitung auf Grundlage des Art. 6 Abs. 1 lit. f DSGVO aus unserem überwiegenden berechtigten Interesse an der Bearbeitung und Beantwortung Ihrer Anfrage. In diesem Fall haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit dieser auf Art. 6 Abs. 1 lit. f DSGVO beruhenden Verarbeitungen Sie betreffender personenbezogener Daten zu widersprechen. Ihre E-Mail-Adresse nutzen wir nur zur Bearbeitung Ihrer Anfrage. Ihre Daten werden anschließend unter Beachtung gesetzlicher Aufbewahrungsfristen gelöscht, sofern Sie der weitergehenden Verarbeitung und Nutzung nicht zugestimmt haben.
              </p>
            </section>
            
            <section>
              <p className="text-gray-700 leading-relaxed">
                <strong>Betroffenenrechte und Speicherdauer</strong><br />
              Dauer der Speicherung
Nach vollständiger Vertragsabwicklung werden die Daten zunächst für die Dauer der Gewährleistungsfrist, danach unter Berücksichtigung gesetzlicher, insbesondere steuer- und handelsrechtlicher Aufbewahrungsfristen gespeichert und dann nach Fristablauf gelöscht, sofern Sie der weitergehenden Verarbeitung und Nutzung nicht zugestimmt haben.

Rechte der betroffenen Person
Ihnen stehen bei Vorliegen der gesetzlichen Voraussetzungen folgende Rechte nach Art. 15 bis 20 DSGVO zu: Recht auf Auskunft, auf Berichtigung, auf Löschung, auf Einschränkung der Verarbeitung, auf Datenübertragbarkeit.
Außerdem steht Ihnen nach Art. 21 Abs. 1 DSGVO ein Widerspruchsrecht gegen die Verarbeitungen zu, die auf Art. 6 Abs. 1 f DSGVO beruhen, sowie gegen die Verarbeitung zum Zwecke von Direktwerbung.

Beschwerderecht bei der Aufsichtsbehörde
Sie haben gemäß Art. 77 DSGVO das Recht, sich bei der Aufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten nicht rechtmäßig erfolgt.

Widerspruchsrecht
Beruhen die hier aufgeführten personenbezogenen Datenverarbeitungen auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO, haben Sie das Recht aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit diesen Verarbeitungen mit Wirkung für die Zukunft zu widersprechen.
Nach erfolgtem Widerspruch wird die Verarbeitung der betroffenen Daten beendet, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihren Interessen, Rechten und Freiheiten überwiegen, oder wenn die Verarbeitung der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen dient.
              </p>
            </section>

            <section>
              <h2 className="text-3xl mb-4">2. Hosting</h2>
              <p className="text-gray-700 leading-relaxed">
                Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
              </p>

              <h3 className="text-2xl mb-3 mt-6">Supabase</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Diese Website wird bei Supabase gehostet. Der Anbieter ist Supabase Inc., 970 Toa Payoh North, 
                #07-04, Singapore 318992.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Wenn Sie unsere Website besuchen, erfasst Supabase verschiedene Logfiles inklusive Ihrer IP-Adressen. 
                Details entnehmen Sie der Datenschutzerklärung von Supabase: 
                <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://supabase.com/privacy
                </a>
              </p>
              <p className="text-gray-700 leading-relaxed">
                Die Verwendung von Supabase erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein 
                berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
              </p>
            </section>

      
            <section>
              <h2 className="text-3xl mb-4">3. Plugins und Tools</h2>

              <h3 className="text-2xl mb-3 mt-6">Google Fonts (lokales Hosting)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts, die von 
                Google bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern 
                von Google findet dabei nicht statt.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Weitere Informationen zu Google Fonts finden Sie unter 
                <a href="https://developers.google.com/fonts/faq" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://developers.google.com/fonts/faq
                </a> und in der Datenschutzerklärung von Google: 
                <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                  https://policies.google.com/privacy
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}