# Security Policy

## Security Status

HandsoffPM is an actively developed personal project and has **not undergone a professional security audit or formal security review**.

The project is designed with security as an important consideration, but this does not guarantee that the implementation is secure or free from vulnerabilities.

HandsoffPM should not be used to store high-value, production, or otherwise critical credentials.

## Security Model

HandsoffPM is designed as a browser-based, self-hosted, local-first password manager.

The security model is based on keeping plaintext vault data and encryption keys on the user's device rather than sending them to a centralized password-management service.

The application is designed so that:

- Vault encryption and decryption occur client-side.
- Persistent vault data is encrypted rather than stored as plaintext credentials.
- Encryption keys remain in memory while the vault is unlocked and are cleared when the vault is locked.
- Cryptographic and vault operations are performed in a Web Worker rather than on the main thread.
- Exported backups contain encrypted vault data and require a separate export password.
- Normal vault operation does not require a centralized backend service.

The application does not attempt to eliminate all trust in the browser, operating system, application code, or self-hosting environment.

## Threat Model

### Intended Protections

The project is designed to reduce exposure to:

- Unauthorized access to encrypted vault data without the required encryption keys.
- Exposure of vault plaintext or encryption keys through a centralized password-management server.
- Passive network interception of vault data during normal application use.
- Unauthorized access to exported backup contents without the export password.
- Unintended resurrection of deleted entries during multi-device merging through the use of deletion tombstones.

These protections depend on the application being deployed and executed as intended.

### Out of Scope

The security model does not provide protection against:

- A compromised operating system or device.
- Malware or keyloggers.
- Malicious or compromised browser extensions.
- A compromised or malicious browser runtime.
- Physical access to an unlocked device.
- Runtime or memory inspection by an attacker with sufficient local privileges.
- Compromised application code or deployment infrastructure.
- Supply-chain compromise of the application's dependencies or build environment.
- Loss or deliberate clearing of browser storage.
- Vulnerabilities in the underlying browser, operating system, or cryptographic implementation.

## Known Limitations

### JavaScript Memory

JavaScript environments do not provide reliable guarantees that sensitive data can be completely zeroized from memory.

Sensitive data may therefore remain in memory for some period while the vault is unlocked.

### Web Worker Isolation

Cryptographic and vault operations are performed in a Web Worker to separate them from the main UI thread.

A Web Worker is **not considered a complete security boundary**. Code running within the same application context may still be able to interact with worker messages or otherwise compromise the application.

### Browser Storage

IndexedDB provides local persistence but should not be considered a backup mechanism.

Browser storage can be cleared or lost because of:

- User actions
- Browser settings or policies
- Private or incognito browsing
- Browser profile changes
- Device failure
- Operating-system changes
- Browser or application data removal

Independent encrypted backups should therefore be maintained for important vault data.

### Application Integrity

The security of a browser-based password manager ultimately depends on the integrity of the application code being executed.

A compromised application, hosting environment, dependency, or deployment pipeline could potentially alter the code presented to the user.

### Master-Password Recovery

There is currently no master-password recovery mechanism.

If the master password is lost, the encrypted vault cannot be recovered through the application.

## Vulnerability Reporting

If you discover a potential security vulnerability, please **do not open a public GitHub issue** or disclose sensitive vulnerability details publicly.

Please use GitHub's **private vulnerability reporting** feature to submit the report.

When reporting a vulnerability, please include:

- A clear description of the issue.
- Steps required to reproduce it, if applicable.
- The affected component or functionality.
- Potential security impact.
- Any relevant proof-of-concept material that can be safely shared.

Please do not include real credentials, private vault data, or other sensitive information that is not necessary to demonstrate the issue.

I will investigate security reports and address confirmed issues as time permits. There is no guaranteed response time or service-level agreement.

## Security Updates

Security-related changes and fixes will be documented through the project's normal development history and release process where appropriate.

## Disclaimer

This software is provided "as is", without warranty of any kind.

I make no guarantees regarding the security, availability, data preservation, or suitability of this software for protecting sensitive information.

HandsoffPM is primarily an educational and personal project. Users are responsible for evaluating whether it is appropriate for their intended use and for maintaining independent encrypted backups of important data.
