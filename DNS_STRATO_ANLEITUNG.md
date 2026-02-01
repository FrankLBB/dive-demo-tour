# DNS-KONFIGURATION FÜR STRATO

## Schritt-für-Schritt Anleitung für dive-demo-tour.eu bei Strato

---

## 🎯 ÜBERSICHT

Sie werden folgende DNS-Einträge bei Strato konfigurieren:

```
A-Record:     @ → 76.76.21.21
CNAME-Record: www → cname.vercel-dns.com
```

**Dauer:** 10-15 Minuten + 1-4 Stunden Wartezeit für DNS-Propagierung

---

## ⚠️ WICHTIG: VOR DEM START

### E-Mail-Adressen bei Strato?

Falls Sie E-Mail-Adressen mit Ihrer Domain nutzen (z.B. `info@dive-demo-tour.eu`):

- ✅ **MX-Records NICHT löschen!**
- ✅ Nur A-Records und CNAME-Records ändern
- ✅ TXT-Records für E-Mail (SPF, DKIM) behalten

### Backup erstellen

**Empfehlung:** Machen Sie Screenshots Ihrer aktuellen DNS-Einstellungen, bevor Sie Änderungen vornehmen!

---

## 📝 SCHRITT 1: DOMAIN IN VERCEL HINZUFÜGEN

**Zuerst in Vercel, dann bei Strato!**

1. Gehen Sie zu: https://vercel.com/dashboard
2. Wählen Sie Ihr Projekt **"dive-demo-tour"**
3. Klicken Sie auf **"Settings"** (Zahnrad-Symbol)
4. Klicken Sie auf **"Domains"** im linken Menü
5. Klicken Sie auf **"Add Domain"**
6. Geben Sie ein: `dive-demo-tour.eu`
7. Klicken Sie auf **"Add"**

**Ergebnis:** Vercel zeigt Ihnen jetzt die DNS-Einträge an, die Sie bei Strato eintragen müssen.

**⚠️ Lassen Sie dieses Fenster geöffnet!** Sie benötigen die Informationen für Strato.

---

## 🔧 SCHRITT 2: BEI STRATO ANMELDEN

1. Öffnen Sie einen neuen Browser-Tab
2. Gehen Sie zu: https://www.strato.de/customer-service
3. Klicken Sie auf **"Login"**
4. Geben Sie Ihre **Kundennummer** (oder E-Mail) und **Passwort** ein
5. Klicken Sie auf **"Anmelden"**

---

## 🌐 SCHRITT 3: DNS-VERWALTUNG ÖFFNEN

### Im Strato Kundenservice-Bereich:

1. Klicken Sie oben im Menü auf **"Domains"**
   - Oder suchen Sie in der Seitenleiste nach "Domains"

2. Sie sehen jetzt eine Liste Ihrer Domains
   - Suchen Sie **"dive-demo-tour.eu"**

3. Klicken Sie bei Ihrer Domain auf **"Verwalten"** oder **"Verwaltung"**
   - Bei manchen Accounts heißt es auch "Domainverwaltung"

4. Scrollen Sie runter bis zum Bereich **"DNS-Einstellungen"** oder **"Nameserver & DNS"**

5. Klicken Sie auf **"DNS-Einstellungen bearbeiten"** oder **"DNS verwalten"**

**Hinweis:** Die Strato-Oberfläche kann je nach Account-Typ leicht unterschiedlich aussehen.

---

## 🗑️ SCHRITT 4: ALTE EINTRÄGE LÖSCHEN (WICHTIG!)

**Bevor Sie neue Einträge hinzufügen, müssen alte gelöscht werden!**

### A-Records für Root-Domain (@) löschen:

1. Suchen Sie in der Liste nach Einträgen mit:
   - **Typ:** `A`
   - **Name/Host:** `@` oder leer oder `dive-demo-tour.eu`

2. Falls vorhanden: Klicken Sie auf **"Löschen"** oder das **Papierkorb-Symbol** ❌

### CNAME-Records für www löschen:

1. Suchen Sie nach Einträgen mit:
   - **Typ:** `CNAME`
   - **Name/Host:** `www`

2. Falls vorhanden: Klicken Sie auf **"Löschen"** oder das **Papierkorb-Symbol** ❌

**⚠️ NICHT LÖSCHEN:**
- **MX-Records** (für E-Mail)
- **TXT-Records** (für E-Mail SPF/DKIM)
- **SRV-Records** (falls vorhanden)
- Andere CNAME-Records (z.B. für Subdomains wie `mail`, `ftp`, etc.)

---

## ➕ SCHRITT 5: A-RECORD HINZUFÜGEN (Root-Domain)

### Neuen A-Record erstellen:

1. Klicken Sie auf **"Neuer Eintrag"**, **"Eintrag hinzufügen"** oder **"+"**

2. Wählen Sie als **Typ:** `A` oder `A-Record`

3. Füllen Sie die Felder aus:

   | Feld | Wert | Hinweis |
   |------|------|---------|
   | **Name** oder **Host** | `@` oder leer lassen | Für die Root-Domain |
   | **Wert** oder **IP-Adresse** | `76.76.21.21` | Vercel's IP-Adresse |
   | **TTL** | `3600` oder `1 Stunde` | Falls änderbar |

4. Klicken Sie auf **"Speichern"** oder **"Hinzufügen"**

**Wichtig:**
- Bei Strato wird manchmal statt `@` die Domain selbst angezeigt
- Wenn Sie "Name/Host" leer lassen, wird automatisch `@` verwendet
- Die IP-Adresse **muss exakt** `76.76.21.21` sein

---

## ➕ SCHRITT 6: CNAME-RECORD HINZUFÜGEN (www Subdomain)

### Neuen CNAME-Record erstellen:

1. Klicken Sie erneut auf **"Neuer Eintrag"** oder **"+"**

2. Wählen Sie als **Typ:** `CNAME` oder `CNAME-Record`

3. Füllen Sie die Felder aus:

   | Feld | Wert | Hinweis |
   |------|------|---------|
   | **Name** oder **Host** | `www` | Für www.dive-demo-tour.eu |
   | **Wert** oder **Ziel** | `cname.vercel-dns.com` | Vercel's CNAME-Ziel |
   | **TTL** | `3600` oder `1 Stunde` | Falls änderbar |

4. Klicken Sie auf **"Speichern"** oder **"Hinzufügen"**

**Wichtig:**
- Der Wert muss **exakt** `cname.vercel-dns.com` sein (ohne Punkt am Ende)
- NICHT `cname.vercel-dns.com.` (kein Punkt am Ende!)
- Strato fügt manchmal automatisch einen Punkt hinzu - das ist OK

---

## ✅ SCHRITT 7: ÄNDERUNGEN SPEICHERN & ÜBERPRÜFEN

### Speichern:

1. Falls noch nicht gespeichert: Klicken Sie auf **"Änderungen speichern"** oder **"Übernehmen"**

2. Strato zeigt eventuell eine Bestätigungsmeldung:
   - "Die DNS-Einstellungen wurden gespeichert"
   - "Änderungen werden in Kürze aktiv"

### Visuelle Überprüfung:

Ihre DNS-Einträge sollten jetzt so aussehen:

```
Typ      Name/Host    Wert/Ziel              TTL
----------------------------------------------------
A        @            76.76.21.21            3600
CNAME    www          cname.vercel-dns.com   3600
```

**Plus Ihre bestehenden E-Mail-Einträge (falls vorhanden):**
```
Typ      Name/Host    Wert                   TTL
----------------------------------------------------
MX       @            mx01.strato.de         3600
TXT      @            v=spf1 ...             3600
```

---

## ⏱️ SCHRITT 8: WARTEN AUF DNS-PROPAGIERUNG

### Wie lange dauert es?

- **Minimum:** 10-30 Minuten
- **Normal:** 1-4 Stunden
- **Maximum:** 24 Stunden (sehr selten)

**Strato-Hinweis:** Strato ist oft schneller als der angegebene TTL-Wert. Meistens funktioniert es nach 30-60 Minuten.

### Was passiert in dieser Zeit?

- Die DNS-Server weltweit aktualisieren ihre Informationen
- Ihre Domain zeigt noch auf den alten Server
- **Keine Panik!** Das ist normal

### Tipps während der Wartezeit:

- ☕ Machen Sie eine Kaffeepause
- 📧 Checken Sie Ihre E-Mails (sollten weiterhin funktionieren)
- 🌐 Überprüfen Sie die Propagierung (siehe nächster Schritt)

---

## 🔍 SCHRITT 9: DNS-PROPAGIERUNG ÜBERPRÜFEN

### Online-Tool nutzen:

1. Gehen Sie zu: https://dnschecker.org

2. Geben Sie ein:
   - **Domain:** `dive-demo-tour.eu`
   - **Record Type:** `A`

3. Klicken Sie auf **"Search"**

**Erwartetes Ergebnis:**
- Die meisten Server (grüne Häkchen ✅) sollten `76.76.21.21` anzeigen
- Einige Server können noch die alte IP zeigen (das ist OK während der Propagierung)

4. Wiederholen Sie den Check für CNAME:
   - **Domain:** `www.dive-demo-tour.eu`
   - **Record Type:** `CNAME`
   - **Erwartetes Ergebnis:** `cname.vercel-dns.com`

### Alternative Check-Tools:

- https://www.whatsmydns.net
- https://dnspropagation.net

---

## 🔐 SCHRITT 10: IN VERCEL VERIFIZIEREN

### Zurück zu Vercel:

1. Gehen Sie zurück zu Ihrem Vercel-Tab
2. Projekt → **"Settings"** → **"Domains"**
3. Suchen Sie Ihre Domain `dive-demo-tour.eu` in der Liste

### Status-Anzeigen:

| Status | Bedeutung | Aktion |
|--------|-----------|--------|
| 🟡 **Pending** | DNS-Einträge werden noch propagiert | ⏱️ Weiter warten |
| 🔴 **Invalid Configuration** | DNS-Einträge sind falsch | 🔧 Einträge überprüfen |
| 🟢 **Valid Configuration** | DNS ist korrekt, SSL wird erstellt | ✅ Fast fertig! |
| 🟢 **Active** | Alles funktioniert! | 🎉 Fertig! |

### SSL-Zertifikat:

Nach erfolgreicher DNS-Konfiguration:
- Vercel erstellt **automatisch** ein SSL-Zertifikat (1-5 Minuten)
- Keine Aktion erforderlich!
- Das Zertifikat wird automatisch alle 90 Tage erneuert

---

## 🎉 SCHRITT 11: WEBSITE TESTEN

### Testen Sie beide Domains:

1. **Root-Domain:** https://dive-demo-tour.eu
   - Sollte Ihre Website anzeigen
   - Mit grünem Schloss-Symbol 🔒 (HTTPS)

2. **WWW-Subdomain:** https://www.dive-demo-tour.eu
   - Sollte ebenfalls funktionieren
   - Eventuell automatisch zu Root-Domain weiterleiten

### Funktionalitäten testen:

- [ ] Startseite lädt korrekt
- [ ] Event-Übersicht wird angezeigt
- [ ] Event-Detailseiten funktionieren
- [ ] Admin-Login funktioniert (`/admin`)
- [ ] Navigation funktioniert
- [ ] Bilder werden angezeigt
- [ ] HTTPS ist aktiv (grünes Schloss)

---

## 🔧 STRATO-SPEZIFISCHE PROBLEME

### Problem 1: "DNS-Einstellungen können nicht bearbeitet werden"

**Mögliche Ursachen:**
- Domain-Transfer läuft noch
- Domain ist gesperrt
- Externe Nameserver sind aktiv

**Lösung:**

1. Überprüfen Sie den Domain-Status:
   - Strato → Domains → Ihre Domain → Status

2. Bei externer Nameserver-Nutzung:
   - Stellen Sie auf Strato-Nameserver um
   - Strato → Domains → Nameserver → "Strato-Nameserver verwenden"
   - ⚠️ Dauert 24-48 Stunden!

3. Bei Sperrung:
   - Kontaktieren Sie Strato-Support: 030 300 146 222

---

### Problem 2: Einträge werden nicht gespeichert

**Lösung:**

1. **Browser-Cache leeren:**
   - Strg + F5 zum Neuladen
   - Oder Browser komplett neu starten

2. **Anderen Browser versuchen:**
   - Chrome statt Firefox (oder umgekehrt)

3. **Session-Problem:**
   - Komplett ausloggen
   - Browser schließen
   - Neu einloggen

---

### Problem 3: A-Record kann nicht hinzugefügt werden

**Fehlermeldung:** "Ein A-Record für @ existiert bereits"

**Lösung:**

1. Scrollen Sie durch ALLE DNS-Einträge
2. Suchen Sie nach versteckten A-Records
3. Löschen Sie ALLE A-Records für `@` oder die Root-Domain
4. Versuchen Sie es erneut

**Alternative:**
- Manchmal muss man den alten A-Record **bearbeiten** statt einen neuen zu erstellen
- Klicken Sie auf "Bearbeiten" beim bestehenden A-Record
- Ändern Sie die IP auf `76.76.21.21`

---

### Problem 4: CNAME-Konflikt mit A-Record

**Fehlermeldung:** "CNAME und A-Record können nicht gleichzeitig existieren"

**Ursache:** Verwechslung zwischen `@` (Root) und `www` (Subdomain)

**Lösung:**

Stellen Sie sicher:
- **A-Record** ist für `@` (Root-Domain)
- **CNAME** ist für `www` (Subdomain)
- NICHT beide für das gleiche Ziel!

---

### Problem 5: TTL kann nicht geändert werden

**Bei Strato ist TTL oft fest auf 3600 (1 Stunde) eingestellt**

**Lösung:**
- Das ist OK! 3600 ist ein guter Standard-Wert
- Sie können nichts ändern und müssen nichts ändern

---

## 📧 E-MAIL WEITERHIN NUTZEN

### Ihre E-Mails funktionieren weiterhin!

Falls Sie Strato-E-Mail nutzen:

**Diese Einträge MÜSSEN erhalten bleiben:**

```
Typ      Name    Wert
----------------------------------
MX       @       mx01.strato.de    (Priorität 10)
MX       @       mx02.strato.de    (Priorität 20)
```

**Zusätzliche E-Mail-Einträge (falls vorhanden):**
```
TXT      @       v=spf1 include:spf.strato.com ~all
CNAME    mail    webmail.strato.de
```

**⚠️ Diese NICHT löschen!** Sonst funktionieren Ihre E-Mails nicht mehr.

### E-Mail nach DNS-Änderung testen:

1. Warten Sie 1-2 Stunden nach DNS-Änderung
2. Senden Sie eine Test-E-Mail an Ihre Domain-E-Mail
3. Überprüfen Sie den Empfang

---

## 🚨 NOTFALL: RÜCKGÄNGIG MACHEN

Falls etwas schief geht und Sie zu den alten Einstellungen zurück möchten:

### Sofort rückgängig machen:

1. **A-Record ändern:**
   - Ändern Sie die IP zurück zur alten IP
   - (Die Sie hoffentlich vorher notiert haben)

2. **CNAME-Record ändern:**
   - Ändern Sie zurück zum alten Ziel
   - (Oder löschen Sie den CNAME)

3. **Warten:**
   - DNS-Propagierung dauert auch beim Zurücksetzen 1-4 Stunden

### Strato Support kontaktieren:

**Telefon:** 030 300 146 222 (Mo-Fr 8-20 Uhr, Sa 10-16 Uhr)

**Hinweis:** Support-Mitarbeiter können keine DNS-Einstellungen direkt ändern, aber Ihnen helfen, wenn etwas technisch blockiert ist.

---

## ✅ CHECKLISTE: ALLES ERLEDIGT?

### Bei Vercel:
- [ ] Domain `dive-demo-tour.eu` hinzugefügt
- [ ] Status zeigt "Active" (grüner Haken)
- [ ] SSL-Zertifikat wurde erstellt

### Bei Strato:
- [ ] Bei Strato angemeldet
- [ ] DNS-Verwaltung geöffnet
- [ ] Alte A-Records gelöscht
- [ ] Alte CNAME-Records gelöscht
- [ ] Neuer A-Record: `@ → 76.76.21.21`
- [ ] Neuer CNAME: `www → cname.vercel-dns.com`
- [ ] Änderungen gespeichert
- [ ] MX-Records für E-Mail NICHT gelöscht

### Verifizierung:
- [ ] DNS-Propagierung auf dnschecker.org überprüft
- [ ] Website unter `https://dive-demo-tour.eu` erreichbar
- [ ] Website unter `https://www.dive-demo-tour.eu` erreichbar
- [ ] HTTPS funktioniert (grünes Schloss)
- [ ] Alle Seiten laden korrekt
- [ ] Admin-Dashboard unter `/admin` funktioniert
- [ ] E-Mails funktionieren weiterhin (falls genutzt)

---

## 🎯 ZUSAMMENFASSUNG

### Was Sie gemacht haben:

1. ✅ Domain in Vercel hinzugefügt
2. ✅ Bei Strato DNS-Einstellungen geöffnet
3. ✅ Alte Einträge gelöscht
4. ✅ Neue Einträge hinzugefügt:
   - A-Record: `@ → 76.76.21.21`
   - CNAME: `www → cname.vercel-dns.com`
5. ✅ Auf DNS-Propagierung gewartet
6. ✅ SSL-Zertifikat wurde automatisch erstellt
7. ✅ Website ist live auf Ihrer eigenen Domain!

### Ihre Website ist jetzt erreichbar unter:

- 🌐 **https://dive-demo-tour.eu**
- 🌐 **https://www.dive-demo-tour.eu**
- 🌐 **https://dive-demo-tour.vercel.app** (weiterhin aktiv)

**Herzlichen Glückwunsch! 🎉**

---

## 📞 HILFE & SUPPORT

### Strato Support:
- **Telefon:** 030 300 146 222
- **E-Mail:** support@strato.de
- **Chat:** Im Kundenbereich verfügbar
- **Öffnungszeiten:** Mo-Fr 8-20 Uhr, Sa 10-16 Uhr

### Vercel Support:
- **Website:** https://vercel.com/support
- **Dokumentation:** https://vercel.com/docs/concepts/projects/domains

### DNS-Tools:
- **DNSChecker:** https://dnschecker.org
- **WhatsMyDNS:** https://www.whatsmydns.net
- **MXToolbox:** https://mxtoolbox.com

---

**Viel Erfolg mit Ihrer DIVE DEMO TOUR Website!** 🚀🌊
