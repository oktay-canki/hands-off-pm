export default function OverviewPage() {
  return (
    <>
      <aside className="docs-notice" aria-label="Project status">
        <strong>Important</strong>
        <p>
          This is an actively developed personal project, not a production
          password manager. It has not undergone a formal security review. Do
          not use it to store real high-stakes credentials. Feedback and issue
          reports are welcome.
        </p>
      </aside>

      <h1>Overview</h1>

      <section>
        <h2>Motivation</h2>
        <p>
          HandsoffPM is a browser-based password manager designed around local
          storage and self-hosting. The goal is to keep vault data under the
          user&apos;s control rather than relying on a centralized password
          manager service.
        </p>
      </section>

      <section>
        <h3>The Problem with Trust</h3>
        <p>
          Using a password manager requires trusting several parts of its
          infrastructure. Hosted services introduce additional trust in their
          servers, network infrastructure, application code, and operational
          practices. Even services designed around zero-knowledge encryption
          still require trusting the provider&apos;s implementation and
          infrastructure.
        </p>
        <p>
          HandsoffPM takes a different approach: the vault is designed to be
          encrypted locally, with cryptographic operations performed in the
          application rather than delegated to a centralized vault service.
        </p>
      </section>

      <section>
        <h2>Hosting</h2>
        <p>
          HandsoffPM is designed to be self-hosted. You can run your own copy on
          a device or make it available on a local network. The current project
          requires building and deploying the application yourself; there is no
          Docker image, installer, or packaged desktop application yet.
        </p>
        <p>
          These deployment options may be added in the future, but they are not
          part of the current implementation.
        </p>
      </section>
    </>
  );
}
