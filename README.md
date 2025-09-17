<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>PashuMitra — Smart Veterinary Healthcare System</title>
  <style>
    :root{
      --bg:#0f1724; --card:#0b1220; --muted:#94a3b8; --accent:#10b981;
      --glass: rgba(255,255,255,0.03);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    html,body{height:100%; margin:0; background:linear-gradient(180deg,#071023 0%, #071132 100%); color:#e6eef8;}
    .container{max-width:980px; margin:40px auto; padding:28px; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:12px; box-shadow: 0 6px 30px rgba(2,6,23,0.6); border:1px solid rgba(255,255,255,0.03);}
    header{display:flex; align-items:center; gap:16px;}
    .logo{
      width:72px; height:72px; border-radius:12px; display:flex; align-items:center; justify-content:center;
      background:linear-gradient(135deg, #06b6d4, #7c3aed); font-weight:700;
      font-size:22px; color:white; box-shadow: 0 6px 18px rgba(124,58,237,0.2);
    }
    h1{margin:0; font-size:24px;}
    p.lead{margin:8px 0 18px; color:var(--muted);}
    .badges{display:flex; gap:8px; flex-wrap:wrap; margin-top:12px;}
    .badge{background:var(--glass); padding:6px 10px; border-radius:999px; color:var(--muted); font-size:13px; border:1px solid rgba(255,255,255,0.02);}
    section{margin-top:20px;}
    h2{font-size:16px; margin-bottom:10px;}
    .grid{display:grid; gap:12px;}
    .columns{display:grid; grid-template-columns: 1fr 320px; gap:18px;}
    .card{background:rgba(255,255,255,0.02); padding:14px; border-radius:10px; border:1px solid rgba(255,255,255,0.03);}
    ul{margin:0; padding-left:18px; color:var(--muted);}
    code{background:#071627; padding:4px 6px; border-radius:6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace; font-size:13px;}
    .tech-list{display:flex; flex-wrap:wrap; gap:8px;}
    .tech{background:rgba(255,255,255,0.02); padding:6px 8px; border-radius:8px; color:var(--muted); font-size:13px; border:1px solid rgba(255,255,255,0.02);}
    .footer{margin-top:20px; color:var(--muted); font-size:13px; text-align:center;}
    .repo-link{display:inline-block; margin-top:8px; padding:8px 12px; background:linear-gradient(90deg,#0ea5a4,#60a5fa); color:#021124; border-radius:8px; font-weight:700; text-decoration:none;}
    pre{background:#021025; padding:12px; border-radius:8px; overflow:auto; color:#cfe8ff;}
    .note{color:#ffd580; font-weight:600;}
    @media (max-width:920px){
      .columns{grid-template-columns: 1fr; }
      .logo{width:56px; height:56px; font-size:18px;}
    }
  </style>
</head>
<body>
  <div class="container" role="main">
    <header>
      <div class="logo">PM</div>
      <div>
        <h1>PashuMitra — Smart Veterinary Healthcare System</h1>
        <p class="lead">A unified digital platform connecting Farmers, Veterinary Doctors, Medical Stores and Admins to deliver timely veterinary care, medicine supply and awareness content.</p>
        <div class="badges">
          <span class="badge">React • Node • MongoDB</span>
          <span class="badge">Chat & Consultation</span>
          <span class="badge">Medicine Ordering</span>
          <span class="badge">Transport Requests</span>
        </div>
      </div>
    </header>

    <section class="columns">
      <div>
        <section class="card">
          <h2>📌 Project Purpose</h2>
          <p style="color:var(--muted); margin:0 0 10px;">
            PashuMitra aims to reduce the gap between livestock owners and veterinary services by providing easy access to doctors, medicine availability, transport options, and awareness materials — all in a single platform. (Detailed in the project SRS.) :contentReference[oaicite:1]{index=1}
          </p>

          <h2 style="margin-top:14px;">🚀 Key Features</h2>
          <ul>
            <li>Farmer portal — registration, medicine search & ordering, consultations and notifications.</li>
            <li>Doctor portal — provide consultations, prescriptions, and create awareness posts/campaigns.</li>
            <li>Medical store portal — inventory management, accept orders, respond to transport requests.</li>
            <li>Admin — user verification, monitoring, and system notifications.</li>
            <li>Transport request flow for out-of-stock medicines and geolocation-based nearby store selection.</li>
          </ul>

          <h2 style="margin-top:12px">🧭 Project Scope & Impact</h2>
          <p style="color:var(--muted); margin:0;">
            The system targets rural and semi-urban livestock owners to deliver faster veterinary support, reduce delays in medicine supply, and increase awareness about animal health. :contentReference[oaicite:2]{index=2}
          </p>
        </section>

        <section class="card" style="margin-top:14px;">
          <h2>⚙️ Tech Stack</h2>
          <div class="tech-list" style="margin-bottom:8px;">
            <span class="tech">React (Vite)</span>
            <span class="tech">Node.js / Express</span>
            <span class="tech">MongoDB (Atlas)</span>
            <span class="tech">Socket.IO (real-time)</span>
            <span class="tech">Tailwind CSS</span>
            <span class="tech">Vercel / Render</span>
          </div>

          <h2 style="margin-top:10px;">📁 Folder Structure (high-level)</h2>
          <pre>
pashumitra_frontend/
  ├─ src/
  │  ├─ components/
  │  ├─ pages/
  │  └─ app.jsx
pashumitra_backend/
  ├─ controllers/
  ├─ models/
  ├─ routes/
  └─ server.js
          </pre>
        </section>

        <section class="card" style="margin-top:14px;">
          <h2>💾 Installation — Local (Quick)</h2>
          <ol style="color:var(--muted); margin:0 0 10px 18px;">
            <li>Clone the repo: <code>git clone https://github.com/ProjectSGH/PashuMitra</code>. :contentReference[oaicite:3]{index=3}</li>
            <li>Frontend: <code>cd pashumitra_frontend &amp;&amp; npm install &amp;&amp; npm run dev</code></li>
            <li>Backend: <code>cd pashumitra_backend &amp;&amp; npm install</code>, set <code>.env</code> (MONGODB_URI, PORT, etc.) and run <code>node server.js</code></li>
            <li>Open frontend (Vite) URL (e.g. <code>http://localhost:5173</code>) and ensure backend runs on the configured port.</li>
          </ol>

          <p style="margin-top:8px; color:var(--muted);"><span class="note">Tip:</span> Use Postman for API testing and to validate routes while developing. See SRS for API list and test cases. :contentReference[oaicite:4]{index=4}</p>
        </section>

        <section class="card" style="margin-top:14px;">
          <h2>🧪 Testing & Deployment</h2>
          <ul style="color:var(--muted);">
            <li>Manual & Postman API testing for core flows (login, orders, transport requests, chat).</li>
            <li>Frontend can be deployed on Vercel; backend on Render/AWS. Example deployment instructions are documented in the SRS. :contentReference[oaicite:5]{index=5}</li>
          </ul>
        </section>

        <section class="card" style="margin-top:14px;">
          <h2>📌 How to Demo (suggested flow for faculty)</h2>
          <ol style="color:var(--muted); margin:0 0 10px 18px;">
            <li>Open Home page → show role selector (Farmer / Doctor / Store).</li>
            <li>Demonstrate farmer signup & verification flow (or use seeded accounts).</li>
            <li>Search medicine → show in-stock order flow and out-of-stock transport request flow.</li>
            <li>Open chat/consultation with a doctor and show awareness posts & admin verification panel.</li>
          </ol>
        </section>
      </div>

      <aside>
        <div class="card">
          <h2>Repository</h2>
          <p style="color:var(--muted); margin:0 0 8px;">Main repo &amp; SRS are available here:</p>
          <a class="repo-link" href="https://github.com/ProjectSGH/PashuMitra" target="_blank" rel="noopener">github.com/ProjectSGH/PashuMitra</a>
          <p style="color:var(--muted); margin-top:10px; font-size:13px;">(SRS PDF with full design, diagrams &amp; test cases.) :contentReference[oaicite:6]{index=6}</p>
        </div>

        <div class="card" style="margin-top:12px;">
          <h2>Contributors</h2>
          <ul style="color:var(--muted); margin-top:6px;">
            <li>Team-26 — PashuMitra</li>
            <li>Frontend: React &amp; UI — Dhruv &amp; team</li>
            <li>Backend: Node &amp; API — Backend team</li>
            <li>Documentation &amp; SRS — Team-26</li>
          </ul>
        </div>

        <div class="card" style="margin-top:12px;">
          <h2>Future Enhancements</h2>
          <ul style="color:var(--muted); margin-top:6px;">
            <li>Mobile apps (Android / iOS)</li>
            <li>AI-based medicine recommender &amp; chatbot</li>
            <li>Offline mode &amp; multi-language support</li>
            <li>Payment gateway &amp; analytics dashboard</li>
          </ul>
        </div>

        <div class="card" style="margin-top:12px;">
          <h2>Contact</h2>
          <p style="color:var(--muted); margin:0;">For questions or demo requests:</p>
          <p style="margin:6px 0 0;"><strong>Team-26 / PashuMitra</strong><br/>Email: <code>your-team-email@example.com</code></p>
        </div>
      </aside>
    </section>

    <div class="footer">
      <div>Read the full SRS &amp; diagrams for detailed requirements and testing. :contentReference[oaicite:7]{index=7}</div>
      <div style="margin-top:8px;">Made with ♥ for livestock healthcare</div>
    </div>
  </div>
</body>
</html>
