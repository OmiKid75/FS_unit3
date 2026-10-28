import { Link } from "react-router-dom";

const Forbidden = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="text-center max-w-sm">
      <p className="font-display text-6xl font-semibold text-danger mb-2">403</p>
      <h1 className="font-display text-xl font-semibold mb-2">Access Denied</h1>
      <p className="text-sm text-slate-400 mb-6">
        You don't have permission to view this page. If you think this is a mistake, contact your admin.
      </p>
      <Link to="/" className="btn-primary inline-block rounded-lg px-5 py-2.5 text-sm">
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default Forbidden;