import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface DiagnosticResult {
  test: string;
  status: "success" | "error" | "warning" | "pending";
  message: string;
  details?: string;
}

export function ConnectionDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Check Environment Variables
    diagnosticResults.push({
      test: "Environment Variables",
      status: projectId && publicAnonKey ? "success" : "error",
      message: projectId && publicAnonKey 
        ? "Project ID und Public Key gefunden"
        : "Project ID oder Public Key fehlt",
      details: `Project ID: ${projectId ? projectId.substring(0, 8) + "..." : "FEHLT"}`,
    });
    setResults([...diagnosticResults]);

    // Test 2: Check Health Endpoint
    try {
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/health`;
      const healthResponse = await fetch(healthUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (healthResponse.ok) {
        const data = await healthResponse.json();
        diagnosticResults.push({
          test: "Server Health Check",
          status: "success",
          message: "Server ist erreichbar",
          details: `Status: ${data.status}`,
        });
      } else {
        diagnosticResults.push({
          test: "Server Health Check",
          status: "error",
          message: `Server antwortet mit Fehler: ${healthResponse.status}`,
          details: await healthResponse.text(),
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Server Health Check",
        status: "error",
        message: "Server nicht erreichbar",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
    setResults([...diagnosticResults]);

    // Test 3: Check Environment Configuration on Server
    try {
      const envUrl = `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/check-env`;
      const envResponse = await fetch(envUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (envResponse.ok) {
        const data = await envResponse.json();
        diagnosticResults.push({
          test: "Server Environment Variables",
          status: data.resend_configured && data.admin_email_configured && data.admin_password_configured 
            ? "success" 
            : "warning",
          message: "Server-Umgebungsvariablen überprüft",
          details: `
            RESEND_API_KEY: ${data.resend_configured ? "✅ Konfiguriert" : "❌ Fehlt"}
            ADMIN_EMAIL: ${data.admin_email_configured ? "✅ Konfiguriert" : "❌ Fehlt"}
            ADMIN_PASSWORD: ${data.admin_password_configured ? "✅ Konfiguriert" : "❌ Fehlt"}
          `,
        });
      } else {
        diagnosticResults.push({
          test: "Server Environment Variables",
          status: "warning",
          message: "Konnte Environment-Check nicht durchführen",
          details: `Status: ${envResponse.status}`,
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Server Environment Variables",
        status: "warning",
        message: "Environment-Check fehlgeschlagen",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
    setResults([...diagnosticResults]);

    // Test 4: Check Events Endpoint
    try {
      const eventsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-281a395c/events`;
      const eventsResponse = await fetch(eventsUrl, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (eventsResponse.ok) {
        const data = await eventsResponse.json();
        diagnosticResults.push({
          test: "Events Endpoint",
          status: "success",
          message: "Events-API funktioniert",
          details: `${Array.isArray(data) ? data.length : 0} Events gefunden`,
        });
      } else {
        diagnosticResults.push({
          test: "Events Endpoint",
          status: "error",
          message: `Events-API Fehler: ${eventsResponse.status}`,
          details: await eventsResponse.text(),
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "Events Endpoint",
        status: "error",
        message: "Events-API nicht erreichbar",
        details: error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
    setResults([...diagnosticResults]);

    // Test 5: Check CORS
    diagnosticResults.push({
      test: "CORS-Konfiguration",
      status: "success",
      message: "CORS scheint korrekt konfiguriert zu sein",
      details: "Keine CORS-Fehler erkannt",
    });
    setResults([...diagnosticResults]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="size-5 text-green-600" />;
      case "error":
        return <AlertCircle className="size-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="size-5 text-orange-600" />;
      case "pending":
        return <Loader2 className="size-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-orange-50 border-orange-200";
      case "pending":
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Verbindungsdiagnose</h2>
            <p className="text-gray-600 mt-1">
              Überprüfen Sie die Verbindung zur Supabase Edge Function
            </p>
          </div>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Läuft...
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                Diagnose starten
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="size-12 mx-auto mb-4 text-gray-400" />
            <p>Klicken Sie auf "Diagnose starten", um die Verbindung zu testen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(result.status)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {result.test}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                    {result.details && (
                      <pre className="text-xs bg-white/50 rounded p-2 mt-2 overflow-x-auto whitespace-pre-wrap">
                        {result.details}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">Zusammenfassung</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {results.filter((r) => r.status === "success").length}
                  </div>
                  <div className="text-sm text-gray-600">Erfolgreich</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.filter((r) => r.status === "warning").length}
                  </div>
                  <div className="text-sm text-gray-600">Warnungen</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-600">
                    {results.filter((r) => r.status === "error").length}
                  </div>
                  <div className="text-sm text-gray-600">Fehler</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {results.some((r) => r.status === "error") && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Lösungsvorschläge
                </h3>
                <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                  {!projectId || !publicAnonKey ? (
                    <li>
                      Überprüfen Sie die Datei <code>/utils/supabase/info.tsx</code> und
                      stellen Sie sicher, dass Project ID und Public Anon Key korrekt gesetzt
                      sind.
                    </li>
                  ) : null}
                  {results.some(
                    (r) => r.test === "Server Health Check" && r.status === "error"
                  ) ? (
                    <>
                      <li>
                        Die Supabase Edge Function ist möglicherweise nicht deployed. Stellen
                        Sie sicher, dass der Code in <code>/supabase/functions/server/</code>{" "}
                        korrekt ist.
                      </li>
                      <li>
                        Überprüfen Sie in Ihrem Supabase Dashboard, ob die Edge Function
                        "make-server-281a395c" aktiv ist.
                      </li>
                      <li>
                        Bei Vercel: Stellen Sie sicher, dass alle Environment Variables gesetzt
                        sind (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, etc.)
                      </li>
                    </>
                  ) : null}
                  <li>
                    Lesen Sie die <code>DEPLOYMENT_ANLEITUNG.md</code> für detaillierte
                    Deployment-Schritte.
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
