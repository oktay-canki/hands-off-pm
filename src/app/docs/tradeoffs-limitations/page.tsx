export default function TradeoffsLimitationsPage() {
  return (
    <>
      <h1 className="mb-12">Trade-offs & Limitations</h1>

      <div className="mb-18">
        <h2 className="mb-4">No Master-Password Recovery</h2>
        <p className="mb-2">
          There is no &quot;forgot password&quot; option. If you lose your
          master password, your vault is unrecoverable. This isn&apos;t an
          oversight; it&apos;s a direct consequence of the design.
        </p>
        <p>
          Any recovery mechanism requires someone to be able to bypass or reset
          the thing protecting your data. In a system where a server holds your
          data, that&apos;s usually solved by trusting the vendor to verify your
          identity and grant access another way. But this app has no server, no
          account system, and no side channel into your vault — the master
          password isn&apos;t a login credential, it&apos;s the only input that
          derives the key capable of decrypting your data. There&apos;s no
          backend to appeal to, because there&apos;s nothing on a backend to
          reset.
        </p>
      </div>

      <div className="mb-18">
        <h2 className="mb-4">No Deleted-Entry Recovery</h2>
        <p className="mb-2">
          Deleting an entry is permanent. When you delete an entry, its
          encrypted content is fully removed from the vault — not archived, not
          soft-deleted, not recoverable from within the app. What remains is a
          tombstone: a marker recording that an entry with a given ID was
          deleted, containing no actual entry data. There&apos;s no
          &quot;trash&quot; to restore from, because there&apos;s nothing left
          to restore.
        </p>
        <p className="mb-2">
          The tombstone exists for one reason: to prevent silent resurrection
          during future import. Once export/import is implemented, syncing an
          older version of the vault (one that still contains an entry
          you&apos;ve since deleted) could otherwise bring that entry back
          without you ever choosing to. The tombstone tells the vault &quot;this
          entry was intentionally removed,&quot; so a stale copy doesn&apos;t
          get treated as new data during a merge.
        </p>
        <p>
          That said, the tombstone is a guard, not a lock. If you import an
          older or different origin vault file that still has the entry&apos;s
          actual (encrypted) content on it — say, an old backup — nothing stops
          you from choosing to bring that entry back. That&apos;s a deliberate
          choice too: the app won&apos;t resurrect deleted entries on its own,
          but it also won&apos;t stop you from restoring old data yourself if
          you have it and want it. Recovery, if it ever happens, is something
          you do — not something that happens to you.
        </p>
      </div>

      <div className="mb-18 scroll-mt-20" id="tab-scoped-unlocked-state">
        <h2 className="mb-4">Tab-Scoped Unlocked State</h2>
        <p className="mb-2">
          Unlocking the vault is scoped to a single browser tab, not the browser
          session as a whole. <code className="mx-1">VaultProvider</code>{' '}
          creates one
          <code className="mx-1">VaultService</code> instance via{' '}
          <code className="mx-1">useMemo</code>, tied to the lifetime of that
          React tree. On unlock, <code className="mx-1">VaultService</code>{' '}
          spins up a dedicated Web Worker — wrapped via Comlink — and all
          decryption, encryption, and vault-mutation operations run inside it.
          The decrypted key material lives only in that worker&apos;s memory,
          referenced only by that one <code className="mx-1">VaultService</code>{' '}
          instance.
        </p>
        <p>
          A practical consequence: refreshing the tab discards the entire
          <code className="mx-1">VaultProvider</code> tree, which discards the
          <code className="mx-1">VaultService</code>
          instance, which discards the worker. There&apos;s no unlocked state to
          resume — the vault has to be unlocked again from scratch. This
          isn&apos;t an oversight in the lifecycle; it&apos;s what happens when
          decrypted state is deliberately kept out of anything that could
          survive a reload (no persisted session token, no cached key in
          storage) — only in memory, only for as long as that tab&apos;s React
          tree is alive.
        </p>
      </div>

      <div className="mb-18">
        <h2 className="mb-4">JavaScript Memory Handling</h2>
        <p className="mb-2">
          <code className="mx-1">lock()</code> clears the vault&apos;s unlocked
          state by releasing the worker proxy, terminating the worker, and
          nulling out references to cached entries and key material.
        </p>
        <p className="mb-2">
          Terminating the worker discards its entire memory space — this is the
          strongest guarantee available here, since a terminated worker&apos;s
          memory isn&apos;t just dereferenced, its execution context and
          associated memory become inaccessible and are scheduled for
          reclamation by the runtime. But within the main thread (and while a
          worker is alive), nulling a reference only makes a value eligible for
          garbage collection — it doesn&apos;t guarantee immediate erasure.
        </p>
        <p className="mb-2">
          JavaScript provides no API to zero out a variable&apos;s memory on
          demand, unlike lower-level languages where you can explicitly
          overwrite a buffer the moment you&apos;re done with it. Between
          &quot;reference cleared&quot; and &quot;garbage collector actually
          reclaims that memory,&quot; decrypted data may still exist in memory
          for an unpredictable, engine-dependent amount of time.
        </p>
        <p className="mb-2">
          In practice, this means: worker termination is relied upon as the
          primary boundary for clearing key material and decrypted state,
          precisely because it&apos;s the one mechanism here that isn&apos;t
          dependent on garbage-collection timing. Values that briefly exist on
          the main thread (e.g., decrypted entries passed back from the worker
          via Comlink) are subject to normal JS garbage collection and
          aren&apos;t actively zeroed.
        </p>
        <p>
          This is a known limitation of doing cryptography in JavaScript
          generally, not something specific to a design mistake here — no
          mainstream JS engine currently offers guaranteed, on-demand memory
          zeroing. Runtimes like libsodium&apos;s native (non-WASM) bindings in
          other languages can sometimes zero memory explicitly (
          <code className="mx-1">sodium_memzero</code>); in a browser/JS
          context, that guarantee isn&apos;t available. If this becomes a
          priority later, sensitive values could be held as{' '}
          <code className="mx-1">Uint8Arrays</code> and manually overwritten
          before dereferencing (which reduces, but doesn&apos;t eliminate, the
          exposure window) — but no JS-based approach can fully match the
          guarantees of memory-safe languages with manual memory control.
        </p>
      </div>

      <div className="mb-18">
        <h3 className="mb-2">
          A related wrinkle: message-passing copies data, it doesn&apos;t move
          it
        </h3>
        <p className="mb-2">
          Comlink communicates with the worker via{' '}
          <code className="mx-1">postMessage</code>, which uses the structured
          clone algorithm to serialize data across the thread boundary. Each
          call that sends or receives entry data — for example,{' '}
          <code className="mx-1">getEntries()</code> returning decrypted entries
          from the worker back to the main thread — creates a new copy of that
          data on the receiving side, distinct from whatever the worker held
          internally. This means decrypted entries may briefly exist in more
          than one place in memory simultaneously: inside the worker, and again
          on the main thread as <code className="mx-1">cachedEntries</code>.
        </p>
        <p>
          Terminating the worker clears its copy. But any copies already cloned
          onto the main thread (or held in variables like
          <code className="mx-1">cachedEntries</code>) are subject to the same
          GC-timing limitations described above, and worker termination does
          nothing to accelerate their collection. Every{' '}
          <code className="mx-1">postMessage</code>
          round-trip is a potential additional site where decrypted data
          momentarily exists, not just the two obvious endpoints (worker memory
          and app state).
        </p>
      </div>

      <div className="mb-4">
        <h3 className="mb-2">
          A known limitation: multiple tabs don&apos;t coordinate
        </h3>
        <p className="mb-2">
          Because <code className="mx-1">VaultProvider</code> creates a fresh
          <code className="mx-1">VaultService</code> (and fresh worker) per tab,
          opening the vault in two tabs means two fully independent unlocked
          sessions, each with its own in-memory copy of the vault and its own
          mutation queue. They share nothing and don&apos;t know about each
          other&apos;s writes. Editing an entry in one tab leaves the other
          tab&apos;s cached state unaware until it&apos;s reloaded and
          re-unlocked.
        </p>
        <p>
          Within a single tab, operations are serialized — every add, update,
          and delete is run through a mutation queue, so writes within that tab
          happen in order and each <code className="mx-1">persistVault()</code>
          call reflects the latest local state. But that guarantee stops at the
          tab boundary. Across tabs, two independently-queued sequences of
          writes can race: both tabs persist full vault snapshots based on their
          own last-known state, so the tab that persists last silently
          overwrites whatever the other tab wrote. This is a genuine current
          limitation, not a hidden one — using multiple tabs concurrently for
          the same vault isn&apos;t recommended until cross-tab coordination
          exists.
        </p>
      </div>

      <div>
        <h3 className="mb-2">Why not fix this now</h3>
        <p>
          Cross-tab coordination (e.g., via BroadcastChannel, a shared worker,
          or lock-based writes) is solvable, but it adds real complexity —
          particularly around merge/conflict handling when two tabs disagree
          about current state. At this stage, single-tab-at-a-time usage is an
          accepted tradeoff, and cross-tab sync is a candidate for future
          improvement.
        </p>
      </div>
    </>
  );
}
