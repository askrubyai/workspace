# Mac Mini Security Hardening Plan

**Date:** 2026-02-15 01:34 IST  
**System:** macOS 26.2 (Build 25C56)  
**Agent:** Friday (Developer)

## Objective
Harden Reuben's Mac Mini security posture without impacting daily workflow or development tools.

## Current Status Assessment

### System Information
- **OS Version:** macOS 26.2 (latest as of Feb 2026)
- **Machine:** Mac mini
- **User:** ruby (admin account)

## Security Hardening Checklist

### 1. System Updates ✅ HIGH PRIORITY
- [ ] Verify macOS is fully updated
- [ ] Check for pending security updates
- [ ] Enable automatic security updates

### 2. Firewall Configuration ✅ HIGH PRIORITY
- [ ] Enable macOS firewall
- [ ] Configure application-specific rules
- [ ] Block incoming connections by default
- [ ] Allow only necessary services (SSH if needed, dev servers)

### 3. File Sharing & Remote Services 🔍 MEDIUM PRIORITY
- [ ] Audit enabled services (System Preferences → Sharing)
- [ ] Disable unnecessary: File Sharing, Screen Sharing, Remote Login
- [ ] Keep only what's actively used

### 4. FileVault Encryption ✅ HIGH PRIORITY
- [ ] Verify FileVault is enabled
- [ ] Backup recovery key securely

### 5. User Permissions & Accounts 🔍 MEDIUM PRIORITY
- [ ] Review user accounts (ensure no unknown users)
- [ ] Verify sudo access is limited
- [ ] Check for guest user (should be disabled)

### 6. Security & Privacy Settings ✅ MEDIUM PRIORITY
- [ ] Enable Gatekeeper (app verification)
- [ ] Review location services permissions
- [ ] Audit app permissions (microphone, camera, files)
- [ ] Enable "Find My Mac" (if not already)

### 7. Network Security 🔍 LOW PRIORITY
- [ ] Disable Bluetooth when not needed
- [ ] Review WiFi saved networks (remove unknown)
- [ ] Consider VPN for sensitive work

### 8. Development Environment Security 🔍 MEDIUM PRIORITY
- [ ] Review SSH keys (~/.ssh/) - ensure private keys are protected (600 permissions)
- [ ] Audit credentials in ~/.credentials/ - verify proper permissions (600 or 700)
- [ ] Check for API keys in environment variables or dotfiles
- [ ] Review git config for sensitive data

### 9. Service Hardening 🔍 LOW PRIORITY
- [ ] Review running services: `launchctl list`
- [ ] Disable unnecessary daemons
- [ ] Review pm2 processes for security

### 10. Backup Verification ✅ MEDIUM PRIORITY
- [ ] Verify Time Machine or other backup solution is active
- [ ] Test backup restoration (if time permits)

## Implementation Plan

### Phase 1: Quick Wins (30 minutes)
1. System updates check
2. Enable firewall
3. Verify FileVault
4. Disable unnecessary sharing services

### Phase 2: Permissions Audit (20 minutes)
1. SSH keys permissions
2. Credentials folder permissions
3. Review app permissions
4. User accounts audit

### Phase 3: Service Hardening (30 minutes)
1. Audit running services
2. Disable unnecessary daemons
3. Review network configuration
4. Document findings

## Execution Log

*Execution begins below...*

---

## Safety Notes
- All changes will be documented
- Critical services (OpenClaw, dev servers) will be preserved
- Reuben will be notified of any changes requiring reboot or credentials
