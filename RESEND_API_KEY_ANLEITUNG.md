# 📧 Resend API Key - Komplette Anleitung

## Was ist Resend?

**Resend** ist ein moderner E-Mail-Dienst für Entwickler, der in Ihrer Website verwendet wird, um:

✅ **Bestätigungs-E-Mails** an Teilnehmer zu senden (nach Anmeldung)  
✅ **Admin-Benachrichtigungen** zu senden (bei neuen Anmeldungen)  

**Kosten:** Kostenlos für 100 E-Mails/Tag (3.000/Monat)

---

## 🚀 Schritt-für-Schritt: API Key erstellen

### Schritt 1: Resend Account erstellen

1. **Gehen Sie zu:** [https://resend.com](https://resend.com)
2. **Klicken Sie auf:** "Start Building" oder "Sign Up"
3. **Registrieren Sie sich:**
   - Mit GitHub (empfohlen, 1 Klick)
   - Oder mit E-Mail + Passwort
4. **Bestätigen Sie Ihre E-Mail** (Check Inbox)
5. ✅ **Sie sind angemeldet!**

---

### Schritt 2: API Key erstellen

**Im Resend Dashboard:**

1. **Sie landen automatisch** im Dashboard
2. **Links im Menü:** Klicken Sie auf **"API Keys"**
3. **Klicken Sie auf:** "Create API Key" (blauer Button)
4. **Dialog öffnet sich:**
   - **Name:** `dive-demo-tour-production`
   - **Permission:** `Full access` (oder `Sending access`)
   - **Domain:** Lassen Sie leer (oder wählen Sie später)
5. **Klicken Sie auf:** "Create"

**⚠️ WICHTIG:**
- Ein Popup erscheint mit Ihrem API Key
- **Format:** `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Kopieren Sie ihn SOFORT!** Er wird nur einmal angezeigt!
- **Speichern Sie ihn sicher** (z.B. in Notizen-App)

**Beispiel API Key:**
```
re_123abc456def789ghi012jkl345mno678pqr
```

---

### Schritt 3: Domain verifizieren (Optional, aber empfohlen)

**Warum?** Damit E-Mails von Ihrer eigenen Domain kommen (z.B. `noreply@dive-demo-tour.eu`)

#### A) Domain hinzufügen

1. **Im Resend Dashboard:** Klicken Sie links auf **"Domains"**
2. **Klicken Sie auf:** "Add Domain" (blauer Button)
3. **Geben Sie ein:** `dive-demo-tour.eu`
4. **Klicken Sie auf:** "Add"

#### B) DNS-Einträge konfigurieren

Resend zeigt Ihnen jetzt DNS-Einträge zum Kopieren:

**Beispiel (Ihre werden anders sein):**

| Type | Name | Value |
|------|------|-------|
| TXT | @ | `resend-domain-verify=xxxxx` |
| MX | @ | `mx1.resend.com` (Priority: 10) |
| MX | @ | `mx2.resend.com` (Priority: 20) |
| TXT | resend._domainkey | `p=MIGfMA0GCS...` (DKIM) |

#### C) DNS bei Ihrem Domain-Anbieter eintragen

**Gehen Sie zu Ihrem Domain-Anbieter** (wo Sie dive-demo-tour.eu gekauft haben):

1. **DNS Management** öffnen
2. **Fügen Sie die Einträge hinzu** (von Resend kopiert)
3. **Speichern**
4. **⏳ Warten:** 10-60 Minuten

#### D) Verifizierung prüfen

1. **Zurück zu Resend:** Domains-Seite
2. **Status sollte ändern zu:** ✅ "Verified"
3. Falls nicht: "Verify" Button klicken

**✅ Domain verifiziert!** E-Mails kommen jetzt von `noreply@dive-demo-tour.eu`

---

### Schritt 4: Absender-E-Mail konfigurieren

**Im Code ändern** (Optional):

Falls Sie eine verifizierte Domain haben, können Sie die Absender-Adresse anpassen:

Ich kann für Sie die Datei `/supabase/functions/server/email.tsx` aktualisieren:

**Aktuell:**
```typescript
from: "DIVE Demo Tour <onboarding@resend.dev>"
```

**Neu (mit Ihrer Domain):**
```typescript
from: "DIVE Demo Tour <noreply@dive-demo-tour.eu>"
```

---

## 🔑 API Key in Vercel eintragen

### Schritt 1: Vercel Dashboard öffnen

1. **Gehen Sie zu:** [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **Wählen Sie Ihr Projekt:** `dive-demo-tour`

### Schritt 2: Environment Variables

1. **Klicken Sie auf:** "Settings" (oben)
2. **Links im Menü:** "Environment Variables"
3. **Klicken Sie auf:** "Add New"

**Füllen Sie aus:**
- **Key:** `RESEND_API_KEY`
- **Value:** `re_123abc456def789...` (Ihr kopierter API Key)
- **Environment:** ✅ Alle ankreuzen (Production, Preview, Development)

4. **Klicken Sie auf:** "Save"

### Schritt 3: Redeploy

**Wichtig:** Environment Variables werden erst nach Redeploy aktiv!

1. **Gehen Sie zu:** "Deployments"
2. **Neueste Deployment:** Klicken Sie auf die 3 Punkte (•••)
3. **Wählen Sie:** "Redeploy"
4. **Bestätigen Sie:** "Redeploy"
5. ⏳ **Warten:** 1-2 Minuten
6. ✅ **Fertig!** E-Mail-Versand ist aktiv

---

## 🔧 API Key in Supabase eintragen

**Wichtig:** Der Backend-Code läuft auf Supabase, daher muss der Key AUCH dort gesetzt werden!

### Schritt 1: Supabase Dashboard öffnen

1. **Gehen Sie zu:** [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Wählen Sie Ihr Projekt**

### Schritt 2: Edge Function Secrets

1. **Links im Menü:** Klicken Sie auf **"Edge Functions"**
2. **Oben:** Klicken Sie auf **"Manage secrets"** (Schlüssel-Icon)
   - Oder: Settings → Edge Functions → Secrets
3. **Klicken Sie auf:** "Add new secret"

**Füllen Sie aus:**
- **Name:** `RESEND_API_KEY`
- **Value:** `re_123abc456def789...` (Ihr API Key)

4. **Klicken Sie auf:** "Save" oder "Add secret"

### Schritt 3: Edge Function neu deployen

**Falls Sie Zugriff auf Supabase CLI haben:**
```bash
supabase functions deploy server
```

**Oder im Dashboard:**
- Die Secrets werden automatisch bei nächstem Deployment verwendet

---

## 📧 E-Mail-Template anpassen (Optional)

Ihre Website sendet aktuell zwei E-Mail-Typen:

### 1. Bestätigungs-E-Mail (an Teilnehmer)

**Datei:** `/supabase/functions/server/email.tsx`

**Aktueller Inhalt:**
```
Hallo [Vorname] [Nachname],

vielen Dank für Ihre Anmeldung zum Event "[Event-Name]".

Details:
- Event: [Event-Name]
- Datum: [Datum]
- Ort: [Stadt], [Land]

Wir freuen uns auf Sie!

Mit freundlichen Grüßen,
Das DIVE Demo Tour Team
```

### 2. Admin-Benachrichtigung (an Sie)

**An:** Die E-Mail aus `ADMIN_EMAIL` Environment Variable

**Inhalt:**
```
Neue Anmeldung erhalten!

Teilnehmer:
- Name: [Vorname] [Nachname]
- E-Mail: [E-Mail]
- Telefon: [Telefon]
- Organisation: [Organisation]

Event:
- [Event-Name]
- [Datum]
- [Stadt], [Land]

Nachricht: [Optional]
```

**Möchten Sie die Templates anpassen?** Sagen Sie mir Bescheid!

---

## ✅ Testen: Funktioniert der E-Mail-Versand?

### Test 1: Event-Anmeldung

1. **Öffnen Sie Ihre Website**
2. **Gehen Sie zu einem Event**
3. **Klicken Sie:** "Jetzt anmelden"
4. **Füllen Sie das Formular aus** mit Ihrer echten E-Mail
5. **Absenden**
6. **✅ Erfolg:** Sie sollten 2 E-Mails erhalten:
   - Bestätigungs-E-Mail (als Teilnehmer)
   - Admin-Benachrichtigung (als Admin)

### Test 2: Resend Dashboard

1. **Gehen Sie zu:** [resend.com/emails](https://resend.com/emails)
2. **Sie sehen:** Liste aller gesendeten E-Mails
3. **Status:**
   - ✅ **Delivered:** Erfolgreich zugestellt
   - 📤 **Queued:** In Warteschlange
   - ❌ **Failed:** Fehlgeschlagen (klicken für Details)

### Test 3: Logs prüfen

**In Vercel:**
1. Ihr Projekt → Functions → Logs
2. Suchen Sie nach: "Confirmation email sent"

**In Supabase:**
1. Edge Functions → Logs
2. Suchen Sie nach: "Email sent successfully"

---

## 🐛 Troubleshooting

### Problem: "API Key is invalid"

**Ursache:** Falscher oder abgelaufener API Key

**Lösung:**
1. Gehen Sie zu Resend → API Keys
2. Erstellen Sie einen neuen Key
3. Aktualisieren Sie in Vercel + Supabase
4. Redeploy

### Problem: E-Mails kommen nicht an

**Checkliste:**

- [ ] API Key korrekt in Vercel gesetzt?
- [ ] API Key korrekt in Supabase gesetzt?
- [ ] Vercel neu deployed?
- [ ] Resend Dashboard zeigt "Delivered"?
- [ ] Spam-Ordner geprüft?
- [ ] E-Mail-Adresse korrekt eingegeben?

**Debug:**
1. Resend Dashboard → Emails
2. Klicken Sie auf die E-Mail
3. Sehen Sie Details & Fehler

### Problem: E-Mails landen im Spam

**Ursache:** Domain nicht verifiziert

**Lösung:**
1. Domain in Resend verifizieren (siehe Schritt 3 oben)
2. DNS-Einträge korrekt setzen (besonders DKIM)
3. SPF und DMARC konfigurieren

### Problem: "Daily limit exceeded"

**Ursache:** Mehr als 100 E-Mails/Tag im Free Plan

**Lösung:**
1. **Upgrade zu Resend Pro:** $20/Monat für 50.000 E-Mails
2. **Oder:** Warten Sie bis morgen (Limit setzt zurück)

---

## 💰 Resend Preise

| Plan | Preis | E-Mails/Monat | Features |
|------|-------|---------------|----------|
| **Free** | $0 | 3.000 (100/Tag) | Perfekt für Tests |
| **Pro** | $20 | 50.000 | + Domain Support |
| **Business** | $85 | 100.000+ | + Priority Support |

**Für Ihre Website:**
- 6 Events
- ~50 Teilnehmer pro Event = 300 Anmeldungen
- 2 E-Mails pro Anmeldung = 600 E-Mails
- ✅ **Free Plan reicht aus!**

---

## 🔄 Wichtige E-Mail-Adressen konfigurieren

### In Vercel Environment Variables:

| Variable | Beispiel | Beschreibung |
|----------|----------|--------------|
| `RESEND_API_KEY` | `re_abc123...` | Ihr Resend API Key |
| `ADMIN_EMAIL` | `admin@dive-demo-tour.eu` | Admin erhält Benachrichtigungen |
| `FROM_EMAIL` | `noreply@dive-demo-tour.eu` | Absender (falls Domain verifiziert) |

**Aktualisierung im Code nötig?** Lassen Sie es mich wissen!

---

## 🎨 E-Mail-Design verbessern (Optional)

Resend unterstützt HTML-E-Mails mit React!

**Aktuell:** Plain Text E-Mails  
**Möglich:** Schöne HTML-E-Mails mit Logo, Farben, Buttons

**Beispiel:**

```typescript
import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

const EmailTemplate = ({ firstName, eventTitle }) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f6f9fc' }}>
      <Container style={{ padding: '20px' }}>
        <Heading>Hallo {firstName}!</Heading>
        <Text>Vielen Dank für Ihre Anmeldung zu {eventTitle}.</Text>
        <Button href="https://dive-demo-tour.eu">
          Event-Details ansehen
        </Button>
      </Container>
    </Body>
  </Html>
);
```

**Möchten Sie schönere E-Mails?** Ich kann das für Sie implementieren!

---

## 📊 Resend Dashboard Übersicht

### Was Sie im Dashboard sehen:

**Emails:**
- Liste aller gesendeten E-Mails
- Status (Delivered, Failed, Queued)
- Zustellungsdetails
- Error-Logs

**API Keys:**
- Ihre erstellten API Keys
- Wann erstellt
- Letzter Zugriff

**Domains:**
- Verifizierte Domains
- DNS-Status
- DKIM/SPF Status

**Analytics:**
- E-Mails gesendet (täglich/monatlich)
- Zustellrate
- Fehlerrate

---

## ✅ Schnell-Checkliste

### Setup:
- [ ] Resend Account erstellt
- [ ] API Key generiert
- [ ] API Key in Vercel gesetzt
- [ ] API Key in Supabase gesetzt
- [ ] Vercel neu deployed
- [ ] Domain verifiziert (optional)
- [ ] Test-E-Mail gesendet
- [ ] E-Mail erfolgreich erhalten

### Konfiguration:
- [ ] RESEND_API_KEY in Vercel
- [ ] RESEND_API_KEY in Supabase
- [ ] ADMIN_EMAIL in Vercel
- [ ] ADMIN_EMAIL in Supabase
- [ ] FROM_EMAIL angepasst (optional)

---

## 🚨 Wichtige Sicherheitshinweise

⚠️ **API Key geheim halten!**
- ❌ NICHT in Code einfügen
- ❌ NICHT auf GitHub hochladen
- ❌ NICHT öffentlich teilen
- ✅ NUR in Environment Variables (Vercel, Supabase)

⚠️ **Service Role Key schützen!**
- Die Supabase `SUPABASE_SERVICE_ROLE_KEY` ist sehr mächtig
- Nur im Backend verwenden (Supabase Edge Functions)
- NIE im Frontend-Code!

---

## 💡 Alternative: Website ohne E-Mail

**Falls Sie keine E-Mails brauchen:**

Die Website funktioniert auch OHNE Resend!

- ✅ Anmeldungen werden in localStorage gespeichert
- ✅ Admin-Dashboard zeigt alle Anmeldungen
- ❌ Keine Bestätigungs-E-Mails
- ❌ Keine Admin-Benachrichtigungen

**E-Mails sind optional!** Nur für bessere User Experience empfohlen.

---

## 📞 Nächste Schritte

**Haben Sie den API Key erstellt?**

1. ✅ **Ja:** Tragen Sie ihn jetzt in Vercel ein!
   - Vercel → Settings → Environment Variables
   - Key: `RESEND_API_KEY`
   - Value: `re_...`

2. ❌ **Noch nicht:** Folgen Sie Schritt 1-2 oben

3. ❓ **Fragen:** Fragen Sie mich!
   - Probleme beim Account erstellen?
   - API Key nicht sichtbar?
   - DNS-Konfiguration unklar?

**Möchten Sie, dass ich:**
- 🎨 Die E-Mail-Templates verschönere?
- 📧 Die Absender-E-Mail anpasse?
- 🔧 Den Code für verifizierte Domain aktualisiere?
- ❓ Etwas anderes erkläre?

Sagen Sie mir einfach Bescheid! 😊

---

## 🎯 Zusammenfassung

**In 5 Minuten:**
1. Resend.com → Sign Up
2. API Keys → Create
3. Kopieren: `re_...`
4. Vercel → Environment Variables → Add
5. Supabase → Secrets → Add
6. ✅ Fertig!

**Ihre Website sendet jetzt E-Mails!** 📧🎉
