export default function TradeoffsLimitationsPage() {
  return (
    <>
      <h1>Trade-offs &amp; Limitations</h1>

      <p>
        The security and architecture of zkpm involve deliberate trade-offs.
        Some limitations result directly from the local-first design, while
        others come from the constraints of running cryptographic operations
        inside a browser and JavaScript runtime.
      </p>

      <h2>No Master-Password Recovery</h2>

      <span className="trade-off-pill">Trade-off</span>

      <p>
        There is no &quot;forgot password&quot; mechanism. If the master
        password is lost, the encrypted vault cannot be unlocked through the
        application.
      </p>

      <p>
        The master password is not an account credential used to authenticate
        against a server. It is an input to the key-derivation process that
        produces the cryptographic key material required to decrypt the vault.
        Because the application has no server-side account or recovery channel,
        there is no separate authority that can reset or bypass that
        cryptographic requirement.
      </p>

      <p>
        Encrypted exports provide a recovery mechanism for lost or damaged local
        storage, but they do not remove the requirement for the appropriate
        password needed to decrypt the vault or backup.
      </p>

      <h2>No Deleted-Entry Recovery</h2>

      <span className="trade-off-pill">Trade-off</span>

      <p>
        Deleting an entry removes its encrypted entry data from the vault. There
        is no in-application trash or archive from which the deleted plaintext
        entry can be restored.
      </p>

      <p>
        A tombstone remains after deletion. It records that an item with a
        particular ID was deleted without retaining the deleted entry&apos;s
        contents.
      </p>

      <p>
        Tombstones are important for import and merge operations. Without a
        deletion marker, an older backup containing an item that was
        intentionally deleted could otherwise be interpreted as a new item
        during a later merge.
      </p>

      <p>
        A tombstone does not prevent deliberate restoration from an older
        backup. If an older encrypted backup still contains the deleted item,
        importing that backup can provide the data needed to restore it. The
        application does not automatically resurrect the deleted item, but it
        does not treat previously exported data as permanently invalid either.
      </p>

      <h2 id="tab-scoped-unlocked-state">Tab-Scoped Unlocked State</h2>

      <span className="trade-off-pill">Trade-off</span>

      <p>
        Unlocking the vault is scoped to a single browser tab. Each{' '}
        <code>VaultProvider</code> creates its own <code>VaultService</code>{' '}
        instance, and an unlocked service creates a dedicated Web Worker through
        Comlink.
      </p>

      <p>
        Cryptographic operations and the active unlocked vault state are kept in
        memory rather than persisted for reuse after a reload. Refreshing the
        page therefore destroys the existing React tree and its associated
        worker. The vault must be unlocked again after the refresh.
      </p>

      <p>
        This deliberately avoids persisting an unlocked session or cached
        cryptographic keys merely to make reloads more convenient.
      </p>

      <h2>Web Worker Isolation Is Not a Complete Security Boundary</h2>

      <span className="limitation-pill">Limitation</span>

      <p>
        Vault cryptographic operations run inside a dedicated Web Worker. This
        separates those operations from the main application thread and provides
        useful isolation within the application architecture.
      </p>

      <p>
        However, a Web Worker is not a security boundary against a compromised
        browser or device. The worker and the main application still execute
        within the same browser origin and ultimately depend on the browser and
        operating system for isolation.
      </p>

      <h2>Message-Passing Copies Sensitive Data</h2>

      <span className="limitation-pill">Limitation</span>

      <p>
        Communication between the main thread and the Web Worker uses{' '}
        <code>postMessage </code> {'  '} through Comlink. Data crossing this
        boundary is transferred using the browser&apos;s structured-clone
        mechanisms, which can create another in-memory representation of the
        data on the receiving side.
      </p>

      <p>
        For example, decrypted entries returned by <code>getEntries()</code>{' '}
        {'  '} can exist both inside the worker and in the main thread&apos;s
        application state. Terminating the worker removes its execution context,
        but it does not immediately erase copies that have already been created
        on the main thread.
      </p>

      <p>
        This means the Web Worker reduces the exposure of sensitive operations
        to the main thread, but it does not guarantee that decrypted data exists
        in only one location in memory.
      </p>

      <h2>JavaScript Memory Handling</h2>

      <span className="limitation-pill">Limitation</span>

      <p>
        Locking the vault releases the worker and clears application references
        to unlocked state. Terminating the worker removes its execution context,
        which provides a clear lifecycle boundary for the worker&apos;s state.
      </p>

      <p>
        JavaScript does not provide a general mechanism for reliably and
        immediately erasing arbitrary values from runtime memory. Clearing a
        reference makes an object eligible for garbage collection, but does not
        guarantee when the runtime will reclaim the underlying memory.
      </p>

      <p>
        Consequently, sensitive values that have existed on the main thread may
        remain in memory until they are reclaimed by the JavaScript runtime. The
        application does not claim guaranteed immediate memory erasure after
        every use of decrypted data.
      </p>

      <p>
        Binary data held in mutable buffers can sometimes be overwritten before
        the buffer is released, but this still does not provide a universal
        guarantee because JavaScript runtimes can create additional copies of
        values during normal execution.
      </p>

      <h2>Multiple Tabs Do Not Coordinate</h2>

      <span className="limitation-pill">Limitation</span>

      <p>
        Each browser tab creates an independent <code>VaultProvider</code>,{' '}
        <code>VaultService</code>, and Web Worker. Two tabs therefore have
        separate unlocked states and separate local mutation queues.
      </p>

      <p>
        A change made in one tab is not automatically reflected in another
        already-unlocked tab. The second tab continues operating on its own
        in-memory state until it is reloaded and unlocked again.
      </p>

      <p>
        Within a single tab, vault mutations are serialized through the local
        mutation queue. That ordering guarantee does not extend across tabs.
      </p>

      <p>
        As a result, concurrent writes from multiple tabs can race. Because each
        tab can persist a vault snapshot based on its own last-known state, one
        tab can overwrite changes made by another tab.
      </p>

      <h2>Single-Tab Usage Is Currently Recommended</h2>

      <span className="trade-off-pill">Trade-off</span>

      <p>
        Cross-tab coordination is technically possible through mechanisms such
        as <code>BroadcastChannel</code>, shared workers, or coordination around
        storage writes. Implementing this correctly would introduce additional
        synchronization and conflict-handling complexity.
      </p>

      <p>
        The current design therefore favors predictable single-tab operation
        rather than adding cross-tab synchronization before it is required.
        Cross-tab coordination remains a potential future improvement.
      </p>

      <h2>Local Storage Requires Independent Backups</h2>

      <span className="trade-off-pill">Trade-off</span>

      <p>
        Persistent browser storage reduces the risk of automatic storage
        eviction, but it does not provide an independent recovery copy. Clearing
        browser data, losing the device, or otherwise losing access to the
        browser&apos;s storage can still make the local vault inaccessible.
      </p>

      <p>
        The application therefore provides encrypted vault export as an explicit
        backup mechanism. Backups are intentionally manual and user-controlled
        rather than silently writing copies of the vault to external storage.
      </p>

      <p>
        See <a href="/docs/export-import">Export &amp; Import</a> for the
        backup, import, merge, and conflict-resolution workflow.
      </p>
    </>
  );
}
