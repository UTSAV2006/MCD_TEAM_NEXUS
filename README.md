<h1 align="center">MCD HRMS Platform</h1>
<p align="center">
A centralized, secure and scalable Human Resource Management System for the Municipal Corporation of Delhi (MCD)
</p>

<p align="center"><b>Team Name:</b> TeamNexus</p>

<hr>

<h2>Problem Statement</h2>
<p>
The Municipal Corporation of Delhi manages thousands of municipal employees across multiple departments. Existing HR operations are fragmented, manual and lack real-time visibility, leading to inefficiencies in recruitment, attendance, transfers, payroll management, performance evaluation and grievance redressal.
</p>
<p>
This project proposes a unified, secure and production-ready HRMS platform to digitize and centralize all MCD human resource operations.
</p>

<h2>Solution Overview</h2>
<p>
The MCD HRMS Platform is a full-stack, secure web system that centralizes employee lifecycle management — from recruitment to retirement — into a single digital governance platform.
</p>
<p>
It enables municipal authorities to automate HR workflows, improve transparency, reduce delays and make data-driven administrative decisions.
</p>

<h2>Core Modules</h2>
<ul>
  <li>Employee Master & Centralized Records</li>
  <li>Recruitment & Digital Onboarding</li>
  <li>Attendance & Leave Management</li>
  <li>Transfers & Posting Control</li>
  <li>Payroll & Salary Processing</li>
  <li>Performance Evaluation</li>
  <li>Grievance Redressal System</li>
  <li>Inter-Department Coordination</li>
</ul>

<h2>System Architecture</h2>
<pre>
User Portals (Employees / Admin / Authorities)
            |
            v
React Frontend (Vite + Tailwind)
            |
            v
Secure REST APIs (Node.js + Express)
            |
            v
PostgreSQL Central Database
            |
            v
Audit Logs & Analytics Engine
            |
            v
MCD Administration Dashboard
</pre>

<h2>Frontend Stack</h2>
<table border="1" cellpadding="6">
<tr><th>Technology</th><th>Purpose</th></tr>
<tr><td>React 18+</td><td>Core UI Framework</td></tr>
<tr><td>Vite</td><td>Build Tool & Dev Server</td></tr>
<tr><td>React Router</td><td>Client Side Routing</td></tr>
<tr><td>Axios</td><td>HTTP Client for APIs</td></tr>
<tr><td>Tailwind CSS</td><td>Responsive Styling & UI Design</td></tr>
<tr><td>HTML5 / CSS3</td><td>Semantic Markup</td></tr>
</table>

<h2>Backend Stack</h2>
<table border="1" cellpadding="6">
<tr><th>Technology</th><th>Purpose</th></tr>
<tr><td>Node.js 18+</td><td>Runtime Environment</td></tr>
<tr><td>Express.js</td><td>REST API Framework</td></tr>
<tr><td>PostgreSQL</td><td>Relational Database</td></tr>
<tr><td>pg</td><td>PostgreSQL Client</td></tr>
<tr><td>jsonwebtoken (JWT)</td><td>Authentication Tokens</td></tr>
<tr><td>bcryptjs</td><td>Password Hashing</td></tr>
<tr><td>helmet</td><td>Security Headers</td></tr>
<tr><td>express-rate-limit</td><td>API Rate Limiting</td></tr>
<tr><td>express-validator</td><td>Input Validation</td></tr>
<tr><td>dotenv</td><td>Environment Variables</td></tr>
</table>

<h2>Development & Deployment</h2>
<table border="1" cellpadding="6">
<tr><th>Tool</th><th>Purpose</th></tr>
<tr><td>Git</td><td>Version Control</td></tr>
<tr><td>GitHub</td><td>Source Code Repository</td></tr>
<tr><td>Vercel</td><td>Frontend Hosting</td></tr>
<tr><td>Railway</td><td>Backend & PostgreSQL Hosting</td></tr>
<tr><td>VS Code</td><td>Code Editor</td></tr>
<tr><td>npm</td><td>Package Manager</td></tr>
</table>

<h2>Security Features</h2>
<ul>
  <li>JWT Token Authentication</li>
  <li>Password Hashing (bcrypt)</li>
  <li>API Rate Limiting</li>
  <li>CORS Protection</li>
  <li>Helmet Security Headers</li>
  <li>Input Validation</li>
  <li>Advanced Audit Logging</li>
</ul>

<h2>Architecture Pattern</h2>
<ul>
  <li>Microservices-inspired design</li>
  <li>Layered Architecture (Presentation → API → Business Logic → Data)</li>
  <li>RESTful APIs</li>
  <li>Role-Based Access Control (RBAC)</li>
</ul>

<h2>Installation</h2>
<pre>
git clone https://github.com/UTSAV2006/MCD_TEAM_NEXUS
cd your-MCD_TEAM_NEXUS
npm install
npm start
</pre>

<p>Open in browser:</p>
<pre>http://localhost:3000</pre>

<h2>Impact</h2>
<ul>
  <li>Centralizes HR operations of MCD</li>
  <li>Improves transparency and accountability</li>
  <li>Reduces paperwork and processing delays</li>
  <li>Prevents administrative inefficiencies</li>
  <li>Enables data-driven governance</li>
</ul>

<h2>Future Enhancements</h2>
<ul>
  <li>Biometric attendance integration</li>
  <li>Mobile employee application</li>
  <li>AI-based workforce analytics</li>
  <li>Smart City integration</li>
  <li>Automated compliance dashboards</li>
</ul>

<h2>Team</h2>
<table border="1" cellpadding="6">
<tr><th>Name</th><th>Role</th></tr>
<tr><td>Pramod Mohanty</td><td>Team Lead</td></tr>
<tr><td>Rudransh Kumar Singh</td><td>Developer</td></tr>
<tr><td>Utsav</td><td>Developer</td></tr>
<tr><td>Smridhi Jain</td><td>Developer</td></tr>
<tr><td>Shivangi</td><td>Developer</td></tr>
</table>
