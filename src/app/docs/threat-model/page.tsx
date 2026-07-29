export default function ThreatModelPage() {
  return (
    <>
      <h1 className="mb-12">Threat Model</h1>

      <div className="mb-18">
        <h2 className="mb-4">What it protects against</h2>

        <ul>
          <li>
            <strong>Server compromise </strong> — There is no server. Your vault
            never leaves your device.
          </li>
          <li>
            <strong>Network sniffing / man-in-the-middle </strong> — Your vault
            itself is never transmitted over the network. Even if hosted on a
            local network for use across multiple devices, only the (empty) app
            shell is served — each device&apos;s vault stays local to that
            device.
          </li>
          <li>
            <strong>Database leaks </strong> — Your vault is encrypted with
            ChaCha20-Poly1305, with keys derived via Argon2id, and stored
            locally in each device. There&apos;s no central database to leak —
            each device holds its own encrypted copy, and none of it is
            meaningful without your master password.
          </li>
        </ul>
      </div>

      <div className="mb-18">
        <h2 className="mb-4">What it explicitly does not protect against</h2>
        <ul>
          <li>
            <strong>A compromised device </strong> — If your device is already
            compromised (malware, remote access tools, etc.), no password
            manager — local or cloud — can fully protect you. Local storage
            reduces your attack surface, it doesn&apos;t eliminate it.
          </li>
          <li>
            <strong>Keyloggers </strong> — If your master password is captured
            as you type it, encryption at rest doesn&apos;t help. This is a
            client-security problem, not something this app is designed to
            solve.
          </li>
          <li>
            <strong>Malicious or compromised browser extensions </strong> —
            Since the vault lives in the browser (IndexedDB), any extension with
            sufficient permissions to read page data or storage could
            potentially access decrypted data while the app is unlocked and in
            use.
          </li>
          <li>
            <strong>A compromised host</strong> , if self-hosting on your
            network — If you host the page yourself for use across multiple
            devices, you&apos;re trusting whoever controls that hosting
            environment (yourself, presumably, but worth stating) to serve the
            unmodified app. A tampered page could behave differently than the
            source you reviewed.
          </li>
        </ul>
      </div>
      <div className="mb-18">
        <h2 className="mb-4">Trust boundaries</h2>
        <ul className="list-decimal">
          <li>
            <strong>Everything security-relevant happens locally</strong> —
            there is no server, company, or third party in the loop to trust or
            distrust.
          </li>
          <li>
            <strong>You trust the browser sandbox</strong>. Since the vault
            lives in IndexedDB, your security depends on the browser&apos;s
            isolation model holding up, and on no malicious extension having
            elevated storage/page access.
          </li>
          <li>
            <strong>
              If self-hosting across devices, you trust the hosting environment
            </strong>
            . Each device still stores its own vault independently
            (device-isolated by design), but all devices are loading the same
            served page — so the integrity of that host matters.
          </li>
          <li>
            <strong>You trust your own operational hygiene </strong> — device
            security, avoiding malware, and choosing a strong master password
            all remain entirely your responsibility, as they would with any
            password manager, local or cloud-based.
          </li>
        </ul>
      </div>
    </>
  );
}
