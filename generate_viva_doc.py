import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_hex)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(40, 45, 55)

    # Colors
    NAVY = RGBColor(20, 27, 45)      # #141b2d
    BLUE = RGBColor(37, 99, 235)     # #2563eb
    DARK_GRAY = RGBColor(55, 65, 81)
    EMERALD = RGBColor(16, 133, 72)
    RED = RGBColor(220, 38, 38)

    # Title Cover Page / Header
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(20)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("ImpactBridge — Comprehensive Project Viva Defense Dossier")
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = NAVY

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(16)
    run_sub = sub_p.add_run("Technical Cross-Examination Manual, Architecture Defense & Technology Trade-Offs")
    run_sub.font.size = Pt(13)
    run_sub.font.bold = True
    run_sub.font.color.rgb = BLUE

    # Metadata Box
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Project Title:", "ImpactBridge (NGO Governance, Direct Milestone Accountability & Transparency)"),
        ("Primary Domain:", "Full-Stack Web Engineering / Philanthropic Civic Technology"),
        ("Core Stack:", "React 19, Vite, Node.js, Express.js 5, MongoDB Atlas, Mongoose, JWT, bcryptjs"),
        ("Prepared For:", "Undergraduate Engineering Final Year Project Examination & Technical Defense")
    ]
    for i, (k, v) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.0)
        c1.width = Inches(5.0)
        c0.paragraphs[0].add_run(k).bold = True
        c0.paragraphs[0].runs[0].font.size = Pt(10)
        c1.paragraphs[0].add_run(v)
        c1.paragraphs[0].runs[0].font.size = Pt(10)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    def add_section_heading(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(6)
        r = h.add_run(text)
        r.font.size = Pt(16)
        r.font.bold = True
        r.font.color.rgb = NAVY

    def add_subheading(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(12)
        h.paragraph_format.space_after = Pt(4)
        r = h.add_run(text)
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = BLUE

    def add_viva_qna(q_num, question, short_ans, tech_exp, code_conn, follow_up, follow_ans, common_mistake):
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(14)
        p_q.paragraph_format.space_after = Pt(3)
        rq = p_q.add_run(f"Q{q_num}: {question}")
        rq.font.size = Pt(12)
        rq.font.bold = True
        rq.font.color.rgb = NAVY

        # Short Viva Answer (Highlighted Box)
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(7.0)
        set_cell_background(cell, "EFF6FF") # soft blue
        set_cell_margins(cell, 80, 80, 120, 120)
        p_box = cell.paragraphs[0]
        p_box.paragraph_format.space_after = Pt(0)
        r_box_title = p_box.add_run("Direct Spoken Answer (20-40s):\n")
        r_box_title.bold = True
        r_box_title.font.size = Pt(10.5)
        r_box_title.font.color.rgb = BLUE
        r_box_content = p_box.add_run(f'"{short_ans}"')
        r_box_content.font.size = Pt(10.5)
        r_box_content.font.italic = True

        # Technical Deep Dive
        p_tech = doc.add_paragraph()
        p_tech.paragraph_format.space_before = Pt(6)
        p_tech.paragraph_format.space_after = Pt(2)
        p_tech.add_run("Technical Explanation: ").bold = True
        p_tech.add_run(tech_exp)

        # Code Connection
        if code_conn:
            p_code = doc.add_paragraph()
            p_code.paragraph_format.space_after = Pt(2)
            p_code.add_run("Project Codebase Connection: ").bold = True
            p_code.add_run(code_conn)

        # Likely Follow Up
        if follow_up:
            p_f = doc.add_paragraph()
            p_f.paragraph_format.space_after = Pt(2)
            rf = p_f.add_run("Likely Follow-up from Strict Examiner: ")
            rf.bold = True
            rf.font.color.rgb = RED
            p_f.add_run(f'"{follow_up}"')

            p_fa = doc.add_paragraph()
            p_fa.paragraph_format.space_after = Pt(2)
            p_fa.add_run("Follow-up Defense: ").bold = True
            p_fa.add_run(follow_ans)

        # Common Mistake
        if common_mistake:
            p_m = doc.add_paragraph()
            p_m.paragraph_format.space_after = Pt(8)
            rm = p_m.add_run("Common Student Mistake to Avoid: ")
            rm.bold = True
            rm.font.color.rgb = RGBColor(180, 83, 9)
            p_m.add_run(common_mistake)

    # ==========================================
    # SECTION 1: PROJECT OVERVIEW & ARCHITECTURE
    # ==========================================
    add_section_heading("1. Project Overview & Architectural Blueprint")
    
    p = doc.add_paragraph()
    p.add_run("ImpactBridge is an end-to-end full-stack platform built to address the lack of financial and operational transparency in non-governmental organizations (NGOs). While traditional crowdfunding websites function as generic donation buckets without milestone accountability, ImpactBridge introduces discrete stage-gated milestone tracking, itemized vendor expense reporting, instant Section 80G tax receipt issuance, and skill-based volunteer hour verification.")

    add_subheading("System Architecture & Tier Breakdown")
    p = doc.add_paragraph()
    p.add_run("1. Client Presentation Layer (SPA): Built on React 19 and compiled with Vite. Handles role-based routing (React Router DOM v7), stateful user authentication via React Context API (AuthContext.jsx), reactive rendering of financial dashboards, interactive geospatial mapping (Leaflet), and analytical visualization (Recharts).\n"
              "2. Application Controller & Gateway Layer: RESTful HTTP API built on Express.js 5 and Node.js. Enforces stateless JWT authentication (auth.js), granular role authorization (roleAuth.js), and centralized error handling.\n"
              "3. Persistence & Document Store Layer: MongoDB Atlas accessed via Mongoose 9 ODM. Stores polymorphic data models with schema-level validation, document pre-save lifecycle hooks, and virtual calculated getters.")

    # ==========================================
    # SECTION 2: WHY THIS, NOT THAT?
    # ==========================================
    add_section_heading("2. Core Technical Comparisons: 'Why This, Not That?'")

    add_viva_qna(
        1,
        "Why did you choose MongoDB over a Relational Database like PostgreSQL or MySQL?",
        "We chose MongoDB because our data model centers on dynamic, deeply nested document structures—such as campaigns with embedded budget category blueprints, and milestones containing heterogeneous proof evidence (photos, field report PDFs, and sensor telemetry). MongoDB stores these in native BSON, avoiding multi-table SQL JOIN overhead during read-heavy campaign browsing.",
        "Relational databases require at least 5 normalized junction tables for our campaign data: campaigns, budget_categories, milestones, proof_attachments, and evidence_metadata. In MongoDB, retrieving a campaign and its embedded roadmap is an index-assisted read on a single collection. Concurrency updates to donation totals are handled via MongoDB's atomic $inc operator.",
        "server/src/models/Campaign.js defines embedded budgetPlan arrays [{ category, plannedAmount }]. server/src/models/Milestone.js contains an array of proofEvidence sub-documents [{ type, url, note }].",
        "Financial applications need ACID transactions. How do you prevent race conditions when two users donate simultaneously without SQL transactions?",
        "In donationController.js, we do not read the balance into JavaScript memory, add to it, and write it back. Instead, we use MongoDB's atomic $inc operator: Campaign.findByIdAndUpdate(id, { $inc: { fundsRaised: amount, donorCount: 1 } }). This executes atomically at the WiredTiger storage engine level using document-level locking, preventing dirty writes without locking the whole table.",
        "Do not say 'MongoDB is faster than SQL' or 'SQL is outdated'. Emphasize the document structure fit and atomic update operators."
    )

    add_viva_qna(
        2,
        "Why did you choose JSON Web Tokens (JWT) instead of Server-Side Sessions with Redis?",
        "We chose JWT because it is stateless, self-contained, and horizontally scalable. The token contains the user's ID and role signed with an HMAC-SHA256 secret. The server does not need to query a Redis session store on every request, making deployment across decoupled environments seamless.",
        "Stateless tokens eliminate the need for centralized session stores. The server verifies incoming requests by mathematically verifying the signature using process.env.JWT_SECRET. Cross-origin requests between decoupled client and backend servers (port 3000 to port 5000) avoid SameSite cookie restrictions.",
        "server/src/middleware/auth.js: Checks req.headers.authorization for 'Bearer <token>', calls jwt.verify(token, JWT_SECRET), and attaches the authenticated user to req.user.",
        "If a JWT is stolen from localStorage, the attacker has permanent access until it expires. How do you revoke a compromised JWT?",
        "A purely stateless JWT cannot be revoked before expiration without maintaining a server-side blacklist. In our current architecture, tokens expire in 7 days. In an enterprise banking deployment, the industry standard is using short-lived Access Tokens (15 minutes) kept in React memory, paired with HttpOnly Refresh Tokens stored in Redis with revocation lists.",
        "Never claim JWTs cannot be compromised or that localStorage is 100% secure. Acknowledge XSS trade-offs and explain the short-lived access token + refresh token defense."
    )

    add_viva_qna(
        3,
        "Why did you choose Node.js with Express instead of Java Spring Boot or Python Django?",
        "Node.js uses an asynchronous, single-threaded event loop backed by the libuv library. Because our crowdfunding platform is fundamentally I/O-heavy—streaming database queries, processing HTTP calls, and dispatching notifications—rather than CPU-intensive, Node's non-blocking event-driven model handles thousands of concurrent requests with minimal RAM overhead compared to Java's thread-per-request model.",
        "Java Spring Boot historically allocates 1MB of stack memory per thread. Handling 10,000 idle HTTP connections can consume gigabytes of RAM. Node.js multiplexes connections onto a single event loop via epoll (Linux) or IOCP (Windows). Furthermore, a unified JavaScript language stack across frontend and backend accelerates development and shared validation schemas.",
        "server/src/server.js initializes Express 5 with express.json(), cors(), and mounts 10 modular route routers.",
        "What happens if someone triggers a heavy calculation (like computing complex analytics) in a Node.js route?",
        "Because Node.js runs JavaScript on a single thread, any CPU-intensive synchronous task blocks the event loop, causing all other incoming requests to queue and time out. In our design, we prevent this by offloading heavy work to database aggregation pipelines ($aggregate) or delegating to Node Worker Threads (worker_threads).",
        "Do not say 'Node.js is multithreaded'. The JavaScript engine (V8) is strictly single-threaded; asynchronous I/O is delegated to the C++ libuv thread pool."
    )

    add_viva_qna(
        4,
        "Why did you use bcryptjs instead of standard SHA-256 or MD5 for password storage?",
        "SHA-256 and MD5 are cryptographic hash functions designed to be extremely fast. Because they are fast, modern GPUs can compute billions of SHA-256 hashes per second, making them trivial to crack with rainbow tables or brute force. Bcrypt is an adaptive slow hash based on the Blowfish cipher that incorporates an automatic salt and configurable work factor (rounds: 10), intentionally slowing down brute-force attacks.",
        "Bcrypt uses a salt (cryptographically random string) concatenated with the password before hashing, guaranteeing that two users with the password 'password123' have completely different hash strings in the database. Its work factor (cost: 10 = 2^10 = 1024 iterations) ensures hashing takes ~100ms, which is imperceptible to a logging-in user but renders GPU dictionary attacks computationally infeasible.",
        "server/src/models/User.js uses userSchema.pre('save') with const salt = await bcrypt.genSalt(10); this.password = await bcrypt.hash(this.password, salt); and compares via bcrypt.compare().",
        "If bcrypt is intentionally slow, couldn't an attacker launch a Denial-of-Service (DoS) attack by flooding your /api/auth/login endpoint with dummy passwords?",
        "Yes, slow hashing can be exploited for CPU-exhaustion DoS. To mitigate this in production, we implement IP rate limiting using express-rate-limit (e.g., maximum 5 login attempts per minute per IP address) and Cloudflare web application firewall (WAF) bot mitigation.",
        "Do not confuse hashing with encryption. Hashing is a one-way mathematical function; encryption is two-way and requires a decryption key."
    )

    add_viva_qna(
        5,
        "Why did you use React Single Page Application (SPA) instead of Multi-Page Application (MPA)?",
        "React enables our platform to behave like a native application with instant tab-switching between the financial ledger, milestone tracker, and geospatial map without triggering full-page browser reloads. With React's Virtual DOM and component reconciliation, only modified subtrees—such as upvote counters or milestone progress bars—re-render, drastically minimizing DOM manipulation overhead.",
        "In a traditional MPA, every navigation requires the browser to teardown the DOM, request HTML, re-fetch CSS/JS, and repaint. In our React SPA, React Router DOM v7 intercepts anchor tags, and dynamically swaps components in the DOM while persistent state (AuthContext user credentials) remains intact in memory.",
        "client/src/App.jsx configures <BrowserRouter> with client-side protected routing. client/src/context/AuthContext.jsx maintains persistent global authentication.",
        "What are the major trade-offs of using a React SPA?",
        "First, Initial Page Load Latency: The browser must download and parse a JavaScript bundle before rendering the first frame. Second, Search Engine Optimization (SEO): Web crawlers that do not execute JavaScript see an empty <div id='root'></div> shell. For public marketing sites, Server-Side Rendering (Next.js) solves this.",
        "Do not claim React is always faster. A static HTML page loads faster initially than a React SPA; React excels at interactive, dynamic state management post-load."
    )

    # ==========================================
    # SECTION 3: CODE-LEVEL CROSS-QUESTIONING
    # ==========================================
    add_section_heading("3. Code-Level Cross-Questioning & Implementation Details")

    add_viva_qna(
        6,
        "Explain this line in server/src/middleware/auth.js: req.user = await User.findById(decoded.id).select('-password');",
        "This line extracts the user ID embedded in the validated JWT payload, fetches the user's current record from MongoDB, strips out the hashed password field, and attaches the resulting Mongoose document to the Express request object so downstream controllers know exactly who is making the request.",
        "Even though jwt.verify() confirms the token was cryptographically signed by our server, the token payload might be days old. Fetching User.findById() ensures the account has not been deleted or banned since token generation. The .select('-password') projection prevents the password hash from lingering in memory.",
        "File: server/src/middleware/auth.js, Line 10.",
        "What happens if the database connection drops right at this line?",
        "If MongoDB is unreachable, User.findById() will reject its promise with a MongooseError. Our try/catch block catches this and returns HTTP 401/500, preventing the unhandled rejection from crashing the Node.js process.",
        "Do not say 'it checks if the password matches'. This line runs after authentication solely to hydrate user context."
    )

    add_viva_qna(
        7,
        "Why did you define 'percentFunded' as a Mongoose virtual in Campaign.js instead of a regular database field?",
        "A virtual property is computed dynamically in memory upon access and is not persisted in the database. If we saved percentFunded as a field, we would have to remember to recalculate and update it every single time fundsRaised or fundingTarget changed, risking data inconsistency. Virtuals guarantee 100% calculation accuracy with zero database write redundancy.",
        "Virtuals are defined on Mongoose schemas using campaignSchema.virtual('percentFunded').get(function () { return Math.min(Math.round((this.fundsRaised / this.fundingTarget) * 100), 999); }). By setting { toJSON: { virtuals: true } }, Mongoose serializes this getter automatically into JSON responses sent to the client.",
        "File: server/src/models/Campaign.js, Lines 103-107.",
        "Can you query campaigns by a virtual field using Campaign.find({ percentFunded: { $gt: 50 } })?",
        "No. Because virtuals do not exist in the underlying MongoDB BSON documents, the database engine cannot index or query them. If we need to filter or sort by funding percentage at the database level, we must either use a MongoDB $expr aggregation pipeline ($divide: ['$fundsRaised', '$fundingTarget']) or persist the calculated field.",
        "Never say virtuals are stored in MongoDB. They exist strictly in Node.js runtime memory."
    )

    add_viva_qna(
        8,
        "How does role-based access control work in server/src/middleware/roleAuth.js?",
        "roleAuth.js is a higher-order middleware factory that takes permitted roles (e.g., 'admin', 'ngo') as arguments and returns an Express middleware function. It inspects req.user.role (attached by auth.js) and verifies if it is included in the allowed list. If not, it halts the pipeline with HTTP 403 Forbidden.",
        "The pattern uses JavaScript closures: const authorizeRoles = (...roles) => (req, res, next) => { if (!roles.includes(req.user.role)) return res.status(403).json(...); next(); };. This allows clean, reusable route protection: router.post('/verify', protect, authorizeRoles('admin'), verifyNgo);.",
        "File: server/src/middleware/roleAuth.js, Lines 1-15.",
        "What is the difference between returning HTTP 401 Unauthorized vs HTTP 403 Forbidden?",
        "HTTP 401 Unauthorized indicates lack of valid authentication (the user has not proven who they are). HTTP 403 Forbidden indicates that the user is authenticated, but lacks sufficient permissions to access the requested resource (a donor trying to access an admin audit route).",
        "Do not confuse 401 and 403. 401 is 'Who are you?', 403 is 'You cannot enter here'."
    )

    # ==========================================
    # SECTION 4: SECURITY & VULNERABILITIES
    # ==========================================
    add_section_heading("4. Security Architecture & Threat Defense")

    add_viva_qna(
        9,
        "Is your application vulnerable to SQL Injection or NoSQL Injection?",
        "SQL Injection is impossible because we do not use a relational SQL database or construct raw SQL strings. For NoSQL injection, Mongoose's strict schema definition automatically casts and sanitizes inputs against predefined types, preventing attackers from injecting query operators like $ne or $gt through JSON request bodies.",
        "NoSQL injection occurs when unsanitized user input containing MongoDB operators (e.g., { 'username': 'admin', 'password': { '$ne': null } }) is passed directly into a raw find() query. In our code, Mongoose schema casting rejects non-string types for string fields. To add defense-in-depth, express-mongo-sanitize can be mounted to strip all '$' and '.' characters from incoming req.body.",
        "server/src/models/User.js strictly casts email: { type: String } and password: { type: String }.",
        "What happens if an attacker sends an unknown field in the POST /api/campaigns body?",
        "By default, Mongoose schemas have strict: true enabled. Any fields sent in req.body that are not explicitly defined in campaignSchema are stripped out and ignored before saving to MongoDB.",
        "Never say 'NoSQL databases are immune to injection'. NoSQL injection is real; explain how Mongoose schema casting prevents it."
    )

    add_viva_qna(
        10,
        "How do you protect against Cross-Site Request Forgery (CSRF)?",
        "Our API is protected against CSRF because authentication relies on a custom HTTP header: Authorization: Bearer <token>. Web browsers do not attach custom Authorization headers automatically during cross-origin requests or forged form submissions, rendering standard CSRF attacks ineffective.",
        "CSRF exploits ambient credentials (cookies sent automatically by the browser with every request). Because our application does not use session cookies for API authentication and requires client JavaScript to explicitly attach the Bearer token to headers in api.js, an external malicious website cannot forge an authenticated request on behalf of the user.",
        "client/src/utils/api.js explicitly attaches headers['Authorization'] = `Bearer ${token}`.",
        "If you switch to storing JWTs in cookies, how must you configure them to maintain CSRF protection?",
        "We must set the cookie with: SameSite=Strict (or Lax), HttpOnly=true (blocks XSS theft), Secure=true (HTTPS only), and implement anti-CSRF Double Submit Cookie tokens.",
        "Do not say 'CORS prevents CSRF'. CORS does not prevent cross-origin POST requests from executing; it only prevents the malicious site from reading the response."
    )

    # ==========================================
    # SECTION 5: TOP 20 EXAMINER TRAPS & RAPID REVISION
    # ==========================================
    add_section_heading("5. Top 20 Examiner Traps & Rapid-Fire Revision")

    traps = [
        ("What happens if MongoDB Atlas connection drops?", "Express continues running, but controllers awaiting database queries throw a MongooseError. Our global error handler catches this and returns HTTP 500 without crashing Node.js."),
        ("What does 'npm run dev' do internally?", "It runs the concurrently CLI tool, which spawns two parallel child processes: 'node server/src/server.js' for Express (port 5000) and 'vite' for React (port 3000)."),
        ("What is the difference between dependencies and devDependencies?", "dependencies are required at runtime in production (express, mongoose, bcryptjs). devDependencies are tools only needed during local development and compilation (vite, oxlint, concurrently)."),
        ("Why is 'process.env' used?", "It follows Twelve-Factor App methodology by injecting environment-specific secrets (database URIs, JWT secrets) at runtime, keeping credentials out of GitHub source control."),
        ("What is the role of 'cors' middleware in server.js?", "Browsers enforce the Same-Origin Policy. Since React runs on port 3000 and Express on port 5000, cors sends Access-Control-Allow-Origin headers so the browser permits cross-origin API calls."),
        ("What is Mongoose?", "An Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, query building, lifecycle hooks, and business logic encapsulation."),
        ("What is the WiredTiger storage engine?", "The default storage engine for MongoDB since v3.2. It provides document-level concurrency control (row-level locking), compression, and checkpointing."),
        ("Why does React use keys in lists (e.g., campaigns.map)?", "Keys give elements a stable identity. React's Virtual DOM reconciliation uses keys to determine which items were added, removed, or reordered, avoiding re-rendering the entire list."),
        ("What is the difference between useEffect with [] vs [deps]?", "An empty dependency array [] runs the effect only once when the component mounts. Passing [deps] re-runs the effect whenever any dependency value changes."),
        ("What is the purpose of bcrypt salt rounds?", "Salt rounds define the computational work factor (2^rounds iterations). A higher round increases hashing time exponentially, making brute-force cracking exponentially slower."),
        ("What is the purpose of 'morgan' middleware?", "It is an HTTP request logger that prints method, route, status code, and response time to the terminal for debugging during development."),
        ("What does express.json() do?", "It parses incoming HTTP request bodies formatted as JSON (Content-Type: application/json) and populates req.body with a JavaScript object."),
        ("How does Section 80G tax exemption work in the app?", "When a donor contributes to a verified campaign, the system auto-generates a unique receipt number (REC-YYYYMMDD-XXXX) and binds the donor's PAN number to a legally compliant tax receipt."),
        ("What is the purpose of virtuals in Mongoose?", "Document properties that can be calculated and read like normal fields, but are not stored in the MongoDB database, saving storage and preventing stale calculations."),
        ("What happens if two users register with the same email?", "User.js specifies unique: true on the email field. MongoDB creates a unique index on 'email'. Attempting to insert a duplicate throws error code 11000, which our controller handles as HTTP 400."),
        ("What is reconciliation in React?", "The algorithm React uses to diff one Virtual DOM tree with another to determine which parts of the real DOM need to be updated efficiently."),
        ("Why does the backend listen on port 5000 and client on 3000?", "They are decoupled client-server applications. Vite dev server serves client assets on 3000; Express listens for REST API requests on 5000."),
        ("What is the purpose of 'timestamps: true' in Mongoose?", "Automatically manages createdAt and updatedAt fields on every document insertion and modification."),
        ("What is the role of Leaflet in ImpactMapPage?", "An open-source JavaScript library for mobile-friendly interactive maps. It renders tile layers from OpenStreetMap and plots dynamic markers for campaign sites."),
        ("How would you scale this app to 100,000 users?", "1) Stateless Express backend scaled horizontally behind an NGINX load balancer; 2) MongoDB Atlas replica set with read-sharding; 3) Redis cache for campaign listings; 4) Static assets served via Cloudflare CDN.")
    ]

    trap_table = doc.add_table(rows=len(traps) + 1, cols=2)
    trap_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    h0, h1 = trap_table.rows[0].cells[0], trap_table.rows[0].cells[1]
    h0.width = Inches(3.0)
    h1.width = Inches(4.0)
    h0.paragraphs[0].add_run("Examiner Technical Question").bold = True
    h1.paragraphs[0].add_run("Model Defense Answer").bold = True
    set_cell_background(h0, "141B2D")
    set_cell_background(h1, "141B2D")
    h0.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    h1.paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)

    for idx, (tq, ta) in enumerate(traps):
        row = trap_table.rows[idx + 1]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(3.0)
        c1.width = Inches(4.0)
        c0.paragraphs[0].add_run(f"{idx+1}. {tq}").bold = True
        c0.paragraphs[0].runs[0].font.size = Pt(9.5)
        c1.paragraphs[0].add_run(ta)
        c1.paragraphs[0].runs[0].font.size = Pt(9.5)
        bg = "F8FAFC" if idx % 2 == 0 else "FFFFFF"
        set_cell_background(c0, bg)
        set_cell_background(c1, bg)
        set_cell_margins(c0, 40, 40, 80, 80)
        set_cell_margins(c1, 40, 40, 80, 80)

    # Save document
    out_path = r"c:\Users\Vanshika Tripathi\.gemini\antigravity-ide\scratch\dsa-progress-tracker\NGO\ImpactBridge_Brutal_Viva_Preparation_Guide.docx"
    doc.save(out_path)
    print(f"Document successfully created at: {out_path}")

if __name__ == "__main__":
    create_document()
