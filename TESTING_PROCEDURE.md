# 🧪 Local Malware Testing Procedure

## Overview
This document explains how to test for malware locally before deploying to production.

---

## What We Fixed

### Security Vulnerabilities Patched ✅
- **Next.js 15.5.5 → 15.5.10**
  - ❌ CRITICAL: RCE in React flight protocol (GHSA-9qr9-h5gf-34mp)
  - ❌ HIGH: DoS with Server Components (GHSA-mwv6-3258-q52c)
  - ❌ HIGH: HTTP deserialization DoS (GHSA-h25m-26qc-wcjf)
  - ❌ MODERATE: Server Actions source code exposure (GHSA-w37m-7fhw-fmv9)
  - ❌ MODERATE: Image Optimizer DoS (GHSA-9g9p-9gw9-jx7f)

### Malware Indicators We're Testing For
1. **UDP DDoS attacks** - Outbound UDP floods to random IPs
2. **File system writes** - Attempts to write `/lrt`, `/dev/lrt`, `/etc/lrt`, `/var/lrt`
3. **Obfuscated code execution** - `returnNaN()` function calls
4. **High CPU usage** - Cryptomining or DoS activity

---

## Testing Steps

### 1. Automated Test (Recommended)
```bash
# Run the comprehensive malware test
./test-malware-local.sh
```

This will:
- ✅ Start the Docker container
- ✅ Monitor logs for malware indicators
- ✅ Check UDP traffic for 30 seconds
- ✅ Analyze CPU and network usage
- ✅ Automatically stop container if malware detected

### 2. Manual Testing

#### Step 1: Build the Image
```bash
# Build without cache (ensures fresh npm packages)
docker-compose build --no-cache
```

#### Step 2: Start the Container
```bash
# Start in detached mode
docker-compose up -d
```

#### Step 3: Check Container Logs
```bash
# Watch for malware indicators
docker-compose logs -f | grep -E "lrt|returnNaN"
```

**If you see these errors, MALWARE IS PRESENT:**
```
[Error: EACCES: permission denied, open '/lrt']
[ReferenceError: returnNaN is not defined]
```

#### Step 4: Monitor UDP Traffic
```bash
# In a separate terminal, run:
./monitor-local-udp.sh
```

**Watch for:**
- Sudden spike in UDP connections (>50 connections)
- Connections to random external IPs
- High packet rates

#### Step 5: Check Resource Usage
```bash
# Monitor CPU and network
docker stats
```

**Red flags:**
- CPU > 80% (possible cryptomining)
- Network TX > 100MB after a few minutes (possible DDoS)

#### Step 6: Test the Application
```bash
# Visit the site
open http://localhost:3000
```

Verify it loads correctly without errors.

---

## What Clean Output Looks Like

### Clean Container Logs ✅
```
▲ Next.js 15.5.10
- Local:        http://localhost:3000
- Network:      http://0.0.0.0:3000

✓ Starting...
✓ Ready in 200ms
```

**NO errors about:**
- `/lrt` files
- `returnNaN`
- Permission denied errors

### Clean UDP Traffic ✅
```
[23:51:00] UDP connections: 2 | Status: OK ✓
[23:51:10] UDP connections: 2 | Status: OK ✓
[23:51:20] UDP connections: 3 | Status: OK ✓
```

**Baseline:** 1-5 connections (normal DNS, etc.)
**Problem:** >50 connections or rapid increase

### Clean Resource Usage ✅
```
CONTAINER    CPU %   MEM USAGE   NET I/O
frontend     2.5%    300MiB      1.2MB / 500kB
```

**Normal:**
- CPU: 0-10% (idle), 10-40% (under load)
- Network TX: <10MB in first 5 minutes

---

## If Malware is Detected 🚨

### Immediate Actions:
```bash
# 1. STOP the container immediately
docker-compose down

# 2. DO NOT deploy to production

# 3. Report findings
echo "Malware detected on $(date)" >> malware-incident.log
```

### Investigation Steps:

#### 1. Identify the Malicious Package
```bash
# Compare lockfile with last known good version
git diff HEAD~1 pnpm-lock.yaml

# Check for recently added packages
git log -p --since="7 days ago" -- pnpm-lock.yaml
```

#### 2. Search for Suspicious Code
```bash
# Search for dgram (UDP socket creation)
find node_modules -name "*.js" -exec grep -l "dgram\|createSocket" {} \;

# Search for obfuscated code
find node_modules -name "*.js" -exec grep -l "eval\|Function\(" {} \;
```

#### 3. Report to npm
Visit: https://www.npmjs.com/support
Subject: "Malware in package <package-name>"

#### 4. Clean Everything
```bash
# Remove all build artifacts
rm -rf node_modules .next build.log

# Clear npm/pnpm cache
pnpm store prune
npm cache clean --force

# Reinstall from clean state
pnpm install --frozen-lockfile
```

---

## If Clean - Deploy to Production ✅

### 1. Run Security Scan
```bash
./security-scan.sh
```

### 2. Push to Git
```bash
git push origin main
```

### 3. Deploy to Server
```bash
# SSH to server
ssh deploy@168.119.110.41

# Pull latest code
cd /opt/apps/frontend
git pull origin main

# Rebuild without cache
docker compose down
docker compose build --no-cache
docker compose up -d

# Monitor for 5 minutes
watch -n 5 'docker stats --no-stream'
```

### 4. Monitor Production
```bash
# Check logs
docker logs -f crimson-ui-frontend

# Check for UDP traffic on server
ss -anu | grep -v '127.0.0'
```

---

## Prevention for Future

### 1. Lock Dependencies
```json
{
  "dependencies": {
    "next": "15.5.10",  // ✅ No ^ or ~
    "react": "19.1.0"   // ✅ Exact version
  }
}
```

### 2. Weekly Security Scans
```bash
# Add to crontab
0 9 * * 1 cd /path/to/project && ./security-scan.sh
```

### 3. Pre-commit Hook
```bash
# Install husky
pnpm add -D husky

# Add pre-commit hook
echo "./security-scan.sh" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### 4. Dependency Review
Before adding ANY new package:
1. Check https://snyk.io/advisor/npm-package/<package-name>
2. Review package source on GitHub
3. Check download count (>10k/week for popular packages)
4. Verify maintainer reputation
5. Use `SECURITY_CHECKLIST.md`

---

## Tools Created

| File | Purpose |
|------|---------|
| `security-scan.sh` | Comprehensive security scanner |
| `monitor-local-udp.sh` | Real-time UDP traffic monitor |
| `test-malware-local.sh` | Automated malware detection test |
| `SECURITY_CHECKLIST.md` | Dependency vetting checklist |
| `TESTING_PROCEDURE.md` | This document |

---

## Timeline of Events

### February 15, 2026
- **13:48 UTC** - First UDP DDoS attack detected (to 123.255.88.0)
- **14:03 UTC** - All containers stopped by user during investigation
- **Services offline** - "Flowpload server issues" reported

### February 16, 2026
- **00:00 UTC** - All services restored
- **02:31 UTC** - SECOND attack detected (to 37.59.144.156)
- **02:31 UTC** - Frontend stopped immediately (689GB sent!)
- **23:00 IST** - Security vulnerabilities fixed locally
- **23:43 IST** - Next.js updated to 15.5.10
- **23:50 IST** - Local Docker testing initiated

---

## Contact

If malware is detected or you need help:
1. Stop all deployments immediately
2. Document findings
3. Run `./security-scan.sh` and save report
4. Do NOT redeploy until malware is identified and removed

---

**Last Updated:** February 17, 2026 00:00 IST
**Status:** Testing in progress
