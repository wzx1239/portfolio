// The persistent global Trace layer supplies the loading UI. This boundary only
// signals that destination content has not committed yet.
export default function Loading() { return <main id="main" data-route-pending="true" aria-busy="true" />; }
