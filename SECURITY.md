# Security Policy

## ⚠️ Security Status

This project is a personal project and **has not been professionally audited**.

While care has been taken to design and implement the application securely, **no guarantees are made regarding its security**. Use at your own risk.

---

## 🔐 Security Model

This application is designed as a **browser-based self-hosted password manager**:

- All encryption and decryption occur **in the browser**
- No sensitive data is transmitted to or stored on any server
- The server only serves a static application shell
- Secrets are intended to remain in memory only while the vault is unlocked

---

## 🧠 Threat Model

### Intended protections

This project aims to protect against:

- Unauthorized access to stored credentials without the master password
- Server-side data breaches (no sensitive data is stored server-side)
- Passive network interception of secrets

### Not protected against

This project does **not** protect against:

- Compromised devices (malware, keyloggers, browser extensions)
- Malicious or compromised browsers
- Physical access to an unlocked device
- Memory inspection or advanced runtime attacks
- Supply chain attacks (e.g., tampered dependencies)

---

## ⚠️ Known Trade-offs

- JavaScript environments do not provide guaranteed memory zeroization
- Sensitive data may temporarily exist in memory while the vault is unlocked
- Security depends on browser behavior and runtime isolation

---

## 📢 Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**.

Instead, report it privately via:

- GitHub Issues (mark clearly as "SECURITY" and avoid sensitive details)

Please include:

- A clear description of the issue
- Steps to reproduce (if applicable)
- Potential impact

---

## 🔄 Updates and Fixes

Security fixes will be addressed as time permits. There is no guaranteed response time.

---

## 📄 Disclaimer

This software is provided "as is", without warranty of any kind. The author is not responsible for any damages, data loss, or security breaches resulting from its use.
