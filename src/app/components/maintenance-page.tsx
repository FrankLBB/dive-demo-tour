import { Wrench, Mail, Globe, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface MaintenancePageProps {
  isAdmin?: boolean;
  onAdminAccess?: () => void;
}

export function MaintenancePage({ isAdmin, onAdminAccess }: MaintenancePageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-12 text-center relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Icon */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-pulse">
                <Wrench className="size-12 text-white animate-bounce" style={{ animationDuration: "2s" }} />
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-3">
                Wartungsarbeiten
              </h1>
              
              <p className="text-xl text-blue-100 font-medium">
                DIVE DEMO TOUR
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Wir sind gleich wieder für Sie da!
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Unsere Website befindet sich aktuell im Wartungsmodus. Wir arbeiten daran, 
                Ihnen ein noch besseres Erlebnis zu bieten.
              </p>

              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 text-blue-700 font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Die Website wird gerade aktualisiert</span>
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Expected Duration */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="size-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Voraussichtliche Dauer</h3>
                    <p className="text-sm text-gray-600">Wenige Stunden</p>
                  </div>
                </div>
              </div>

              {/* What's Happening */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="size-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Was passiert?</h3>
                    <p className="text-sm text-gray-600">System-Updates & Optimierungen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Haben Sie dringende Fragen?
              </h3>
              
              <div className="space-y-3">
                <a 
                  href="mailto:info@dive-demo-tour.eu"
                  className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300 group"
                >
                  <Mail className="size-5 text-blue-600" />
                  <span className="text-gray-700 font-medium group-hover:text-blue-700">info@dive-demo-tour.eu</span>
                </a>
              </div>
            </div>

            {/* Admin Access */}
            {isAdmin && onAdminAccess && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="size-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Administrator-Zugriff</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Sie sind als Administrator angemeldet und können trotz Wartungsmodus auf die Website zugreifen.
                      </p>
                      <Button 
                        onClick={onAdminAccess}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      >
                        Zur Website (Admin-Modus)
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Login Link (if not logged in) */}
            {!isAdmin && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <LogIn className="size-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Administrator?</h4>
                      <Button 
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-100"
                        onClick={() => window.location.href = '/admin'}
                      >
                        Zum Admin-Login
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-12 py-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Vielen Dank für Ihr Verständnis! 🙏
            </p>
          </div>
        </div>

        {/* Logo/Branding */}
        <div className="text-center mt-8">
          <p className="text-gray-600 font-medium">
            DIVE DEMO TOUR 2026
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Test-Events für Tauch- und Wassersport
          </p>
        </div>
      </div>
    </div>
  );
}