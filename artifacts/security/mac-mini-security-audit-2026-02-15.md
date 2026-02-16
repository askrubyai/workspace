# Mac Mini Security Audit - February 15, 2026

**System:** macOS 26.2 (Build 25C56)  
**User:** ruby (admin)  
**Audit Date:** 2026-02-15 01:34 IST  
**Auditor:** Friday (Developer Agent)

## Executive Summary

**Overall Security Posture:** MODERATE RISK  
**Critical Issues Found:** 2  
**High Priority Issues:** 1  
**Medium Priority Issues:** 2

### Critical Fixes Applied Immediately:
✅ **Fixed:** Credentials folder permissions (was 755/644, now 700/600)

### Requires User Action (sudo/admin):
⚠️ **FileVault disabled** - Disk encryption is OFF (HIGH RISK)  
⚠️ **Firewall status unknown** - Cannot verify without sudo access  

---

## Detailed Findings

### 1. ✅ SSH Key Security (PASS)
**Status:** SECURE

```
Private keys: 600 permissions ✅
Public keys: 644 permissions ✅
.ssh directory: 700 permissions ✅
```

**Files checked:**
- `~/.ssh/id_ed25519_github` (private key, 600) ✅
- `~/.ssh/id_ed25519_github.pub` (public key, 644) ✅
- `~/.ssh/config` (644) ✅

**Recommendation:** No action needed.

---

### 2. ✅ FIXED: Credentials Folder Security
**Status:** VULNERABLE → FIXED

**Before:**
```
~/.credentials/: 755 (world-readable) ❌
gog-client-secret.json: 644 (world-readable) ❌
ngrok-token: 644 (world-readable) ❌
```

**After:**
```
~/.credentials/: 700 (owner-only) ✅
All credential files: 600 (owner-only) ✅
```

**Action Taken:** Hardened permissions with `chmod 700 ~/.credentials && chmod 600 ~/.credentials/*`

**Impact:** API keys, OAuth secrets, and ngrok tokens were previously readable by all users on the system. Now properly protected.

---

### 3. ⚠️ FileVault Encryption (CRITICAL - REQUIRES ACTION)
**Status:** DISABLED

```bash
$ fdesetup status
FileVault is Off.
```

**Risk:** If the Mac Mini is physically stolen or accessed, all data (including credentials, SSH keys, git repos) is accessible without password.

**Recommendation:** ENABLE IMMEDIATELY  
**How:**
1. System Settings → Privacy & Security → FileVault
2. Click "Turn On FileVault"
3. Save recovery key securely (iCloud or print and store safely)
4. Restart to begin encryption

**Note:** Encryption happens in background, won't block work. Requires admin password.

---

### 4. ⚠️ Firewall Status (UNKNOWN - REQUIRES SUDO)
**Status:** CANNOT VERIFY

```bash
$ sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
sudo: a password is required
```

**Risk:** If firewall is disabled, all local services (Mission Control API on port 5175, UI on 5174) are potentially accessible from network.

**Recommendation:** VERIFY AND ENABLE  
**How:**
```bash
# Check status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Enable if off
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Enable stealth mode (don't respond to pings)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on
```

**Expected Result:** Firewall should be ON with stealth mode enabled.

---

### 5. ✅ User Account Security (PASS)
**Status:** SECURE

**Users on system:**
```
daemon (system)
nobody (system)
root (system)
ruby (admin, owner)
```

**Currently logged in:**
```
ruby (console + 4 terminal sessions)
```

**Recommendation:** No action needed. No unauthorized users found.

---

### 6. ✅ Running Services (LOW RISK)
**Status:** ACCEPTABLE

**pm2 managed services:**
```
mission-control-api (port 5175, localhost-bound)
mission-control-ui (port 5174, localhost-bound)
```

**Risk Assessment:** Both services bind to localhost only (not exposed to network). Minimal risk.

**Recommendation:** No action needed. If ngrok tunnel is running, verify it's using authentication.

---

### 7. 🔍 Git Configuration (UNKNOWN)
**Status:** COULD NOT AUDIT FULLY

Could not retrieve global git config to check for exposed tokens/credentials.

**Recommendation:** Manual check
```bash
# Check for exposed secrets
git config --global --list | grep -i "token\|password\|secret"

# If any found, remove them
git config --global --unset <key>
```

**Best Practice:** Never store credentials in git config. Use credential helpers or environment variables.

---

### 8. 🔍 System Updates (CANNOT VERIFY)
**Status:** UNKNOWN

`softwareupdate` command not available on this system.

**Recommendation:** Manual check via System Settings
1. System Settings → General → Software Update
2. Install any pending security updates
3. Enable automatic security updates

---

### 9. 🔍 Sharing Services (CANNOT AUDIT - REQUIRES SUDO)
**Status:** UNKNOWN

Cannot check System Preferences → Sharing services without GUI or sudo access.

**Recommendation:** Manual audit
1. System Settings → General → Sharing
2. Disable all services unless actively needed:
   - ❌ File Sharing (off unless sharing files)
   - ❌ Screen Sharing (off unless remote desktop needed)
   - ❌ Remote Login (SSH - off unless explicitly needed)
   - ❌ Remote Management (off)
   - ❌ Media Sharing (off)

**Only enable what's actively used.**

---

## Priority Action Items

### Immediate (Do Now)
1. ✅ **DONE:** Fixed credentials folder permissions
2. ⚠️ **REQUIRES ADMIN:** Enable FileVault encryption
3. ⚠️ **REQUIRES ADMIN:** Verify/enable macOS firewall

### High Priority (This Week)
4. Manual audit of System Sharing services
5. Check for system updates and enable auto-update
6. Verify no secrets in git global config

### Medium Priority (This Month)
7. Review app permissions (System Settings → Privacy & Security)
8. Set up Time Machine or other backup solution (if not already)
9. Enable "Find My Mac" for theft recovery

---

## Security Score

| Category | Score | Notes |
|----------|-------|-------|
| Encryption | 🔴 1/5 | FileVault disabled (critical) |
| Access Control | 🟡 3/5 | Good user mgmt, unknown firewall |
| Credentials | 🟢 5/5 | Now properly secured |
| Network | 🟡 3/5 | Localhost services only, firewall unknown |
| Updates | ⚪ ?/5 | Cannot verify |
| Overall | 🟡 3/5 | MODERATE RISK |

---

## Long-term Recommendations

1. **Password Manager:** Use 1Password/Bitwarden for credential management (better than ~/.credentials files)
2. **2FA Everywhere:** Enable two-factor auth on critical accounts (GitHub, Google, etc.)
3. **Regular Audits:** Run security audit every 3 months
4. **Backup Strategy:** Automate backups (Time Machine or cloud solution)
5. **VPN for Public WiFi:** Consider Tailscale or WireGuard for secure remote access

---

## Conclusion

**Immediate risk mitigated:** Credentials are now properly protected (700/600 permissions).

**Critical remaining risk:** FileVault encryption is disabled. This should be enabled ASAP to protect against physical theft.

**Next steps:**
1. Reuben enables FileVault (5 min, requires admin password)
2. Reuben verifies firewall status and enables if needed (2 min)
3. Manual audit of sharing services and system updates (10 min)

**Total time investment:** ~20 minutes to reach GOOD security posture.

---

**Audit completed:** 2026-02-15 01:45 IST  
**Agent:** Friday  
**Quality self-rating:** 4/5 (comprehensive audit, but couldn't verify firewall/updates without sudo)
