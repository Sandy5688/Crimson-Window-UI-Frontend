# 🔒 Package.json Security Checklist

**Use this checklist BEFORE adding any new dependency to package.json**

---

## Pre-Installation Checks

### 1. Package Verification ✅
- [ ] Package name is spelled correctly (check official docs)
- [ ] Package is published by official/trusted maintainer
- [ ] Package has recent activity (updated within last 6 months)
- [ ] Package has good download count (>10k weekly for popular packages)
- [ ] Package has a valid repository link (preferably GitHub)

**How to check:**
```bash
npm view <package-name>
# Or visit: https://www.npmjs.com/package/<package-name>
```

---

### 2. Security Audit ✅
- [ ] No known CVEs (Common Vulnerabilities and Exposures)
- [ ] No critical or high security advisories
- [ ] Package is not deprecated
- [ ] Package license is acceptable (MIT, Apache, BSD, ISC)

**How to check:**
```bash
# Check on Snyk
https://snyk.io/advisor/npm-package/<package-name>

# Or use npm
npm audit
```

---

### 3. Dependency Analysis ✅
- [ ] Package has reasonable number of dependencies (<50)
- [ ] No circular dependencies
- [ ] Transitive dependencies are trustworthy
- [ ] No duplicate dependencies with existing packages

**How to check:**
```bash
npm ls <package-name>
pnpm why <package-name>
```

---

### 4. Code Review ✅
- [ ] Package source code is available (open source)
- [ ] No obfuscated or minified code in source
- [ ] No suspicious install scripts (postinstall, preinstall)
- [ ] README and documentation look professional

**How to check:**
```bash
# View on GitHub
https://github.com/<org>/<package-name>

# Check package.json scripts
npm view <package-name> scripts
```

---

### 5. Reputation Checks ✅
- [ ] Package has >100 stars on GitHub (for popular packages)
- [ ] Package has active issues/PRs being addressed
- [ ] Maintainer(s) are verified
- [ ] No reports of malware or security incidents

**How to check:**
```bash
# GitHub stars
https://github.com/<org>/<package-name>

# npm downloads
https://npm-stat.com/charts.html?package=<package-name>
```

---

## Red Flags 🚩

**DO NOT INSTALL if any of these apply:**

### Critical Red Flags ❌
- ❌ Package was published within last 7 days (unless from trusted org)
- ❌ Package has install scripts (postinstall/preinstall) without clear purpose
- ❌ Package requests unusual permissions
- ❌ Package name is similar to popular package (typosquatting)
  - Examples: `reacct` instead of `react`, `expresss` instead of `express`
- ❌ Maintainer account created recently (<3 months)
- ❌ Package has no description or vague description
- ❌ GitHub repo is missing or private
- ❌ Package size is unusually large for its purpose

### Warning Signs ⚠️
- ⚠️  Package has no tests
- ⚠️  Package hasn't been updated in >2 years
- ⚠️  Package has open critical security issues
- ⚠️  Package has very few downloads despite being "popular"
- ⚠️  Multiple similar packages by same author
- ⚠️  Package requires native dependencies without clear reason

---

## Known Malicious Packages 🦠

**NEVER install these packages:**

```
❌ node-ipc (versions with protest-ware)
❌ peacenotwar
❌ event-stream@3.3.6
❌ flatmap-stream
❌ eslint-scope@3.7.2
❌ getcookies
❌ crossenv (typosquat of cross-env)
❌ babelcli (typosquat of babel-cli)
❌ cross-env.js (malicious variant)
```

---

## Typosquatting Prevention 🎯

**Common typosquatting patterns:**

| Correct Package | Common Typosquats |
|----------------|-------------------|
| `express` | expresss, expres, express-js |
| `react` | reacct, reactt, react-js |
| `axios` | axois, axioss, axios-proxy |
| `lodash` | lodas, loadash, lodsh |
| `request` | requset, requist |
| `mongoose` | mongose, mongoos |

**Always double-check spelling before installing!**

---

## Safe Installation Process 📦

```bash
# 1. Check package info FIRST
npm view <package-name>

# 2. Check security (Snyk)
# Visit: https://snyk.io/advisor/npm-package/<package-name>

# 3. Read the source code on GitHub
# Visit: https://github.com/<org>/<package-name>

# 4. Install with exact version (no ^ or ~)
npm install <package-name>@<exact-version> --save-exact

# Or with pnpm:
pnpm add <package-name>@<exact-version> --save-exact

# 5. Run security scan after install
npm audit
./security-scan.sh

# 6. Commit with meaningful message
git add package.json pnpm-lock.yaml
git commit -m "deps: add <package-name>@<version> for <reason>"
```

---

## Version Pinning Strategy 📌

### For Production Dependencies

**Use EXACT versions (no ^ or ~):**
```json
{
  "dependencies": {
    "next": "15.5.5",        // ✅ EXACT
    "react": "19.1.0",       // ✅ EXACT
    "axios": "^1.12.2"       // ❌ ALLOWS UPDATES
  }
}
```

**Why?**
- Prevents unexpected updates that could introduce vulnerabilities
- Ensures reproducible builds
- Locks down the exact tested version

### How to Convert to Exact Versions

```bash
# Remove all ^ and ~ from package.json manually
# Or use this command:
sed -i '' 's/"\^/"/g' package.json
sed -i '' 's/"~/"/g' package.json

# Then reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Dependency Update Policy 📅

### When to Update
- ✅ Critical security patches (update immediately)
- ✅ High-severity vulnerabilities (update within 7 days)
- ✅ Moderate vulnerabilities (update within 30 days)
- ⚠️  Minor/patch releases (review quarterly)
- ⚠️  Major releases (plan and test before updating)

### How to Update Safely

```bash
# 1. Check what's outdated
pnpm outdated

# 2. Update one package at a time
pnpm update <package-name> --latest

# 3. Run tests after EACH update
pnpm test

# 4. Run security scan
./security-scan.sh

# 5. Test build
pnpm build

# 6. Commit if all passes
git add package.json pnpm-lock.yaml
git commit -m "deps: update <package-name> to fix CVE-XXXX-XXXX"
```

---

## Automated Security Scanning 🤖

### Daily Checks (Automated)

Set up GitHub Dependabot:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
```

### Pre-Commit Hook

Install Husky for pre-commit checks:
```bash
# Install husky
pnpm add -D husky

# Set up pre-commit hook
npx husky init
echo "./security-scan.sh" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### CI/CD Integration

Add to your CI pipeline:
```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
      - run: ./security-scan.sh
```

---

## Emergency Response 🚨

### If Malware is Detected:

1. **STOP ALL DEPLOYMENTS IMMEDIATELY**
2. **Identify the malicious package:**
   ```bash
   npm ls | grep <suspicious-package>
   ```
3. **Remove it:**
   ```bash
   npm uninstall <malicious-package>
   ```
4. **Clear all caches:**
   ```bash
   rm -rf node_modules .next
   npm cache clean --force
   pnpm store prune
   ```
5. **Rebuild from clean state:**
   ```bash
   pnpm install --frozen-lockfile
   ```
6. **Scan system for persistence:**
   ```bash
   # Check for modified system files
   find ~ -name "*.lrt" -o -name "*malware*"
   ```
7. **Report to npm:**
   ```
   https://www.npmjs.com/support
   ```

---

## Trusted Package Sources 🌟

### Verified Organizations
- ✅ `@vercel` - Next.js, Turbopack
- ✅ `@radix-ui` - UI primitives
- ✅ `@mui` - Material UI
- ✅ `@supabase` - Supabase client
- ✅ `@types` - TypeScript definitions

### Always verify on:
- https://www.npmjs.com
- https://github.com
- https://snyk.io/advisor

---

## Monthly Security Review 📆

**Last Day of Each Month:**

- [ ] Run `npm audit`
- [ ] Run `./security-scan.sh`
- [ ] Review `pnpm outdated`
- [ ] Check GitHub security alerts
- [ ] Update critical dependencies
- [ ] Rebuild production images without cache
- [ ] Review this checklist for updates

---

## Resources 📚

- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [Snyk Advisor](https://snyk.io/advisor)
- [Socket.dev - Package Security](https://socket.dev/)
- [npm Malware Reporting](https://docs.npmjs.com/reporting-malware-in-an-npm-package)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)

---

**Last Updated:** February 16, 2026
**Next Review:** March 16, 2026
