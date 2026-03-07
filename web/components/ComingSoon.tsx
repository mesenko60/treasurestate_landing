import Link from 'next/link';

export default function ComingSoon() {
  return (
    <section id="coming-soon" className="content-section planners-section">
      <h2>Montana Travel Planners</h2>
      <div className="planners-grid">
        <Link href="/planners/montana-backroads" className="planner-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Montana Backroads Travel Planner</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/beaten_path_logo.png" alt="Off the Beaten Path Logo" style={{maxWidth:'202.5px', display:'block', margin:'0 auto 8px auto'}} />
          <p>Map out true adventures off the beaten path across Montana&apos;s scenic backroads.</p>
          <span className="waitlist-btn" style={{ pointerEvents: 'none' }}>EXPLORE NOW</span>
        </Link>
        <Link href="/planners/hot-springs-guide" className="planner-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Hot Springs Guide</h3>
          <p>Discover Montana&apos;s rejuvenating natural hot springs with ratings, directions, and an interactive map.</p>
          <span className="waitlist-btn" style={{ pointerEvents: 'none' }}>EXPLORE NOW</span>
        </Link>
        <Link href="/planners/campgrounds-guide" className="planner-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Campgrounds &amp; RV Parks</h3>
          <p>Browse 100+ campgrounds across Montana — KOAs, state parks, public land, and RV parks.</p>
          <span className="waitlist-btn" style={{ pointerEvents: 'none' }}>EXPLORE NOW</span>
        </Link>
        <Link href="/planners/hiking-guide" className="planner-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>Hiking Trails &amp; Trailheads</h3>
          <p>60+ trails across Montana with Google ratings, directions, and nearby town profiles.</p>
          <span className="waitlist-btn" style={{ pointerEvents: 'none' }}>EXPLORE NOW</span>
        </Link>
        <div className="planner-card">
          <h3>Bitterroot Valley Travel Planner</h3>
          <p>Experience the stunning landscapes and charming towns of the Bitterroot Valley.</p>
          <a className="waitlist-btn" href="https://docs.google.com/forms/d/e/1FAIpQLSdPTdHpiWtYrOk3bB10CoLFFtgtvWZTsZ2BVleAWIveISkDTQ/viewform?usp=pp_url&entry.13122347=Bitterroot+Valley+Travel+Planner" target="_blank" rel="noopener">NOTIFY ME</a>
        </div>
      </div>
    </section>
  );
}
