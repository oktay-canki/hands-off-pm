export default function OverviewPage() {
  return (
    <>
      <div className="bg-secondary px-6 py-4 rounded-md mb-12">
        <h4 className="mb-2 small-text font-bold">Important</h4>
        <span>
          This is an actively developed personal project, not a real-life
          product. It has not undergone formal security review. Please
          don&apos;t use it to store real high-stakes credentials. Feedback and
          issue reports are welcomed.
        </span>
      </div>
      <h1 className="mb-8">Overview</h1>
      <div className="mb-14">
        <h2 className="mb-4">Motivation</h2>
        <p className="max-w-2xl">
          HandsoffPM is an offline, browser-based password manager designed to
          be self-hosted — you run it, you control it, your data never leaves
          your device.
        </p>
      </div>
      <div className="mb-14">
        <h3 className="mb-2">The Problem with Trust</h3>
        <p>
          Most password managers ask you to trust a server, a third-party audit
          company,
          <br /> or a network connection. Even &quot;zero-knowledge&quot;
          providers route your data through infrastructure you don&apos;t own,
          banking on their servers never being breached and their business never
          changing hands. What I&apos;m building instead is a password manager
          that runs entirely on your local device — one you can audit yourself.
        </p>
      </div>
      <div>
        <h2 className="mb-4">Hosting</h2>
        <p>
          HandsoffPM is designed to be self-hosted — you run your own copy, on
          your own device or network. Right now, that means building and running
          it yourself (or deploying the output on a local network). There&apos;s
          no Docker image, installer, or desktop package yet. If you want a more
          turnkey setup (Docker, a packaged desktop app), that&apos;s a natural
          direction for this project&apos;s future, but it&apos;s not
          implemented today.
        </p>
      </div>
    </>
  );
}
