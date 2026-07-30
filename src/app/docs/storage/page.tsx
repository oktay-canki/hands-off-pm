export default function StoragePage() {
  return (
    <>
      <h1 className="mb-12">Storage</h1>

      <div className="mb-14">
        <h2 className="mb-4">Storage Persistence & Data Loss</h2>
        <p className="mb-2">
          The vault is stored locally in IndexedDB. On load, the app requests
          persistent storage via{' '}
          <code className="mx-1">navigator.storage.persist()</code>. Once
          granted, this exempts the vault&apos;s storage from automatic eviction
          under disk-pressure — the browser&apos;s mechanism for silently
          clearing &quot;best-effort&quot; storage when the device is low on
          space. This removes the main risk of data disappearing without any
          user action being involved.
        </p>
        <p>
          This does not mean the data is indestructible. Persistent storage
          protects against automatic, disk-pressure-driven eviction — it does
          not, and cannot, protect against deliberate clearing of site data. No
          browser storage API (IndexedDB, OPFS, or otherwise) is exempt from
          this, because it&apos;s an intentional browser capability, not a bug
          or an edge case.
        </p>
      </div>

      <div className="mb-18">
        <h3 className="mb-2">Data will be permanently lost if:</h3>
        <ul className="list-disc">
          <li>
            You manually clear browsing data / site data for this app (via
            browser settings or dev tools)
          </li>
          <li>
            You use the app in a private/incognito window — data is wiped when
            that window&apos;s session ends
          </li>
          <li>
            On Safari specifically, the site isn&apos;t visited for an extended
            period (Safari&apos;s Intelligent Tracking Prevention can clear
            storage for inactive origins, independent of persistent storage
            requests)
          </li>
          <li>
            You switch browsers, devices, or OS user profiles — storage is
            scoped per browser, per profile, per origin, so none of these share
            the same vault
          </li>
          <li>You uninstall or reset the browser or device</li>
        </ul>
      </div>

      <div>
        <h3 className="mb-2">
          Why this isn&apos;t &quot;fixed&quot; at the storage layer
        </h3>
        <p className="mb-4">
          There is no way to build around user-initiated or
          browser-policy-driven data clearing from inside the browser&apos;s
          storage APIs — persistent storage solves a different problem
          (accidental eviction), not this one. The only real mitigation is
          getting a copy of your vault outside the browser&apos;s storage
          entirely: a file you export and keep somewhere you control (a backup
          drive, a password-protected archive, cloud storage of your choosing).
        </p>
        <p className="mb-4">
          Export/import is planned but not yet implemented. Once available, it
          will be manual and opt-in — the app will not automatically write files
          to your disk without your action, since silent, unprompted file writes
          trade one class of surprise (lost data) for another (unexpected files,
          unclear versioning, silent failures).
        </p>
        <p>
          <strong>Bottom line</strong>: persistent storage reduces the chance of
          losing your vault to something outside your control. It does not
          replace the need to back up your data yourself, especially before
          doing anything that clears browser storage.
        </p>
      </div>
    </>
  );
}
