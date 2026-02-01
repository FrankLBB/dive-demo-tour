# DNS-KONFIGURATION FÜR VERCEL

## Übersicht

Diese Anleitung zeigt Ihnen, wie Sie Ihre eigene Domain (z.B. `dive-demo-tour.eu`) mit Ihrem Vercel-Projekt verbinden.

---

## 🎯 SCHRITT 1: Domain in Vercel hinzufügen

### 1.1 Vercel Dashboard öffnen

1. Gehen Sie zu: https://vercel.com/dashboard
2. Wählen Sie Ihr Projekt `dive-demo-tour`
3. Klicken Sie auf **"Settings"** (Zahnrad-Symbol)
4. Wählen Sie **"Domains"** im linken Menü

### 1.2 Domain hinzufügen

1. Klicken Sie auf **"Add Domain"**
2. Geben Sie Ihre Domain ein: `dive-demo-tour.eu`
3. Klicken Sie auf **"Add"**

Vercel wird Ihnen jetzt die notwendigen DNS-Einträge anzeigen.

---

## 🔧 SCHRITT 2: DNS-Einträge konfigurieren

### Option A: Root Domain (dive-demo-tour.eu)

Wenn Sie die Root-Domain (ohne www) verwenden möchten:

#### Bei Ihrem Domain-Provider eintragen:

```
Record Type: A
Name:        @ (oder leer lassen)
Value:       76.76.21.21
TTL:         3600 (oder automatisch)
```

**Zusätzlich für IPv6:**
```
Record Type: AAAA
Name:        @ (oder leer lassen)
Value:       2606:4700:4700::1111
TTL:         3600
```

---

### Option B: WWW Subdomain (www.dive-demo-tour.eu)

Wenn Sie die www-Version verwenden möchten:

```
Record Type: CNAME
Name:        www
Value:       cname.vercel-dns.com
TTL:         3600
```

---

### Option C: BEIDE (Empfohlen!)

Für die beste Konfiguration richten Sie beide ein:

#### 1. Root Domain (dive-demo-tour.eu):
```
Record Type: A
Name:        @
Value:       76.76.21.21
TTL:         3600
```

#### 2. WWW Subdomain (www.dive-demo-tour.eu):
```
Record Type: CNAME
Name:        www
Value:       cname.vercel-dns.com
TTL:         3600
```

#### 3. Redirect in Vercel konfigurieren:
- In Vercel unter "Domains" können Sie dann festlegen, dass `www` auf die Root-Domain weiterleitet (oder umgekehrt)

---

## 📋 PROVIDER-SPEZIFISCHE ANLEITUNGEN

### Bei IONOS (1&1):

1. Melden Sie sich bei IONOS an
2. Gehen Sie zu **"Domains & SSL"**
3. Wählen Sie Ihre Domain `dive-demo-tour.eu`
4. Klicken Sie auf **"DNS"** oder **"DNS-Einstellungen"**
5. Fügen Sie die DNS-Einträge hinzu:

```
A-Record:
  Host: @
  Points to: 76.76.21.21
  TTL: 3600

CNAME-Record:
  Host: www
  Points to: cname.vercel-dns.com
  TTL: 3600
```

⚠️ **WICHTIG:** Entfernen Sie alte A-Records oder CNAME-Records für `@` und `www`, falls vorhanden!

---

### Bei Strato:

1. Login auf https://www.strato.de
2. **"Domains"** → Ihre Domain auswählen
3. **"Verwaltung"** → **"DNS-Einstellungen bearbeiten"**
4. Einträge hinzufügen:

```
Typ: A
Name: (leer)
Wert: 76.76.21.21

Typ: CNAME
Name: www
Wert: cname.vercel-dns.com
```

---

### Bei Namecheap:

1. Login auf https://www.namecheap.com
2. **"Domain List"** → Ihre Domain
3. **"Manage"** → **"Advanced DNS"**
4. Einträge hinzufügen:

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

---

### Bei GoDaddy:

1. Login auf https://www.godaddy.com
2. **"My Products"** → **"DNS"** bei Ihrer Domain
3. Einträge hinzufügen/bearbeiten:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 Sekunden

Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

---

### Bei Google Domains / Squarespace Domains:

1. Login auf https://domains.google.com (oder https://domains.squarespace.com)
2. Wählen Sie Ihre Domain
3. **"DNS"** → **"Custom records"**
4. Einträge hinzufügen:

```
Type: A
Host: @
Data: 76.76.21.21
TTL: 3600

Type: CNAME
Host: www
Data: cname.vercel-dns.com
TTL: 3600
```

---

### Bei Cloudflare:

1. Login auf https://dash.cloudflare.com
2. Wählen Sie Ihre Domain
3. Gehen Sie zu **"DNS"** → **"Records"**
4. Einträge hinzufügen:

```
Type: A
Name: @
IPv4 address: 76.76.21.21
Proxy status: DNS only (grau, nicht orange!)
TTL: Auto

Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (grau!)
TTL: Auto
```

⚠️ **WICHTIG bei Cloudflare:** 
- Stellen Sie sicher, dass die **Proxy-Option deaktiviert** ist (grauer Cloud-Icon, nicht orange!)
- Sonst kann es zu SSL-Problemen kommen

---

## ⏱️ SCHRITT 3: Warten auf DNS-Propagierung

### Wie lange dauert es?

- **Minimum:** 5-10 Minuten
- **Normal:** 1-4 Stunden
- **Maximum:** 24-48 Stunden (selten)

### DNS-Propagierung überprüfen:

**Online-Tools:**
- https://dnschecker.org (empfohlen)
- https://www.whatsmydns.net
- https://dnspropagation.net

**Eingeben:**
- Domain: `dive-demo-tour.eu`
- Record Type: `A` (für Root-Domain) oder `CNAME` (für www)

**Erwartete Ergebnisse:**
- A-Record sollte zeigen: `76.76.21.21`
- CNAME sollte zeigen: `cname.vercel-dns.com`

---

## ✅ SCHRITT 4: In Vercel verifizieren

1. Zurück zu Vercel → Ihr Projekt → **"Settings"** → **"Domains"**
2. Warten Sie, bis neben Ihrer Domain ein **grüner Haken** erscheint
3. Vercel sollte automatisch ein **SSL-Zertifikat** (HTTPS) erstellen

Status-Anzeigen in Vercel:
- 🟡 **Pending:** DNS-Einträge werden noch propagiert
- 🔴 **Invalid Configuration:** DNS-Einträge sind falsch
- 🟢 **Active:** Alles funktioniert!

---

## 🔐 SSL/HTTPS Zertifikat

Vercel erstellt **automatisch** ein kostenloses SSL-Zertifikat (Let's Encrypt).

### Was Sie tun müssen:
**Nichts!** Vercel kümmert sich automatisch darum.

### Dauer:
- **Nach DNS-Propagierung:** 1-5 Minuten
- Vercel erneuert das Zertifikat automatisch alle 90 Tage

### Überprüfen:
Ihre Website sollte automatisch über `https://dive-demo-tour.eu` erreichbar sein.

---

## 🚨 HÄUFIGE PROBLEME & LÖSUNGEN

### Problem 1: "Invalid Configuration" in Vercel

**Ursache:** DNS-Einträge sind falsch oder noch nicht propagiert

**Lösung:**
1. Überprüfen Sie die DNS-Einträge bei Ihrem Provider
2. Stellen Sie sicher, dass **alte Einträge gelöscht** wurden
3. Warten Sie 1-2 Stunden für DNS-Propagierung
4. Überprüfen Sie mit https://dnschecker.org

---

### Problem 2: Domain funktioniert, aber kein HTTPS

**Ursache:** SSL-Zertifikat wird noch erstellt oder CAA-Record blockiert

**Lösung:**
1. Warten Sie 5-10 Minuten nach erfolgreicher DNS-Konfiguration
2. Überprüfen Sie CAA-Records (sollten normalerweise nicht gesetzt sein)
3. Falls vorhanden, fügen Sie hinzu:
   ```
   Type: CAA
   Name: @
   Value: 0 issue "letsencrypt.org"
   ```

---

### Problem 3: Website zeigt "Vercel 404"

**Ursache:** Domain ist verbunden, aber falsches Vercel-Projekt

**Lösung:**
1. Gehen Sie zu Vercel → **"Settings"** → **"Domains"**
2. Stellen Sie sicher, dass die Domain dem **richtigen Projekt** zugewiesen ist
3. Falls nicht: Domain entfernen und erneut hinzufügen

---

### Problem 4: WWW funktioniert, aber Root-Domain nicht (oder umgekehrt)

**Ursache:** Nur ein DNS-Eintrag wurde konfiguriert

**Lösung:**
1. Fügen Sie **beide** Einträge hinzu (A und CNAME)
2. In Vercel → **"Domains"** → Fügen Sie beide Varianten hinzu:
   - `dive-demo-tour.eu`
   - `www.dive-demo-tour.eu`
3. Konfigurieren Sie Redirect in Vercel (optional)

---

### Problem 5: "DNS_PROBE_FINISHED_NXDOMAIN" im Browser

**Ursache:** Domain existiert nicht oder DNS-Einträge sind komplett falsch

**Lösung:**
1. Überprüfen Sie, ob die Domain **registriert** ist
2. Überprüfen Sie die **Nameserver** Ihrer Domain:
   - Sie sollten auf die Nameserver Ihres Providers zeigen
   - Nicht auf Vercel (außer Sie nutzen Vercel DNS)
3. DNS-Einträge erneut überprüfen

---

### Problem 6: Alte Website wird noch angezeigt

**Ursache:** Browser-Cache oder DNS-Cache

**Lösung:**
1. **Browser-Cache leeren:**
   - Chrome/Edge: `Ctrl+Shift+Del` → Cache löschen
   - Firefox: `Ctrl+Shift+Del` → Cache löschen
2. **DNS-Cache leeren:**
   - Windows: `ipconfig /flushdns` in CMD
   - Mac: `sudo dscacheutil -flushcache` in Terminal
   - Linux: `sudo systemd-resolve --flush-caches`
3. **Inkognito-Modus** testen

---

## 🎨 ERWEITERTE KONFIGURATION

### Subdomain hinzufügen (z.B. admin.dive-demo-tour.eu)

Falls Sie eine separate Subdomain möchten:

#### DNS-Eintrag:
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: 3600
```

#### In Vercel:
1. **"Settings"** → **"Domains"** → **"Add Domain"**
2. Eingeben: `admin.dive-demo-tour.eu`
3. DNS-Propagierung abwarten

---

### E-Mail-Weiterleitung beibehalten

**WICHTIG:** Wenn Sie E-Mail-Adressen mit Ihrer Domain nutzen (z.B. info@dive-demo-tour.eu):

⚠️ **Löschen Sie NICHT die MX-Records!**

Ihre E-Mail-Provider-spezifischen DNS-Einträge sollten **unverändert** bleiben:
- **MX Records** (für E-Mail-Empfang)
- **TXT Records** (für SPF, DKIM, DMARC)

Nur **A** und **CNAME** Records für Ihre Website müssen geändert werden.

---

### DNS-Einträge für andere Services behalten

Falls Sie weitere Services nutzen, behalten Sie diese DNS-Einträge:

- **MX Records:** E-Mail-Server
- **TXT Records:** Domain-Verifizierung, SPF, DKIM
- **SRV Records:** Spezielle Services
- **Andere CNAME Records:** Andere Subdomains

---

## 📊 CHECKLISTE FÜR ERFOLGREICHE KONFIGURATION

### Vor der Konfiguration:
- [ ] Domain ist registriert und aktiv
- [ ] Zugriff auf DNS-Verwaltung des Providers
- [ ] Vercel-Projekt ist erstellt und läuft
- [ ] Backup der aktuellen DNS-Einträge gemacht

### DNS-Konfiguration:
- [ ] A-Record hinzugefügt: `@ → 76.76.21.21`
- [ ] CNAME-Record hinzugefügt: `www → cname.vercel-dns.com`
- [ ] Alte A/CNAME-Records für @ und www gelöscht
- [ ] MX-Records NICHT gelöscht (falls E-Mail genutzt wird)

### In Vercel:
- [ ] Domain in Vercel hinzugefügt
- [ ] Status zeigt "Active" (grüner Haken)
- [ ] SSL-Zertifikat wurde erstellt
- [ ] Website ist über HTTPS erreichbar

### Nach der Konfiguration:
- [ ] DNS-Propagierung mit https://dnschecker.org überprüft
- [ ] Website funktioniert über `dive-demo-tour.eu`
- [ ] Website funktioniert über `www.dive-demo-tour.eu`
- [ ] HTTPS funktioniert (grünes Schloss im Browser)
- [ ] Alle Unterseiten sind erreichbar

---

## 🆘 SUPPORT & HILFE

### Vercel Support:
- https://vercel.com/support
- Dokumentation: https://vercel.com/docs/concepts/projects/domains

### DNS-Check Tools:
- **DNSChecker:** https://dnschecker.org
- **WhatsMyDNS:** https://www.whatsmydns.net
- **DNS Propagation:** https://dnspropagation.net
- **MXToolbox:** https://mxtoolbox.com (für erweiterte Checks)

### Vercel Status:
- https://vercel-status.com (bei generellen Problemen)

---

## 📝 ZUSAMMENFASSUNG

### Schnelle Schritt-für-Schritt-Anleitung:

1. **Domain in Vercel hinzufügen:**
   - Vercel Dashboard → Projekt → Settings → Domains → Add Domain

2. **DNS-Einträge beim Provider hinzufügen:**
   ```
   A-Record:    @ → 76.76.21.21
   CNAME:       www → cname.vercel-dns.com
   ```

3. **Alte Einträge löschen:**
   - Alte A-Records für @ löschen
   - Alte CNAME-Records für www löschen

4. **Warten:**
   - 1-4 Stunden für DNS-Propagierung

5. **Verifizieren:**
   - Vercel zeigt grünen Haken
   - Website über HTTPS erreichbar

**Das war's!** 🎉

---

## 🔍 TROUBLESHOOTING CHECKLIST

Wenn es nicht funktioniert, gehen Sie diese Liste durch:

- [ ] DNS-Einträge sind **exakt** wie beschrieben (keine Tippfehler!)
- [ ] Alte DNS-Einträge wurden **gelöscht**
- [ ] Mindestens **1 Stunde** gewartet
- [ ] DNS mit https://dnschecker.org überprüft
- [ ] Browser-Cache geleert
- [ ] In **Inkognito-Modus** getestet
- [ ] Domain in **Vercel hinzugefügt**
- [ ] Vercel-Projekt ist **aktiv** und läuft
- [ ] Keine Cloudflare-Proxy aktiviert (wenn Cloudflare genutzt wird)

Wenn alles überprüft ist und es immer noch nicht funktioniert:
→ Kontaktieren Sie Ihren Domain-Provider oder Vercel Support

---

**Viel Erfolg mit Ihrem Deployment!** 🚀
