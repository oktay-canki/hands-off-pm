export default function ThreatModelPage() {
  return (
    <>
      <h1>Threat Model</h1>

      <p>
        The application is designed around a local-first security model. Vault
        data is stored locally in encrypted form, and cryptographic keys are
        derived and used on the user&apos;s device rather than being sent to a
        central service.
      </p>

      <p>
        This threat model describes the environments the application is designed
        to protect against, the environments it does not attempt to secure, and
        the trust boundaries that remain outside the application&apos;s control.
      </p>

      <h2>What It Protects Against</h2>

      <ul>
        <li>
          <strong>Centralized server compromise</strong> — The application does
          not use a central backend to store vault data. There is therefore no
          central vault database containing users&apos; plaintext or encrypted
          vaults.
        </li>

        <li>
          <strong>Network exposure of vault data</strong> — The normal vault
          workflow does not transmit the unlocked vault or its cryptographic
          keys over the network. The vault remains in the local browser
          environment.
        </li>

        <li>
          <strong>Compromise of persistent storage</strong> — Vault data
          persisted in IndexedDB is encrypted rather than stored as plaintext.
          Access to the stored ciphertext alone does not provide direct access
          to the vault contents without the required cryptographic keys.
        </li>

        <li>
          <strong>Unauthorized access to exported ciphertext</strong> — Exported
          backups are encrypted and protected by a separate export password.
          Possession of the backup file alone does not provide the plaintext
          vault.
        </li>
      </ul>

      <h2>What It Does Not Protect Against</h2>

      <ul>
        <li>
          <strong>Compromised devices</strong> — Malware, remote-access
          software, or other malicious software running on the device can
          potentially observe secrets while the vault is unlocked. Encryption at
          rest cannot protect data that is already available to the application.
        </li>

        <li>
          <strong>Keyloggers and input capture</strong> — If malicious software
          captures the master password or other sensitive input while it is
          entered, the application&apos;s encryption mechanisms cannot prevent
          that compromise.
        </li>

        <li>
          <strong>Malicious browser extensions</strong> — Browser extensions
          with sufficiently broad permissions may be able to observe browser
          activity or application data. The application relies on the
          browser&apos;s extension and origin isolation mechanisms.
        </li>

        <li>
          <strong>Compromised application code</strong> — A maliciously modified
          application can change the behavior of the client before the vault is
          unlocked. Client-side cryptography cannot guarantee application
          integrity if the code executing the cryptographic operations has
          already been compromised.
        </li>

        <li>
          <strong>Compromised self-hosting infrastructure</strong> — When the
          application is self-hosted, the hosting environment can control the
          application code delivered to clients. A modified application could
          behave differently from the source code that was reviewed.
        </li>

        <li>
          <strong>Loss of local storage</strong> — Encryption does not provide
          recovery from deleted or inaccessible browser storage. Independent
          encrypted backups are required for recovery from storage loss.
        </li>
      </ul>

      <h2>Trust Boundaries</h2>

      <ol>
        <li>
          <strong>
            The application does not require a trusted vault server.
          </strong>{' '}
          Vault data and derived cryptographic keys are handled locally rather
          than being entrusted to a central service.
        </li>

        <li>
          <strong>The browser is a security boundary. </strong> The application
          relies on the browser&apos;s origin isolation, storage isolation, and
          execution environment to protect its local data from unrelated web
          applications.
        </li>

        <li>
          <strong>The device is trusted.</strong> The model assumes that the
          device and its operating system are not already compromised by malware
          capable of observing application memory, input, or execution.
        </li>

        <li>
          <strong>The application code is trusted.</strong> The cryptographic
          design assumes that the code delivered to the browser has not been
          maliciously modified. This becomes particularly important when the
          application is self-hosted.
        </li>

        <li>
          <strong>Exported backups become additional trust boundaries.</strong>{' '}
          A backup file is an additional copy of encrypted vault data. Its
          security therefore depends not only on the application but also on how
          the exported file and its export password are stored and protected.
        </li>

        <li>
          <strong>
            The user controls the master password and backup passwords.
          </strong>{' '}
          The application cannot recover a forgotten password or compensate for
          a password that has been disclosed to an attacker.
        </li>
      </ol>

      <h2>Local Network &amp; Self-Hosting</h2>

      <p>
        The application can be served from a local or self-hosted environment
        without turning that environment into a vault storage server. Each
        browser instance maintains its own local vault.
      </p>

      <p>
        However, self-hosting introduces an application-integrity dependency:
        devices must trust the host to deliver the expected application code. A
        compromised host could serve modified JavaScript even if the vault data
        itself remains stored locally and encrypted.
      </p>

      <h2>Security Model Summary</h2>

      <p>
        The central security assumption is that an attacker who obtains only the
        encrypted data should not automatically obtain the plaintext vault. The
        model does not attempt to defend against an attacker who already
        controls the device, can modify the application code delivered to the
        user, or can observe secrets while the vault is unlocked.
      </p>
    </>
  );
}
