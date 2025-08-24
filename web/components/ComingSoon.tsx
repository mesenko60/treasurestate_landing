export default function ComingSoon() {
  return (
    <section id="coming-soon" className="content-section planners-section">
      <h2>Coming Soon: Montana Travel Planners</h2>
      <div className="planners-grid">
        <div className="planner-card">
          <h3>Montana Backroads Travel Planner</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/beaten_path_logo.png" alt="Off the Beaten Path Logo" style={{maxWidth:'202.5px', display:'block', margin:'0 auto 8px auto'}} />
          <p>Not your father's travel planner! This tool is for mapping out true adventures off the beaten path.</p>
          <a className="waitlist-btn" href="https://docs.google.com/forms/d/e/1FAIpQLSdPTdHpiWtYrOk3bB10CoLFFtgtvWZTsZ2BVleAWIveISkDTQ/viewform?usp=pp_url&entry.13122347=Montana+Backroads+Travel+Planner" target="_blank" rel="noopener">NOTIFY ME</a>
        </div>
        <div className="planner-card">
          <h3>Hot Springs in Montana Travel Planner</h3>
          <p>Discover Montana's rejuvenating natural hot springs. Plan your relaxing getaway today.</p>
          <a className="waitlist-btn" href="https://docs.google.com/forms/d/e/1FAIpQLSdPTdHpiWtYrOk3bB10CoLFFtgtvWZTsZ2BVleAWIveISkDTQ/viewform?usp=pp_url&entry.13122347=Hot+Springs+in+Montana+Travel+Planner" target="_blank" rel="noopener">NOTIFY ME</a>
        </div>
        <div className="planner-card">
          <h3>Bitterroot Valley Travel Planner</h3>
          <p>Experience the stunning landscapes and charming towns of the Bitterroot Valley.</p>
          <a className="waitlist-btn" href="https://docs.google.com/forms/d/e/1FAIpQLSdPTdHpiWtYrOk3bB10CoLFFtgtvWZTsZ2BVleAWIveISkDTQ/viewform?usp=pp_url&entry.13122347=Bitterroot+Valley+Travel+Planner" target="_blank" rel="noopener">NOTIFY ME</a>
        </div>
      </div>
    </section>
  );
}
