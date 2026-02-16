#!/bin/bash

# =============================================================================
# NPM Security Scanner for Crimson Frontend
# =============================================================================
# This script performs comprehensive security scanning on the project
# Run this BEFORE deploying to production

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔒 Starting Security Scan for Crimson Frontend"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES_FOUND=0

# =============================================================================
# 1. Check if pnpm is installed
# =============================================================================
echo "📦 Checking package manager..."
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm installed${NC}"
echo ""

# =============================================================================
# 2. Run npm audit (comprehensive vulnerability check)
# =============================================================================
echo "🔍 Running npm audit..."
AUDIT_OUTPUT=$(npm audit --json 2>&1 || true)
AUDIT_RESULT=$?

if [ $AUDIT_RESULT -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Vulnerabilities found!${NC}"

    # Extract vulnerability counts
    CRITICAL=$(echo "$AUDIT_OUTPUT" | grep -o '"critical":[0-9]*' | cut -d':' -f2 || echo "0")
    HIGH=$(echo "$AUDIT_OUTPUT" | grep -o '"high":[0-9]*' | cut -d':' -f2 || echo "0")
    MODERATE=$(echo "$AUDIT_OUTPUT" | grep -o '"moderate":[0-9]*' | cut -d':' -f2 || echo "0")
    LOW=$(echo "$AUDIT_OUTPUT" | grep -o '"low":[0-9]*' | cut -d':' -f2 || echo "0")

    echo "  Critical: $CRITICAL"
    echo "  High: $HIGH"
    echo "  Moderate: $MODERATE"
    echo "  Low: $LOW"

    if [ "$CRITICAL" != "0" ] || [ "$HIGH" != "0" ]; then
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        echo -e "${RED}❌ CRITICAL or HIGH vulnerabilities detected!${NC}"
    fi

    # Save full audit report
    npm audit --json > security-audit-report.json 2>&1 || true
    echo "  Full report saved to: security-audit-report.json"
else
    echo -e "${GREEN}✅ No vulnerabilities found${NC}"
fi
echo ""

# =============================================================================
# 3. Check for known malicious packages
# =============================================================================
echo "🦠 Checking for known malicious packages..."
MALICIOUS_PACKAGES=(
    "node-ipc"
    "peacenotwar"
    "event-stream@3.3.6"
    "flatmap-stream"
    "eslint-scope@3.7.2"
    "getcookies"
)

MALICIOUS_FOUND=0
for pkg in "${MALICIOUS_PACKAGES[@]}"; do
    if grep -q "\"$pkg\"" package.json pnpm-lock.yaml 2>/dev/null; then
        echo -e "${RED}  ❌ MALICIOUS PACKAGE DETECTED: $pkg${NC}"
        MALICIOUS_FOUND=$((MALICIOUS_FOUND + 1))
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
done

if [ $MALICIOUS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No known malicious packages found${NC}"
fi
echo ""

# =============================================================================
# 4. Check for typosquatting
# =============================================================================
echo "🎯 Checking for typosquatting attacks..."
TYPOSQUAT_CHECK=(
    "requset:request"
    "expresss:express"
    "mongose:mongoose"
    "reacct:react"
    "lodas:lodash"
    "axios-proxy:axios"
)

TYPOSQUAT_FOUND=0
for check in "${TYPOSQUAT_CHECK[@]}"; do
    BAD_PKG=$(echo $check | cut -d':' -f1)
    if grep -q "\"$BAD_PKG\"" package.json 2>/dev/null; then
        GOOD_PKG=$(echo $check | cut -d':' -f2)
        echo -e "${RED}  ❌ TYPOSQUATTING: Found '$BAD_PKG' (should be '$GOOD_PKG')${NC}"
        TYPOSQUAT_FOUND=$((TYPOSQUAT_FOUND + 1))
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
done

if [ $TYPOSQUAT_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No typosquatting detected${NC}"
fi
echo ""

# =============================================================================
# 5. Check for suspicious install scripts
# =============================================================================
echo "📜 Checking for suspicious install scripts..."
if grep -rn "postinstall\|preinstall" package.json 2>/dev/null | grep -v "napi-postinstall"; then
    echo -e "${YELLOW}⚠️  Custom install scripts found - review manually${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo -e "${GREEN}✅ No suspicious install scripts${NC}"
fi
echo ""

# =============================================================================
# 6. Check package.json for security best practices
# =============================================================================
echo "📋 Checking package.json security..."

# Check for exact versions (no ^  or ~)
CARET_COUNT=$(grep -o '\^' package.json | wc -l)
if [ "$CARET_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}  ⚠️  Found $CARET_COUNT packages with '^' (allows minor updates)${NC}"
    echo "     Consider pinning exact versions for production"
fi

# Check for outdated Next.js
NEXTJS_VERSION=$(grep '"next"' package.json | grep -o '[0-9.]*' | head -1)
echo "  Next.js version: $NEXTJS_VERSION"

# Check for private: true
if ! grep -q '"private": true' package.json; then
    echo -e "${YELLOW}  ⚠️  'private: true' not set - could accidentally publish to npm${NC}"
fi

echo ""

# =============================================================================
# 7. Check for environment variable leaks
# =============================================================================
echo "🔑 Checking for exposed secrets..."
SECRET_PATTERNS=(
    "password"
    "secret"
    "api_key"
    "apikey"
    "token"
    "private_key"
)

SECRETS_FOUND=0
for pattern in "${SECRET_PATTERNS[@]}"; do
    if grep -ri "$pattern.*=" .env 2>/dev/null | grep -v ".example" | grep -v ".backup"; then
        echo -e "${RED}  ❌ Potential secret found in .env${NC}"
        SECRETS_FOUND=$((SECRETS_FOUND + 1))
    fi
done

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No exposed secrets detected${NC}"
fi
echo ""

# =============================================================================
# 8. Generate security report
# =============================================================================
echo "📊 Generating Security Report..."
REPORT_FILE="SECURITY_SCAN_REPORT_$(date +%Y%m%d_%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# Security Scan Report
**Date:** $(date)
**Project:** Crimson Frontend

## Summary
- Issues Found: $ISSUES_FOUND
- Status: $([ $ISSUES_FOUND -eq 0 ] && echo "✅ PASS" || echo "❌ FAIL")

## Vulnerability Scan
$(npm audit --production 2>&1 || echo "No audit data")

## Known Malicious Packages
$([ $MALICIOUS_FOUND -eq 0 ] && echo "✅ None detected" || echo "❌ $MALICIOUS_FOUND detected - see above")

## Typosquatting Check
$([ $TYPOSQUAT_FOUND -eq 0 ] && echo "✅ None detected" || echo "❌ $TYPOSQUAT_FOUND detected - see above")

## Dependencies
\`\`\`
$(cat package.json | grep -A 100 '"dependencies"')
\`\`\`

## Recommendations
EOF

# Add recommendations based on findings
if [ $ISSUES_FOUND -gt 0 ]; then
    cat >> "$REPORT_FILE" << EOF

### CRITICAL ACTIONS REQUIRED:
1. Run \`npm audit fix --force\` to auto-fix vulnerabilities
2. Review and remove any malicious packages detected
3. Update dependencies to latest secure versions
4. Rebuild Docker images without cache
5. Re-deploy to production

### Commands to fix:
\`\`\`bash
# Fix vulnerabilities
npm audit fix --force

# Or if using pnpm:
pnpm audit --fix

# Rebuild Docker
docker compose build --no-cache
\`\`\`
EOF
else
    cat >> "$REPORT_FILE" << EOF

### Status: All Clear ✅
No security issues detected. Project is safe to deploy.

### Recommended Maintenance:
1. Run security scans weekly
2. Keep dependencies updated
3. Monitor npm security advisories
4. Use \`pnpm audit\` before each deploy
EOF
fi

echo "  Report saved to: $REPORT_FILE"
echo ""

# =============================================================================
# 9. Final Summary
# =============================================================================
echo "=============================================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ Security Scan PASSED${NC}"
    echo "   No critical issues found. Safe to proceed with deployment."
    exit 0
else
    echo -e "${RED}❌ Security Scan FAILED${NC}"
    echo "   Found $ISSUES_FOUND issue(s) that require attention."
    echo "   Review the report: $REPORT_FILE"
    echo ""
    echo "🛠️  To fix vulnerabilities automatically, run:"
    echo "   npm audit fix --force"
    echo ""
    exit 1
fi
