import React, { useState, useEffect, useRef } from 'react';
import peopleClickLogo from './assets/peopleclick-logo.png';

// Splunk Log Mock Data
const INITIAL_LOGS = [
  { id: 1, time: "12:44:02", level: "CRITICAL", sig: "SSH Brute Force Auth Spike (50 attempts/sec)", src: "185.220.101.4", target: "auth-gateway-01", status: "active" },
  { id: 2, time: "12:43:18", level: "CRITICAL", sig: "SQLi Signature Detected in URI `?id=1' OR 1=1--`", src: "45.154.255.89", target: "web-storefront", status: "active" },
  { id: 3, time: "12:42:50", level: "WARNING", sig: "Outbound PowerShell downloading base64 script", src: "192.168.1.142", target: "raw.githubusercontent.com", status: "active" },
  { id: 4, time: "12:40:11", level: "INFO", sig: "Scheduled Cron Backup Completed: mysqldump", src: "127.0.0.1", target: "db-master", status: "cleared" },
  { id: 5, time: "12:38:00", level: "WARNING", sig: "Multiple 403 Forbidden Directory Traversal attempts", src: "103.208.220.12", target: "api-internal", status: "active" }
];

// Peopleclick Learning Company Data (From Presentation Deck)
const COMPANY_METRICS = [
  {
    id: 'excellence',
    icon: 'fa-solid fa-crown',
    stat: '25+',
    label: 'Years of Excellence',
    sublabel: 'Empowering Careers Since 2001',
    description: 'Quarter-century of empowering students through quality education, practical training, and career-focused learning.',
    tag: 'Legacy & Pedagogy',
    expandedInfo: {
      headline: '25+ Years of Educational Excellence & Trust',
      highlights: [
        { label: 'Learners Empowered', val: '25,000+' },
        { label: 'Hiring Partners', val: '500+ Top MNCs' },
        { label: 'Practical Hours', val: '1.5M+ Lab Sessions' },
        { label: 'Placement Rate', val: '94.2% Verified' }
      ],
      points: [
        'Established pioneer in human talent acquisition, corporate upskilling, and professional skill accreditation.',
        'Continuous pedagogical modernization aligning to cutting-edge industry cybersecurity, cloud, and AI frameworks.',
        'Extensive corporate alumni network spanning global Tier-1 tech firms and Fortune 500 enterprises.'
      ]
    }
  },
  {
    id: 'geography',
    icon: 'fa-regular fa-circle',
    stat: 'Pan India',
    label: '+ Middle East + SE Asia',
    sublabel: 'Multi-Region Global Footprint',
    description: 'Active presence across major tech corridors in India, Middle East, and Southeast Asia.',
    tag: 'Global Presence',
    expandedInfo: {
      headline: 'Pan India & International Training Footprint',
      highlights: [
        { label: 'India Corridors', val: 'BLR • HYD • NCR • PNE' },
        { label: 'Middle East', val: 'UAE • Saudi • Qatar' },
        { label: 'South East Asia', val: 'Singapore • Malaysia' },
        { label: 'Countries Reached', val: '35+ Countries' }
      ],
      points: [
        'State-of-the-art regional learning hubs and dedicated corporate incubation centers across India.',
        'Cross-border multinational training operations tailored for GCC and APAC cybersecurity compliance.',
        'Globally accessible virtual cyber ranges with localized timing cohorts and multi-language mentor support.'
      ]
    }
  },
  {
    id: 'segments',
    icon: 'fa-solid fa-chess-pawn',
    stat: 'B2B / B2C / B2A',
    label: 'Segments Served',
    sublabel: 'Corporates, Learners & Academia',
    description: 'Complete 360° talent ecosystem serving enterprises, individual career switchers, and universities.',
    tag: 'Ecosystem Spectrum',
    expandedInfo: {
      headline: 'Multi-Segment Human Talent Architecture',
      highlights: [
        { label: 'B2B (Corporates)', val: 'Workforce Transformation' },
        { label: 'B2C (Learners)', val: 'Career Accelerators' },
        { label: 'B2A (Academia)', val: 'Univ. Centers of Excellence' },
        { label: 'Hiring Deployments', val: 'Direct Lateral Placements' }
      ],
      points: [
        'B2B: Customized enterprise upskilling, lateral recruitment drives, and SOC readiness bootcamps.',
        'B2C: Industry-ready technical bootcamps, resume engineering, and guaranteed interview opportunities.',
        'B2A: University curriculum integration, hands-on faculty development, and accredited student workshops.'
      ]
    }
  },
  {
    id: 'delivery',
    icon: 'fa-solid fa-snowflake',
    stat: 'Online + Blended',
    label: 'Delivery Modes',
    sublabel: 'Interactive Virtual & Hybrid Ranges',
    description: 'High-engagement flexible delivery models designed for optimal retention and hands-on skill mastery.',
    tag: 'Flexible Learning',
    expandedInfo: {
      headline: 'Hybrid, Interactive & Hands-On Virtual Classrooms',
      highlights: [
        { label: 'Live Virtual', val: 'Instructor-Led Zoom/Teams' },
        { label: 'Cloud Ranges', val: '24/7 Browser Sandboxes' },
        { label: 'Blended LMS', val: 'Recorded + Interactive' },
        { label: 'Pacing Options', val: 'Weekend & Weekday' }
      ],
      points: [
        'Live interactive cohorts with senior industry practitioners sharing real screens and live packet captures.',
        'Browser-accessible virtual ranges loaded with Kali Linux, Splunk, Metasploit, and Wireshark.',
        'Recorded sessions with lifetime access, downloadable cheatsheets, and personalized mentor code reviews.'
      ]
    }
  }
];

// Protected Assets Data (From Presentation Deck Slide 02 / 11)
const CYBERSECURITY_ASSETS = [
  {
    id: 'enterprise_data',
    title: 'Enterprise Data',
    icon: 'fa-solid fa-server',
    sublabel: 'Proprietary IP & Database Warehouses',
    scope: 'Client records, trade secrets, R&D blueprints & SQL databases',
    threat: 'SQL injection, unauthorized data exfiltration, ransomware leaks',
    defense: 'Field-level AES-256 encryption, database firewalls & zero-trust access'
  },
  {
    id: 'financial_systems',
    title: 'Financial Systems',
    icon: 'fa-solid fa-building-columns',
    sublabel: 'Core Banking, Ledgers & Payment Gateways',
    scope: 'SWIFT wire rails, payment APIs, customer balances & transaction records',
    threat: 'BOLA/IDOR API tampering, automated botnets, credential stuffing',
    defense: 'Multi-Factor Authentication (MFA), AI fraud anomaly detection, PCI-DSS'
  },
  {
    id: 'government_infrastructure',
    title: 'Government Infrastructure',
    icon: 'fa-solid fa-landmark',
    sublabel: 'Public Utilities & Civic Defense Nodes',
    scope: 'Electrical power grids, water utility SCADA, municipal registries',
    threat: 'Nation-state APT campaigns, industrial sabotage, wiper malware',
    defense: 'Air-gapped industrial networks, network micro-segmentation, SOC SIEM'
  },
  {
    id: 'cloud_platforms',
    title: 'Cloud Platforms',
    icon: 'fa-solid fa-cloud',
    sublabel: 'AWS, Azure & Google Cloud Multi-Tenant Stacks',
    scope: 'Virtual VPCs, Kubernetes clusters, serverless functions & S3 buckets',
    threat: 'Cloud IAM privilege escalation, leaked API secrets, SSRF metadata probes',
    defense: 'Cloud Security Posture Management (CSPM), least privilege IAM, automated audits'
  },
  {
    id: 'network_assets',
    title: 'Network Assets',
    icon: 'fa-solid fa-circle-nodes',
    sublabel: 'Firewalls, Core Routers & Active Directory',
    scope: 'Domain controllers, DNS servers, VPN gateways & switch topologies',
    threat: 'Man-in-the-Middle (MitM) ARP poisoning, DNS hijacking, Kerberoasting',
    defense: 'Next-Gen Firewalls (NGFW), 802.1X port security, encrypted IPSec tunnels'
  },
  {
    id: 'privacy_rights',
    title: 'Privacy Rights',
    icon: 'fa-solid fa-id-card',
    sublabel: 'Citizen Confidentiality & Digital PII',
    scope: 'Biometric records, healthcare patient files, individual human privacy',
    threat: 'Identity theft, dark web PII dumps, unauthorized corporate tracking',
  }
];

// Why Cybersecurity is Important in Today's Digital World Points Data (5 Core Pillars)
const CYBERSECURITY_IMPORTANCE_POINTS = [
  {
    id: 'safeguards_sensitive_data',
    number: '01',
    title: 'Safeguards Sensitive Data',
    badge: 'Data Protection',
    badgeColor: 'cyan',
    icon: 'fa-solid fa-shield-halved',
    stat: 'Confidentiality & Privacy',
    summary: 'Guarantees the privacy and integrity of customer credentials, intellectual property, financial ledgers, and healthcare records against unauthorized data exfiltration, dark web leaks, and identity theft.',
    defense: 'AES-256 Encryption • Zero Trust Access'
  },
  {
    id: 'ensures_business_continuity',
    number: '02',
    title: 'Ensures Business Continuity',
    badge: 'Zero Downtime',
    badgeColor: 'rose',
    icon: 'fa-solid fa-arrows-spin',
    stat: '99.99% Operational Uptime',
    summary: 'Shields day-to-day operations from crippling ransomware, destructive disk-wipers, and volumetric DDoS floods that halt core systems and incur millions in financial and productivity downtime.',
    defense: 'Immutable Backups • 24/7 SOC Monitoring'
  },
  {
    id: 'protects_critical_infrastructure',
    number: '03',
    title: 'Protects Critical Infrastructure',
    badge: 'National Security',
    badgeColor: 'amber',
    icon: 'fa-solid fa-tower-broadcast',
    stat: 'Essential Civil Sectors',
    summary: 'Defends electrical power grids, municipal water treatment plants, transportation networks, and hospital ICUs against cyber sabotage, hybrid warfare, and state-sponsored persistent threats.',
    defense: 'SCADA/OT Air-Gapping • Protocol Hardening'
  },
  {
    id: 'builds_and_maintains_trust',
    number: '04',
    title: 'Builds and Maintains Trust',
    badge: 'Brand Integrity',
    badgeColor: 'emerald',
    icon: 'fa-solid fa-handshake-simple',
    stat: 'Customer & Market Confidence',
    summary: 'Cultivates resilient client loyalty and investor trust. While corporate reputation takes decades to establish, a single unmitigated data breach can permanently destroy consumer trust in minutes.',
    defense: 'Transparent Security • Continuous Auditing'
  },
  {
    id: 'ensures_regulatory_compliance',
    number: '05',
    title: 'Ensures Regulatory Compliance',
    badge: 'Global Standards',
    badgeColor: 'indigo',
    icon: 'fa-solid fa-scale-balanced',
    stat: 'GDPR, HIPAA & ISO 27001',
    summary: 'Ensures rigorous compliance with strict international data protection mandates and industry frameworks, shielding organizations from catastrophic statutory penalties, license loss, and legal liability.',
    defense: 'Audit-Ready Controls • Least-Privilege IAM'
  }
];

// Real-World Cybercrime Threat Vectors Data
const REAL_WORLD_CRIMES = [
  {
    id: 'ddos',
    title: 'DDoS Attacks',
    subtitle: 'Distributed Denial of Service',
    category: 'Volumetric & Layer 7',
    icon: 'fa-solid fa-bolt-lightning',
    color: 'rose',
    badge: '15M+ Attacks/Yr',
    desc: 'Flooding web services and APIs with massive distributed botnet request storms until servers crash and drop customer traffic.',
    target: 'Web Infrastructure & APIs',
    defense: 'Anycast Scrubbing & WAF Limits'
  },
  {
    id: 'mitm',
    title: 'MITM Attacks',
    subtitle: 'Man-in-the-Middle & ARP Poisoning',
    category: 'LAN & Protocol Hijacking',
    icon: 'fa-solid fa-user-secret',
    color: 'cyan',
    badge: 'Credential Sniffing',
    desc: 'Poisoning ARP caches or rogue gateways to secretly intercept, decrypt, and manipulate private data between client and server.',
    target: 'Local Networks & Wi-Fi',
    defense: 'Dynamic ARP Inspection & TLS 1.3'
  },
  {
    id: 'ransomware',
    title: 'Ransomware Payloads',
    subtitle: 'Cryptovirology & Extortion',
    category: 'Malware & Extortion',
    icon: 'fa-solid fa-lock',
    color: 'amber',
    badge: '$1.1B Paid Annually',
    desc: 'Deploying high-entropy AES-256 encryption across enterprise volumes followed by double-extortion public leak threats.',
    target: 'Corporate Storage & Databases',
    defense: 'Immutable ZFS Snapshots & EDR'
  },
  {
    id: 'phishing',
    title: 'Phishing Attacks',
    subtitle: 'Spear-Phishing & Harvesters',
    category: 'Social Engineering',
    icon: 'fa-solid fa-envelope-open-text',
    color: 'emerald',
    badge: '91% of Breaches',
    desc: 'Deceptive spear-phishing lures, clone SSO portals, and homoglyph domains stealing enterprise credentials and bypassing 2FA.',
    target: 'Corporate Inboxes & Cloud SSO',
    defense: 'DMARC (p=reject) & FIDO2 Keys'
  },
  {
    id: 'identity_theft',
    title: 'Identity Theft & ATO',
    subtitle: 'Account Takeover & Credential Stuffing',
    category: 'Identity Crimes',
    icon: 'fa-solid fa-id-card',
    color: 'indigo',
    badge: 'Dark Web Breaches',
    desc: 'Leveraging dark web leaked database dumps to execute automated credential stuffing and hijack consumer banking accounts.',
    target: 'Banking Logins & Customer PII',
    defense: 'Adaptive Risk AI & WebAuthn'
  },
  {
    id: 'financial_fraud',
    title: 'Online Scams & BEC',
    subtitle: 'Business Email Compromise & Wire Fraud',
    category: 'Financial Cybercrime',
    icon: 'fa-solid fa-hand-holding-dollar',
    color: 'purple',
    badge: '$2.7B FBI Losses',
    desc: 'CEO impersonation, fraudulent vendor wire redirection, and deceptive crypto drainer contracts manipulating human trust.',
    target: 'Treasury & SWIFT Wire Systems',
    defense: 'Dual-Custody Key & Callbacks'
  }
];

// Course Roadmap Highway SVG Path
const ROAD_SVG_PATH = "M 30,490 C 100,470 140,430 190,395 C 240,360 290,310 375,250 C 470,180 540,360 670,350 C 730,345 780,335 775,310 C 765,250 710,180 635,155 C 570,135 600,90 750,75 C 820,70 870,70 915,70 C 945,70 970,60 990,50";

// Structured Curriculum Data (Exact Match to User Reference Image)
const CURRICULUM_DATA = {
  header: {
    tag: 'CURRICULUM',
    title: 'What Will You Learn?',
    subtitle: 'A structured 60-day journey from foundational concepts to advanced offensive and defensive security operations.'
  }
};

// Course Roadmap Checkpoints (Matching Template Image with 5 Distinct Pins)
const ROADMAP_CHECKPOINTS = [
  {
    id: 1,
    number: '01',
    days: 'Days 01 - 15',
    title: 'Foundations & Network Architecture',
    subtitle: 'Laying the Bedrock of Cybersecurity & Protocol Mechanics',
    levelId: 'beginner',
    levelName: 'Level 01: Beginner',
    pinColor: '#06b6d4', // Cyan / Teal Pin
    pinBg: 'from-cyan-500 to-teal-600',
    pinShadow: 'shadow-cyan-500/30',
    badgeClass: 'bg-cyan-950/80 text-cyan-400 border-cyan-800',
    icon: 'fa-solid fa-network-wired',
    pinCoord: { x: 190, y: 395 }, // road bend 1
    briefSummary: 'Master packet flow, OSI & TCP/IP protocols, subnetting, and Linux CLI server hardening.',
    elaboratedPoints: [
      {
        topic: 'Introduction to Cybersecurity',
        detail: 'Deconstruct modern threat models, threat actor motivations (APTs vs cybercriminals), the CIA Triad, and enterprise defense fundamentals.'
      },
      {
        topic: 'Networking Fundamentals & Architecture',
        detail: 'Trace how data frames and packets navigate through switches, routers, gateways, NAT firewalls, and DNS lookup trees.'
      },
      {
        topic: 'OSI 7-Layer & TCP/IP Deep Dive',
        detail: 'Master Layer 2 (MAC/ARP), Layer 3 (IP/ICMP), Layer 4 (TCP/UDP state handshakes), and Layer 7 application protocols.'
      },
      {
        topic: 'IP Addressing & Subnetting Mastery',
        detail: 'Calculate Classless Inter-Domain Routing (CIDR) blocks, broadcast boundaries, private RFC 1918 allocations, and IPv6 migration.'
      },
      {
        topic: 'Linux Server Administration & Hardening',
        detail: 'Gain fluent command-line mastery (grep, awk, sed, ssh, iptables), POSIX permissions (chmod/chown), sudoers, and bash scripting.'
      },
      {
        topic: 'Windows Security Architecture',
        detail: 'Audit Windows user access controls, NTFS access control lists (ACLs), Windows event logs, and local registry hardening.'
      },
      {
        topic: 'Cryptography & PKI Essentials',
        detail: 'Implement symmetric AES-256-GCM encryption, asymmetric RSA/ECC key exchanges, SHA-256 cryptographic hashing, and TLS certificates.'
      },
      {
        topic: 'Security Concepts & Threat Landscapes',
        detail: 'Identify malware taxonomy (worms, trojans, spyware, ransomware), social engineering tactics, and defense-in-depth principles.'
      }
    ],
    practicalLab: {
      name: 'Lab 1: Wireshark Packet Inspection & Hardened Bastion Server Deployment',
      objective: 'Capture real-time network traffic, dissect 3-way handshakes, and deploy a hardened Ubuntu bastion host with zero cleartext ports.'
    },
    tools: ['Wireshark', 'Bash CLI', 'PowerShell', 'OpenSSL', 'tcpdump', 'Netcat'],
    certAlignment: 'CompTIA Security+ / Network+'
  },
  {
    id: 2,
    number: '02',
    days: 'Days 16 - 30',
    title: 'Network Defense, Firewalls & Perimeter Security',
    subtitle: 'Constructing Defensive Perimeters & Real-Time Traffic Inspection',
    levelId: 'intermediate',
    levelName: 'Level 02: Intermediate (Part 1)',
    pinColor: '#ef4444', // Coral / Red Pin
    pinBg: 'from-rose-500 to-red-600',
    pinShadow: 'shadow-rose-500/30',
    badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800',
    icon: 'fa-solid fa-shield-halved',
    pinCoord: { x: 375, y: 250 }, // road bend 2
    briefSummary: 'Deploy stateful firewalls, IDS/IPS detection signatures, and encrypted VPN tunnels.',
    elaboratedPoints: [
      {
        topic: 'Security Policies & Framework Compliance',
        detail: 'Align enterprise infrastructure with NIST Cybersecurity Framework (CSF), ISO/IEC 27001 ISMS, and CIS Critical Security Controls.'
      },
      {
        topic: 'Enterprise Risk Management & Threat Modeling',
        detail: 'Calculate annualized loss expectancy (ALE = SLE × ARO), conduct STRIDE threat modeling, and evaluate vulnerability severity.'
      },
      {
        topic: 'Firewalls, IDS & IPS Configuration',
        detail: 'Deploy stateful packet filtering firewalls, configure Snort/Suricata intrusion detection signatures, and automate inline IPS blocking.'
      },
      {
        topic: 'VPN & Encrypted Tunnel Security',
        detail: 'Configure site-to-site IPSec tunnels with IKEv2 negotiation and deploy client-to-gateway OpenVPN with TLS certificate verification.'
      },
      {
        topic: 'Wireshark Packet Analysis & Anomaly Carving',
        detail: 'Extract suspicious payloads from PCAP files, isolate covert DNS exfiltration channels, and reconstruct unencrypted HTTP sessions.'
      },
      {
        topic: 'Vulnerability Assessment & CVSS Prioritization',
        detail: 'Execute automated network vulnerability scans, map discovered flaws to MITRE CVE databases, and calculate CVSS 3.1 base metrics.'
      }
    ],
    practicalLab: {
      name: 'Lab 2: Multi-Tier Perimeter Firewall & Snort IDS Deployment',
      objective: 'Configure a virtual pfSense firewall with DMZ segmentation, tune Snort rules to catch port scans, and test IPS automated drops.'
    },
    tools: ['pfSense', 'Snort IDS', 'Wireshark', 'OpenVPN', 'Nessus', 'Suricata'],
    certAlignment: 'CEH (Certified Ethical Hacker) / Cisco CCNA Sec'
  },
  {
    id: 3,
    number: '03',
    days: 'Days 31 - 42',
    title: 'Access Control, OSINT Recon & Blue Team SOC',
    subtitle: 'Adversary Reconnaissance, Access Governance & 24/7 Security Operations',
    levelId: 'intermediate',
    levelName: 'Level 02: Intermediate (Part 2)',
    pinColor: '#a855f7', // Purple / Violet Pin
    pinBg: 'from-purple-500 to-indigo-600',
    pinShadow: 'shadow-purple-500/30',
    badgeClass: 'bg-purple-950/80 text-purple-400 border-purple-800',
    icon: 'fa-solid fa-radar',
    pinCoord: { x: 635, y: 155 }, // road bend 3
    briefSummary: 'Master OSINT reconnaissance, Nmap NSE scanning, and live SOC SIEM alert triage.',
    elaboratedPoints: [
      {
        topic: 'Authentication & Access Control Architecture',
        detail: 'Implement Role-Based Access Control (RBAC), multi-factor authentication (MFA), SAML 2.0 federation, and Kerberos ticket-granting workflows.'
      },
      {
        topic: 'OSINT & Reconnaissance Methodologies',
        detail: 'Execute passive reconnaissance using public intelligence: WHOIS historical queries, sub-domain brute forcing, certificate transparency, and Shodan.'
      },
      {
        topic: 'Nmap Scanning & Enumeration Scripting',
        detail: 'Perform stealth TCP SYN scans (-sS), service version fingerprinting (-sV), UDP probes (-sU), and execute custom NSE Lua security scripts.'
      },
      {
        topic: 'SOC Operations & Alert Lifecycle',
        detail: 'Ingest enterprise syslogs into Splunk SIEM, build correlation rules, filter false positives, and execute structured incident playbooks.'
      },
      {
        topic: 'Incident Response Lifecycle (PICERL)',
        detail: 'Manage incidents through Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned in compliance with NIST SP 800-61.'
      },
      {
        topic: 'Cyber Threat Intelligence (CTI)',
        detail: 'Map threat actor techniques to the MITRE ATT&CK matrix, correlate Indicators of Compromise (IoCs), and consume STIX/TAXII threat feeds.'
      }
    ],
    practicalLab: {
      name: 'Lab 3: Live Target Reconnaissance & SOC Incident Triage',
      objective: 'Conduct external OSINT enumeration on a target organization, run targeted Nmap NSE scans, and triage the resulting alerts inside Splunk SIEM.'
    },
    tools: ['Nmap', 'Splunk Enterprise', 'Shodan', 'Maltego', 'TheHive', 'Wazuh'],
    certAlignment: 'CompTIA CySA+ / Splunk Certified Core User'
  },
  {
    id: 4,
    number: '04',
    days: 'Days 43 - 52',
    title: 'Web Application Security & Offensive Exploitation',
    subtitle: 'OWASP Top 10 Flaws, Burp Suite Mastery & Ethical Exploitation',
    levelId: 'advanced',
    levelName: 'Level 03: Advanced (Part 1)',
    pinColor: '#eab308', // Golden Yellow Pin
    pinBg: 'from-amber-400 to-yellow-500',
    pinShadow: 'shadow-yellow-500/30',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-800',
    icon: 'fa-solid fa-bug',
    pinCoord: { x: 775, y: 310 }, // road bend 4
    briefSummary: 'Exploit OWASP Top 10 web vulnerabilities, SQL injection, XSS, and master Burp Suite Pro.',
    elaboratedPoints: [
      {
        topic: 'Web Application Architecture & Attack Surfaces',
        detail: 'Dissect HTTP/HTTPS request pipelines, REST/GraphQL APIs, session cookie security flags (HttpOnly, Secure, SameSite), and CORS policies.'
      },
      {
        topic: 'OWASP Top 10 In-Depth Breakdown',
        detail: 'Master exploitation and mitigation for Broken Access Control, Cryptographic Failures, Injection, Insecure Design, and Security Misconfiguration.'
      },
      {
        topic: 'SQL Injection (SQLi) & Database Extraction',
        detail: 'Exploit union-based, error-based, boolean-blind, and time-based SQL injection to bypass logins and exfiltrate database records.'
      },
      {
        topic: 'Cross-Site Scripting (XSS) & Session Hijacking',
        detail: 'Construct Reflected, Stored, and DOM-based XSS attack payloads to steal authenticated session cookies and execute unauthorized client actions.'
      },
      {
        topic: 'Burp Suite Professional Mastery',
        detail: 'Utilize the Intercepting Proxy, craft fuzzing wordlists in Intruder, dissect responses in Repeater, and detect out-of-band bugs with Collaborator.'
      },
      {
        topic: 'API Security & Broken Object Level Authorization (BOLA)',
        detail: 'Tamper with REST API parameter IDs to access unauthorized tenant objects, manipulate HTTP request headers, and test for mass assignment.'
      }
    ],
    practicalLab: {
      name: 'Lab 4: Black-Box Web Application Penetration Test',
      objective: 'Perform an ethical penetration test on a vulnerable online banking portal using Burp Suite Pro, exploit SQLi and XSS, and author remediation guides.'
    },
    tools: ['Burp Suite Pro', 'sqlmap', 'OWASP ZAP', 'Postman', 'Gobuster', 'FFUF'],
    certAlignment: 'OSCP (OffSec Certified Professional) / eJPT'
  },
  {
    id: 5,
    number: '05',
    days: 'Days 53 - 60',
    title: 'Enterprise Active Directory, Forensics & Capstone',
    subtitle: 'Domain Compromise, Host Forensics, Cloud Auditing & 48-Hour Live Cyber Range',
    levelId: 'advanced',
    levelName: 'Level 03: Advanced (Part 2)',
    pinColor: '#3b82f6', // Ocean Blue Pin
    pinBg: 'from-blue-500 to-indigo-600',
    pinShadow: 'shadow-blue-500/30',
    badgeClass: 'bg-blue-950/80 text-blue-400 border-blue-800',
    icon: 'fa-solid fa-flag-checkered',
    pinCoord: { x: 915, y: 70 }, // road bend 5
    briefSummary: 'Crack Active Directory Kerberos, conduct memory forensics, and complete the 48-hour live capstone.',
    elaboratedPoints: [
      {
        topic: 'Active Directory Security & Kerberos Exploitation',
        detail: 'Map domain trust topologies, execute Kerberoasting and AS-REP roasting, perform DCSync credential dumping, and forge Golden Tickets.'
      },
      {
        topic: 'Lateral Movement & Privilege Escalation',
        detail: 'Analyze domain attack paths using BloodHound graph theory, leverage Pass-the-Hash (PtH) techniques, and escalate to Domain Admin.'
      },
      {
        topic: 'Digital Forensics & Memory Analysis',
        detail: 'Capture volatile RAM artifacts with FTK Imager, analyze memory dumps with Volatility 3, extract injected DLLs, and reconstruct timelines.'
      },
      {
        topic: 'Cloud Security Architecture (AWS & Azure)',
        detail: 'Audit multi-cloud IAM permissions, identify over-privileged service roles, audit public S3 buckets, and configure CloudTrail logging.'
      },
      {
        topic: 'Malware Analysis & Reverse Engineering Fundamentals',
        detail: 'Perform static binary analysis (PE headers, imported strings) and dynamic behavioral sandboxing to extract C2 endpoints and mutexes.'
      },
      {
        topic: 'Capstone Security Project (48-Hour Live Cyber Range)',
        detail: 'Engage in a live simulated enterprise network: choose Red Team penetration testing or Blue Team SOC threat mitigation and submit an executive report.'
      }
    ],
    practicalLab: {
      name: 'Lab 5: 48-Hour Full Enterprise Cyber Range Capstone',
      objective: 'Execute end-to-end domain takeover or defend the corporate domain against simulated APT attacks, followed by delivering a professional security audit.'
    },
    tools: ['BloodHound', 'Mimikatz', 'Volatility 3', 'Ghidra', 'AWS IAM', 'Kali Linux'],
    certAlignment: 'OSCP / CRTP (Certified Red Team Professional) / GIAC GCIH'
  }
];

// Cybersecurity Career Roles & Salaries Data (From Presentation Slide)
const CAREER_SALARY_ROLES = [
  {
    roleNum: 'ROLE 01',
    title: 'SOC Analyst',
    salary: '4–8 LPA',
    period: 'per annum',
    team: 'blue',
    teamLabel: 'Blue Team (Defensive)',
    focus: 'Real-time telemetry monitoring, SIEM log analysis & security event triage'
  },
  {
    roleNum: 'ROLE 02',
    title: 'Security Analyst',
    salary: '5–10 LPA',
    period: 'per annum',
    team: 'blue',
    teamLabel: 'Blue Team (Defensive)',
    focus: 'Policy evaluation, access governance, threat hunting & endpoint hardening'
  },
  {
    roleNum: 'ROLE 03',
    title: 'Vulnerability Analyst',
    salary: '5–12 LPA',
    period: 'per annum',
    team: 'red',
    teamLabel: 'Red Team (Offensive)',
    focus: 'Automated vulnerability scanning, exploit verification & CVE risk scoring'
  },
  {
    roleNum: 'ROLE 04',
    title: 'Penetration Tester',
    salary: '6–15 LPA',
    period: 'per annum',
    team: 'red',
    teamLabel: 'Red Team (Offensive)',
    focus: 'Authorized ethical exploitation, network probing, web app hacking & shell acquisition'
  },
  {
    roleNum: 'ROLE 05',
    title: 'Incident Responder',
    salary: '7–15 LPA',
    period: 'per annum',
    team: 'blue',
    teamLabel: 'Blue Team (Defensive)',
    focus: 'Malware containment, memory forensics, chain-of-custody & crisis mitigation'
  },
  {
    roleNum: 'ROLE 06',
    title: 'Security Engineer',
    salary: '8–20 LPA',
    period: 'per annum',
    team: 'hybrid',
    teamLabel: 'Core Architecture',
    focus: 'Designing resilient firewall topologies, IAM architectures & automated security CI/CD pipelines'
  }
];

export default function App() {
  // Course Roadmap & Structured Curriculum State
  const [activeCheckpointId, setActiveCheckpointId] = useState(1);
  const [hoveredCheckpointId, setHoveredCheckpointId] = useState(null);
  const [isRoadmapTourPlaying, setIsRoadmapTourPlaying] = useState(false);
  const [isRoadmapSideWindowOpen, setIsRoadmapSideWindowOpen] = useState(false);

  // Career Roles & Salaries Filter & Theme State
  const [salaryFilter, setSalaryFilter] = useState('all'); // 'all' | 'red' | 'blue'
  const [salaryTheme, setSalaryTheme] = useState('dark'); // 'dark' | 'light'

  // Radware Live Threat Map In-Page Preview Toggle
  const [showLiveThreatMap, setShowLiveThreatMap] = useState(false);

  // 3D Flip Card States for Real-World News Cards
  const [flippedSafeguard, setFlippedSafeguard] = useState(false);
  const [flippedInfrastructure, setFlippedInfrastructure] = useState(false);

  // What We Offer View Theme State ('dark' | 'slide')
  const [offerTheme, setOfferTheme] = useState('dark');

  // Navigation & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  // Registration Form State
  const [regForm, setRegForm] = useState({ name: '', email: '', interest: 'both', consent: false });
  const [isRegistered, setIsRegistered] = useState(false);

  // Red vs Blue Team Toggle ('split' | 'red' | 'blue')
  const [teamView, setTeamView] = useState('split');

  // Interactive Simulators Tab ('nmap' | 'burp' | 'splunk')
  const [activeSim, setActiveSim] = useState('nmap');

  // Company Details Expandable Windows & Modal State
  const [expandedCards, setExpandedCards] = useState({});
  const [activeWindowModal, setActiveWindowModal] = useState(null);
  const [allWindowsExpanded, setAllWindowsExpanded] = useState(false);

  // Protected Assets Expandable State (Slide 02 / 11)
  const [expandedAssets, setExpandedAssets] = useState({});
  const [allAssetsExpanded, setAllAssetsExpanded] = useState(false);

  const toggleAssetExpansion = (assetId) => {
    setExpandedAssets(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };

  const toggleAllAssets = () => {
    const newState = !allAssetsExpanded;
    setAllAssetsExpanded(newState);
    const updated = {};
    CYBERSECURITY_ASSETS.forEach(a => {
      updated[a.id] = newState;
    });
    setExpandedAssets(updated);
    triggerToast(newState ? 'All protected asset details expanded.' : 'Protected asset details collapsed.');
  };

  // Helper to toggle single card expandable window
  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Helper to toggle all company windows
  const toggleAllCompanyWindows = () => {
    const newState = !allWindowsExpanded;
    setAllWindowsExpanded(newState);
    const updated = {};
    COMPANY_METRICS.forEach(m => {
      updated[m.id] = newState;
    });
    setExpandedCards(updated);
    triggerToast(newState ? 'All company windows expanded.' : 'All company windows collapsed.');
  };


  // --- NMAP SIMULATOR STATE ---
  const [nmapInput, setNmapInput] = useState('nmap -sV 192.168.1.105');
  const [nmapHistory, setNmapHistory] = useState([
    {
      type: 'system',
      content: 'Kali GNU/Linux Rolling release 2026.4\nType a command or click one of the preset scan options above to scan target 192.168.1.105 (Web & Database Server).'
    },
    {
      type: 'command',
      cmd: 'nmap -sV 192.168.1.105'
    },
    {
      type: 'output',
      scanType: 'service'
    }
  ]);
  const terminalEndRef = useRef(null);

  // --- BURP SUITE SIMULATOR STATE ---
  const defaultBurpReq = `POST /api/v1/user/profile HTTP/1.1
Host: api.fintechbank.lab
User-Agent: Mozilla/5.0 (Kali; Linux x86_64)
Authorization: Bearer eyJhbGciOi...TOKEN
Content-Type: application/json
Content-Length: 64

{
  "account_id": "90821",
  "role": "user",
  "allow_transfer_limit": 500
}`;

  const [burpRequest, setBurpRequest] = useState(defaultBurpReq);
  const [burpResponse, setBurpResponse] = useState(null);
  const [burpStatus, setBurpStatus] = useState({ text: 'Status: Waiting', color: 'bg-slate-800 text-slate-300' });

  // --- SPLUNK SIEM STATE ---
  const [splunkLogs, setSplunkLogs] = useState(INITIAL_LOGS);
  const [splunkFilter, setSplunkFilter] = useState('all');
  const [splunkQuery, setSplunkQuery] = useState('index="security" event_type="*" | stats count by status');
  const [socStatusBanner, setSocStatusBanner] = useState('Ready for triage');

  // Toast Trigger Helper
  const triggerToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3500);
  };


  // Scroll Terminal to bottom
  useEffect(() => {
    if (activeSim === 'nmap') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [nmapHistory, activeSim]);

  // Nmap Actions
  const runNmap = (cmdToRun) => {
    const cmd = cmdToRun || nmapInput.trim();
    if (!cmd) return;

    let scanType = 'default';
    if (cmd.includes('21,22') || cmd.includes('-p 21,22,80,443,3306')) {
      scanType = 'ports';
    } else if (cmd.includes('-A') || cmd.toLowerCase().includes('aggressive')) {
      scanType = 'aggressive';
    } else {
      scanType = 'service';
    }

    setNmapHistory(prev => [
      ...prev,
      { type: 'command', cmd },
      { type: 'output', scanType }
    ]);

    triggerToast('Nmap scan completed successfully.');
  };

  const clearNmap = () => {
    setNmapHistory([
      { type: 'system', content: '// Terminal screen cleared. Ready for scan commands.' }
    ]);
  };

  // Burp Tamper Actions
  const tamperBurp = (role) => {
    if (role === 'admin') {
      setBurpRequest(`POST /api/v1/user/profile HTTP/1.1
Host: api.fintechbank.lab
User-Agent: Mozilla/5.0 (Kali; Linux x86_64)
Authorization: Bearer eyJhbGciOi...TOKEN
Content-Type: application/json
Content-Length: 65

{
  "account_id": "90821",
  "role": "admin",
  "allow_transfer_limit": 500000
}`);
      triggerToast("Request tampered: role set to 'admin'");
    } else {
      setBurpRequest(defaultBurpReq);
      triggerToast("Request reset to standard user role");
    }
  };

  const sendBurp = () => {
    const isEscalated = burpRequest.includes('"role": "admin"') || burpRequest.includes("'admin'");
    if (isEscalated) {
      setBurpStatus({ text: 'HTTP/1.1 200 OK (ESCALATED)', color: 'bg-rose-950 text-rose-400 border border-rose-800' });
      setBurpResponse({
        escalated: true,
        date: 'Fri, 30 Oct 2026 12:00:00 GMT',
        limit: 500000,
        privilege: 'SYSTEM_ADMINISTRATOR'
      });
      triggerToast('Privilege escalation successful via parameter tampering!');
    } else {
      setBurpStatus({ text: 'HTTP/1.1 200 OK', color: 'bg-emerald-950 text-emerald-400 border border-emerald-800' });
      setBurpResponse({
        escalated: false,
        date: 'Fri, 30 Oct 2026 12:00:00 GMT',
        limit: 500,
        privilege: 'STANDARD_USER'
      });
      triggerToast('Standard HTTP 200 Response received.');
    }
  };

  // Splunk Actions
  const handleFilterSplunk = (filter) => {
    setSplunkFilter(filter);
    if (filter === 'all') {
      setSplunkQuery('index="security" event_type="*" | table timestamp, severity, signature, src_ip');
    } else {
      setSplunkQuery(`index="security" severity="${filter}" | sort - timestamp`);
    }
  };

  const blockIp = (logId, ip) => {
    setSplunkLogs(prev => prev.map(item => item.id === logId ? { ...item, status: 'blocked' } : item));
    setSocStatusBanner(`Firewall Rule Created: Dropped all packets from ${ip}`);
    triggerToast(`Threat neutralized: IP ${ip} blacklisted in border firewall.`);
  };

  // Close modal and side window on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isRoadmapSideWindowOpen) setIsRoadmapSideWindowOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoadmapSideWindowOpen]);

  // Auto-advance course roadmap tour
  useEffect(() => {
    let timer;
    if (isRoadmapTourPlaying) {
      timer = setInterval(() => {
        setActiveCheckpointId(prev => (prev >= 5 ? 1 : prev + 1));
      }, 3800);
    }
    return () => clearInterval(timer);
  }, [isRoadmapTourPlaying]);

  // Active or Hovered Roadmap Checkpoint
  const currentCheckpoint = ROADMAP_CHECKPOINTS.find(cp => cp.id === (hoveredCheckpointId || activeCheckpointId)) || ROADMAP_CHECKPOINTS[0];

  // Registration Form Submit
  const handleRegistration = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    triggerToast(`Registration verified for ${regForm.name}! Check inbox.`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredLogs = splunkFilter === 'all'
    ? splunkLogs
    : splunkLogs.filter(l => l.level === splunkFilter);

  return (
    <div className="bg-cyber-dark text-slate-200 font-sans antialiased selection:bg-cyan-500 selection:text-black min-h-screen relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800/80 p-1 flex items-center justify-center shadow-md shadow-rose-500/10">
              <img
                src={peopleClickLogo}
                alt="People Click Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-mono font-bold tracking-wider text-white text-base">PEOPLE<span className="text-rose-500">CLICK</span></span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-rose-950/50 text-rose-400 border border-rose-800/60">CYBER SECURITY</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-slate-300">
            <a href="#roadmap" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-map-location-dot text-rose-500 text-xs"></i>
              Course Roadmap
            </a>
            <a href="#teams" className="hover:text-rose-400 transition-colors">Red vs Blue</a>
            <a href="#salaries" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-arrow-trend-up text-rose-500 text-xs"></i>
              Roles &amp; Salaries
            </a>
            <a href="#threats" className="hover:text-rose-400 transition-colors flex items-center gap-1.5"><i className="fa-solid fa-shield-halved text-rose-500 text-xs"></i>Threat Vectors</a>
            <a href="#simulators" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Interactive Simulators
            </a>
            <a href="#offerings" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
              <i className="fa-solid fa-gift text-rose-500 text-xs"></i>
              What We Offer
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 cyber-grid overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Think Like a Hacker.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-rose-500">
                Cybersecurity Foundations &amp; Roadmap
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed max-w-3xl mx-auto">
              Demystify Computer Networking, Linux Server Administration, and Threat Landscapes. Discover whether your passion lies in{' '}
              <span className="text-rose-400 font-semibold font-mono">Red Team Offensive Hacking</span> or{' '}
              <span className="text-cyan-400 font-semibold font-mono">Blue Team Threat Defense</span> through real-world simulations.
            </p>

            {/* Hero CTAs */}
            <div className="flex items-center justify-center">
              <a
                href="#simulators"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5"
              >
                <i className="fa-solid fa-terminal text-emerald-400"></i> Try Interactive Tools
              </a>
            </div>

            {/* Host Organization & Company Details Div */}
            <div className="mt-14 max-w-5xl mx-auto space-y-8 text-left">
              {/* COMPANY DETAILS CONTAINER DIV */}
              <div className="glass-panel-elevated rounded-3xl border border-rose-500/30 hover:border-rose-500/60 transition-all duration-300 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-rose-950/25 group">
                {/* Background Ambient Glows */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Deck Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-white uppercase">
                      PEOPLECLICK LEARNING
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-semibold uppercase tracking-wider">
                      Global Education Firm
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAllCompanyWindows}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-slate-800 hover:border-rose-500/40 transition flex items-center gap-1.5 shadow-sm"
                      title={allWindowsExpanded ? "Collapse all window details" : "Expand all window details"}
                    >
                      <i className={`fa-solid ${allWindowsExpanded ? 'fa-compress' : 'fa-expand'} text-[10px]`}></i>
                      <span className="hidden sm:inline">{allWindowsExpanded ? 'Collapse Windows' : 'Expand All Windows'}</span>
                    </button>
                    <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      04 / 11
                    </span>
                  </div>
                </div>

                {/* Header & Award Badge Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
                  <div className="lg:col-span-8">
                    <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> ABOUT US
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1 mb-3">
                      About Peopleclick Learning
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Peopleclick Learning is an <strong className="text-white font-semibold">award-winning, global, professional education firm</strong> providing human talent solutions including <span className="text-rose-400 font-medium"> training, and upskilling</span>. For over 25 years, we have been empowering students through quality education, practical training, and career-focused learning.
                    </p>
                  </div>

                  {/* Award-Winning Badge Card */}
                  <div className="lg:col-span-4 self-center">
                    <div className="border-l-4 border-rose-500 bg-rose-950/30 hover:bg-rose-950/50 p-4 rounded-r-2xl border-y border-r border-rose-900/40 flex items-center gap-3.5 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-rose-950/20 group/award">
                      <div className="w-10 h-10 rounded-xl bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-500 shrink-0 group-hover/award:rotate-12 transition-transform">
                        <i className="fa-solid fa-crown text-lg"></i>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase block">
                          AWARD-WINNING
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white block leading-snug">
                          Global professional education firm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Metric Cards with Expandable Windows & Hover Effects */}
                <div>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-window-maximize text-rose-400"></i>
                      Interactive Windows: Click any card below to expand details
                    </span>
                    <span className="text-[10px] font-mono text-rose-400/80">
                      {Object.values(expandedCards).filter(Boolean).length} / {COMPANY_METRICS.length} Expanded
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {COMPANY_METRICS.map((metric) => {
                      const isExpanded = !!expandedCards[metric.id];
                      return (
                        <div
                          key={metric.id}
                          className={`glass-panel rounded-2xl border transition-all duration-300 flex flex-col justify-between group/card relative overflow-hidden ${isExpanded
                            ? 'border-rose-500/80 bg-slate-900/90 shadow-xl shadow-rose-950/40'
                            : 'border-slate-800/90 hover:border-rose-500/60 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-950/30'
                            }`}
                        >
                          {/* Ambient Card Glow */}
                          <div className="absolute -top-12 -right-12 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover/card:bg-rose-500/15 transition-all pointer-events-none"></div>

                          {/* Card Main View */}
                          <div
                            onClick={() => toggleCardExpansion(metric.id)}
                            className="p-5 cursor-pointer select-none"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <i className={`${metric.icon} text-2xl text-rose-500 group-hover/card:scale-110 transition-transform duration-300`}></i>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveWindowModal(metric);
                                  }}
                                  className="w-6 h-6 rounded-md bg-slate-950/80 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-700/60 text-slate-400 hover:text-rose-300 flex items-center justify-center text-[10px] transition"
                                  title="Open Pop-out Window Modal"
                                >
                                  <i className="fa-solid fa-up-right-from-square"></i>
                                </button>
                                <span
                                  className={`w-6 h-6 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 flex items-center justify-center text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-rose-400 border-rose-800' : 'group-hover/card:text-rose-400'
                                    }`}
                                >
                                  <i className="fa-solid fa-chevron-down"></i>
                                </span>
                              </div>
                            </div>

                            <div className="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight group-hover/card:text-rose-400 transition-colors">
                              {metric.stat}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">
                              {metric.label}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {metric.sublabel}
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                              <span className="text-slate-500 group-hover/card:text-rose-400 transition-colors flex items-center gap-1">
                                <i className="fa-solid fa-circle-info text-[9px]"></i> {isExpanded ? 'Click to minimize' : 'Click to expand'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[9px]">
                                {metric.tag}
                              </span>
                            </div>
                          </div>

                          {/* EXPANDABLE WINDOW DRAWER */}
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-1 border-t border-rose-900/50 bg-slate-950/90 animate-window-expand">
                              {/* Window Title Bar */}
                              <div className="flex items-center justify-between py-1.5 mb-2.5 border-b border-slate-800/80 text-[10px] font-mono">
                                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                  WINDOW: {metric.id.toUpperCase()}_DETAILS
                                </span>
                                <span className="text-slate-500">LIVE DATA</span>
                              </div>

                              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                                {metric.expandedInfo.headline}
                              </p>

                              {/* Highlight Stats Grid */}
                              <div className="grid grid-cols-2 gap-1.5 mb-3">
                                {metric.expandedInfo.highlights.map((h, i) => (
                                  <div key={i} className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
                                    <div className="text-[9px] font-mono text-slate-400 leading-tight">{h.label}</div>
                                    <div className="text-[11px] font-mono font-bold text-rose-300">{h.val}</div>
                                  </div>
                                ))}
                              </div>

                              {/* Bullet Details */}
                              <ul className="space-y-1 mb-3 text-[10px] text-slate-400">
                                {metric.expandedInfo.points.map((p, i) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <i className="fa-solid fa-caret-right text-rose-400 text-[9px] mt-0.5 shrink-0"></i>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>

                              {/* Window Actions */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono">
                                <button
                                  type="button"
                                  onClick={() => setActiveWindowModal(metric)}
                                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                >
                                  <i className="fa-solid fa-up-right-and-down-left-from-center text-[9px]"></i> Pop-out Window
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleCardExpansion(metric.id)}
                                  className="text-slate-400 hover:text-rose-400"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>


                {/* Tagline & Assurance Footer */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                  <div className="text-slate-400 flex items-center gap-2">
                    <i className="fa-solid fa-circle-check text-rose-400 text-sm"></i>
                    <span>ISO 9001:2015 Accredited • 25+ Years Proven Talent Solutions</span>
                  </div>
                  <div className="italic font-serif text-slate-300 text-sm sm:text-base tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Learn Today. Lead Tomorrow.
                  </div>
                </div>
              </div>
            </div>

            {/* Core Principles of Cybersecurity Div (Slide 02 / 11) */}
            <div className="mt-14 max-w-5xl mx-auto space-y-6 text-left">
              {/* WHAT IS CYBERSECURITY CONTAINER DIV */}
              <div className="glass-panel-elevated rounded-3xl border border-rose-500/30 hover:border-rose-500/60 transition-all duration-300 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-rose-950/25 group">
                {/* Background Ambient Glows */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all duration-500"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Deck Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-white uppercase">
                      PEOPLECLICK LEARNING
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 font-semibold uppercase tracking-wider">
                      Core Foundations
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAllAssets}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-slate-800 hover:border-rose-500/40 transition flex items-center gap-1.5 shadow-sm"
                      title={allAssetsExpanded ? "Collapse all asset details" : "Expand all asset details"}
                    >
                      <i className={`fa-solid ${allAssetsExpanded ? 'fa-compress' : 'fa-expand'} text-[10px]`}></i>
                      <span className="hidden sm:inline">{allAssetsExpanded ? 'Collapse Details' : 'Expand All Details'}</span>
                    </button>
                    <span className="font-mono text-xs font-semibold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      02 / 11
                    </span>
                  </div>
                </div>

                {/* Main Content Layout: Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Definition, Quote, and Cybersecurity Protects */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> INTRODUCTION
                      </span>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-1 mb-5">
                        What is Cybersecurity?
                      </h2>

                      {/* Quotation block with effects */}
                      <div className="relative pl-5 border-l-2 border-rose-500/50 mb-5">
                        <i className="fa-solid fa-quote-left text-2xl text-rose-500/30 mb-2 block"></i>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic font-serif">
                          Cybersecurity is the comprehensive practice of safeguarding digital systems, networks, and data from malicious attacks, unauthorized access, and cyber threats through strategic defense mechanisms and advanced security protocols.
                        </p>
                      </div>

                      {/* Red Accent Separator */}
                      <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-red-600 rounded-full my-5"></div>

                      {/* Subheading: CYBERSECURITY PROTECTS */}
                      <div>
                        <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase block mb-2">
                          CYBERSECURITY PROTECTS:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                          Every modern organization — from startups to governments — depends on cybersecurity professionals to defend its most critical digital assets and trust.
                        </p>
                      </div>
                    </div>

                    {/* Quick Core Pillar Highlights */}
                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-rose-300">
                        <i className="fa-solid fa-lock text-[9px] mr-1"></i> Confidentiality
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                        <i className="fa-solid fa-shield text-[9px] mr-1"></i> Integrity
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                        <i className="fa-solid fa-bolt text-[9px] mr-1"></i> Availability
                      </span>

                    </div>
                  </div>

                  {/* Right Column: 6 Protected Asset Cards (2 Columns) */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center justify-between mb-3 px-1 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-shield-cat text-rose-400"></i>
                        Critical Protected Assets (Click to inspect threat &amp; defense controls)
                      </span>
                      <span className="text-[10px] text-rose-400">
                        6 Key Domains
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {CYBERSECURITY_ASSETS.map((asset) => {
                        const isExpanded = allAssetsExpanded || !!expandedAssets[asset.id];
                        return (
                          <div
                            key={asset.id}
                            onClick={() => toggleAssetExpansion(asset.id)}
                            className={`group/asset p-4 rounded-2xl glass-panel border cursor-pointer select-none transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${isExpanded
                              ? 'border-rose-500/80 bg-slate-900/90 shadow-xl shadow-rose-950/40 ring-1 ring-rose-500/40'
                              : 'border-slate-800/90 hover:border-rose-500/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-950/30'
                              }`}
                          >
                            {/* Card Ambient Glow */}
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-rose-500/5 rounded-full blur-lg group-hover/asset:bg-rose-500/15 transition-all pointer-events-none"></div>

                            <div>
                              <div className="flex items-center justify-between mb-2.5">
                                <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 group-hover/asset:border-rose-500/40 flex items-center justify-center text-rose-500 shrink-0 transition-transform duration-300 group-hover/asset:scale-110 shadow-md shadow-rose-950/20">
                                  <i className={`${asset.icon} text-lg`}></i>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono text-slate-500 group-hover/asset:text-rose-400 transition-colors">
                                    {isExpanded ? 'Collapse' : 'Inspect'}
                                  </span>
                                  <i className={`fa-solid fa-chevron-down text-[10px] text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-rose-400' : 'group-hover/asset:text-rose-400'
                                    }`}></i>
                                </div>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-white group-hover/asset:text-rose-300 transition-colors">
                                {asset.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                                {asset.sublabel}
                              </p>
                            </div>

                            {/* EXPANDABLE INSPECTION DRAWER */}
                            {isExpanded ? (
                              <div className="mt-3 pt-2.5 border-t border-rose-900/50 text-[10px] space-y-1.5 animate-window-expand">
                                <div className="text-slate-300">
                                  <span className="font-mono text-rose-400 font-semibold">Scope: </span>
                                  {asset.scope}
                                </div>
                                <div className="text-slate-400">
                                  <span className="font-mono text-amber-400 font-semibold">Threat: </span>
                                  {asset.threat}
                                </div>
                                <div className="text-slate-400">
                                  <span className="font-mono text-emerald-400 font-semibold">Defense: </span>
                                  {asset.defense}
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                                <span>Click to inspect controls</span>
                                <i className="fa-solid fa-arrow-right text-[9px] group-hover/asset:translate-x-1 transition-transform text-rose-500"></i>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Tagline Strip */}
                <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                  <div className="text-slate-400 flex items-center gap-2">
                    <i className="fa-solid fa-shield-halved text-rose-400 text-sm"></i>
                    <span>Protecting Digital Assets Across Enterprise, Cloud &amp; Government Frontiers</span>
                  </div>
                  <div className="italic font-serif text-slate-300 text-sm sm:text-base tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Learn Today. Lead Tomorrow.
                  </div>
                </div>
              </div>

              {/* WHY CYBERSECURITY IS IMPORTANT IN TODAY'S DIGITAL WORLD */}
              <div className="glass-panel-elevated rounded-3xl border border-rose-500/25 hover:border-rose-500/40 transition-all duration-300 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl shadow-rose-950/20 group">
                {/* Background Ambient Glows */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/15 transition-all duration-500"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500"></div>

                {/* Top Header Deck */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-5">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
                      <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        CRITICAL IMPERATIVE IN TODAY'S DIGITAL WORLD
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                      Why Cybersecurity is Important in Today's Digital World
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                      Our modern society relies completely on digital networks — from healthcare and banking to energy grids and cloud ecosystems. Explore the 5 foundational pillars that make cybersecurity the #1 defense frontier today.
                    </p>
                  </div>

                  {/* Clean Pillar Badge */}
                  <div className="shrink-0 self-start sm:self-center">
                    <span className="inline-flex items-center gap-2 text-xs font-mono text-rose-300 bg-rose-950/70 px-3.5 py-1.5 rounded-xl border border-rose-800/60 font-semibold shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      5 Essential Defense Pillars
                    </span>
                  </div>
                </div>

                {/* 5 Core Points Grid (Clean, Clear & Fixed Height - No Layout Shifting on Hover) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5">
                  {CYBERSECURITY_IMPORTANCE_POINTS.map((point, index) => {
                    // Symmetric responsive column spans for 5 cards: 3 on row 1 (col-span-2 each), 2 on row 2 (col-span-3 each)
                    const colSpanClass = index < 3 ? 'lg:col-span-2' : (index === 4 ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-1 lg:col-span-3');

                    // Color theme mappings
                    const colorThemes = {
                      rose: {
                        border: 'hover:border-rose-500/70 border-slate-800/90',
                        glow: 'group-hover/pt:bg-rose-500/10',
                        iconBox: 'text-rose-400 group-hover/pt:border-rose-500/50 group-hover/pt:text-rose-300',
                        badge: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
                        defenseTag: 'text-rose-400'
                      },
                      cyan: {
                        border: 'hover:border-cyan-500/70 border-slate-800/90',
                        glow: 'group-hover/pt:bg-cyan-500/10',
                        iconBox: 'text-cyan-400 group-hover/pt:border-cyan-500/50 group-hover/pt:text-cyan-300',
                        badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
                        defenseTag: 'text-cyan-400'
                      },
                      amber: {
                        border: 'hover:border-amber-500/70 border-slate-800/90',
                        glow: 'group-hover/pt:bg-amber-500/10',
                        iconBox: 'text-amber-400 group-hover/pt:border-amber-500/50 group-hover/pt:text-amber-300',
                        badge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
                        defenseTag: 'text-amber-400'
                      },
                      emerald: {
                        border: 'hover:border-emerald-500/70 border-slate-800/90',
                        glow: 'group-hover/pt:bg-emerald-500/10',
                        iconBox: 'text-emerald-400 group-hover/pt:border-emerald-500/50 group-hover/pt:text-emerald-300',
                        badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
                        defenseTag: 'text-emerald-400'
                      },
                      indigo: {
                        border: 'hover:border-indigo-500/70 border-slate-800/90',
                        glow: 'group-hover/pt:bg-indigo-500/10',
                        iconBox: 'text-indigo-400 group-hover/pt:border-indigo-500/50 group-hover/pt:text-indigo-300',
                        badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
                        defenseTag: 'text-indigo-400'
                      }
                    };

                    const theme = colorThemes[point.badgeColor] || colorThemes.rose;

                    if (point.id === 'safeguards_sensitive_data') {
                      return (
                        <div
                          key={point.id}
                          className={`group/pt perspective-1000 ${colSpanClass} h-full min-h-[300px]`}
                        >
                          <div
                            className={`w-full h-full transform-style-3d transition-transform duration-700 relative ${
                              flippedSafeguard ? 'rotate-y-180' : ''
                            }`}
                          >
                            {/* FRONT FACE (Point 01: Safeguards Sensitive Data) */}
                            <div
                              className={`w-full h-full backface-hidden p-5 sm:p-6 rounded-2xl glass-panel border transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-xl hover:bg-slate-900/95 ${theme.border}`}
                            >
                              {/* Ambient Card Glow */}
                              <div
                                className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-xl transition-all duration-500 pointer-events-none opacity-20 group-hover/pt:opacity-100 ${theme.glow}`}
                              ></div>

                              <div>
                                {/* Point Number, Badge & Flip Action */}
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xs font-mono font-black tracking-wider text-slate-400 group-hover/pt:text-white flex items-center gap-1.5 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                    POINT {point.number}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300 shadow-sm ${theme.badge}`}
                                    >
                                      {point.badge}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setFlippedSafeguard(true)}
                                      title="Flip card to read real-world Times of India attack report"
                                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 hover:border-rose-400 transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                                    >
                                      <i className="fa-solid fa-newspaper text-[9px] text-rose-400"></i>
                                      <span>SBI Breach</span>
                                      <i className="fa-solid fa-arrows-rotate text-[8px]"></i>
                                    </button>
                                  </div>
                                </div>

                                {/* Icon and Title */}
                                <div className="flex items-start gap-3.5 mb-3">
                                  <div
                                    className={`w-11 h-11 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/pt:scale-110 shadow-md ${theme.iconBox}`}
                                  >
                                    <i className={`${point.icon} text-lg`}></i>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm sm:text-base font-bold text-white group-hover/pt:text-cyan-200 transition-colors leading-snug">
                                      {point.title}
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                      {point.stat}
                                    </span>
                                  </div>
                                </div>

                                {/* Clear Core Description */}
                                <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-4">
                                  {point.summary}
                                </p>
                              </div>

                              {/* Clean Static Key Defense Pillar + Trigger to Flip */}
                              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                                  <i className="fa-solid fa-shield-halved text-[9px] text-cyan-400"></i> Key Defense:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setFlippedSafeguard(true)}
                                  className="text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 group/btn cursor-pointer transition-colors"
                                >
                                  <span>Real TOI Case Study</span>
                                  <i className="fa-solid fa-arrow-right text-[9px] group-hover/btn:translate-x-0.5 transition-transform"></i>
                                </button>
                              </div>
                            </div>

                            {/* BACK FACE (Times of India Breaking News: SBI Data Breach Claim) */}
                            <div
                              className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-5 sm:p-6 rounded-2xl glass-panel-elevated border border-rose-500/70 bg-slate-950/95 flex flex-col justify-between shadow-2xl overflow-hidden"
                            >
                              {/* Ambient Red Glow */}
                              <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-500/20 rounded-full blur-xl pointer-events-none"></div>

                              <div>
                                {/* Top Bar: Breaking Badge, Source & Flip Back */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 animate-pulse shadow-sm">
                                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                      BREAKING NEWS
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                                      The Times of India
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setFlippedSafeguard(false)}
                                    title="Flip back to Safeguards Sensitive Data"
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <span>Back</span>
                                    <i className="fa-solid fa-rotate-left text-[9px]"></i>
                                  </button>
                                </div>

                                {/* Article Headline */}
                                <h4 className="text-sm font-bold text-white leading-snug hover:text-rose-200 transition-colors">
                                  Hacker group claims access to 3.8 lakh SBI data entries
                                </h4>

                                {/* Report Highlights & Security Takeaway */}
                                <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] leading-relaxed text-slate-300">
                                  <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono text-rose-400 font-bold">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <span>REAL-WORLD THREAT IMPACT</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300">
                                    Threat actors claim unauthorized exfiltration of <strong className="text-white">380,000+ sensitive customer records</strong> from India's largest bank — proving why zero-trust encryption and data safeguarding are non-negotiable.
                                  </p>
                                </div>
                              </div>

                              {/* Footer Action Links */}
                              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                                <a
                                  href="https://timesofindia.indiatimes.com/business/india-business/hacker-group-claims-access-to-3-8-lakh-sbi-data-entries/articleshow/135076898.cms"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold transition-colors group/link"
                                >
                                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                                  <span className="underline underline-offset-2">Read on TOI</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setFlippedSafeguard(false)}
                                  className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                                >
                                  <span>Return to Card</span>
                                  <i className="fa-solid fa-arrows-rotate text-[9px]"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (point.id === 'protects_critical_infrastructure') {
                      return (
                        <div
                          key={point.id}
                          className={`group/pt perspective-1000 ${colSpanClass} h-full min-h-[300px]`}
                        >
                          <div
                            className={`w-full h-full transform-style-3d transition-transform duration-700 relative ${
                              flippedInfrastructure ? 'rotate-y-180' : ''
                            }`}
                          >
                            {/* FRONT FACE (Point 03: Protects Critical Infrastructure) */}
                            <div
                              className={`w-full h-full backface-hidden p-5 sm:p-6 rounded-2xl glass-panel border transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-xl hover:bg-slate-900/95 ${theme.border}`}
                            >
                              {/* Ambient Card Glow */}
                              <div
                                className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-xl transition-all duration-500 pointer-events-none opacity-20 group-hover/pt:opacity-100 ${theme.glow}`}
                              ></div>

                              <div>
                                {/* Point Number, Badge & Flip Action */}
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-xs font-mono font-black tracking-wider text-slate-400 group-hover/pt:text-white flex items-center gap-1.5 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                    POINT {point.number}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300 shadow-sm ${theme.badge}`}
                                    >
                                      {point.badge}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setFlippedInfrastructure(true)}
                                      title="Flip card to read real-world BBC infrastructure cyber attack report"
                                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1 cursor-pointer animate-pulse"
                                    >
                                      <i className="fa-solid fa-newspaper text-[9px] text-amber-400"></i>
                                      <span>BBC Attack</span>
                                      <i className="fa-solid fa-arrows-rotate text-[8px]"></i>
                                    </button>
                                  </div>
                                </div>

                                {/* Icon and Title */}
                                <div className="flex items-start gap-3.5 mb-3">
                                  <div
                                    className={`w-11 h-11 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/pt:scale-110 shadow-md ${theme.iconBox}`}
                                  >
                                    <i className={`${point.icon} text-lg`}></i>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm sm:text-base font-bold text-white group-hover/pt:text-amber-200 transition-colors leading-snug">
                                      {point.title}
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                      {point.stat}
                                    </span>
                                  </div>
                                </div>

                                {/* Clear Core Description */}
                                <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-4">
                                  {point.summary}
                                </p>
                              </div>

                              {/* Clean Static Key Defense Pillar + Trigger to Flip */}
                              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                                <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                                  <i className="fa-solid fa-shield-halved text-[9px] text-amber-400"></i> Key Defense:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setFlippedInfrastructure(true)}
                                  className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 group/btn cursor-pointer transition-colors"
                                >
                                  <span>Real BBC Case Study</span>
                                  <i className="fa-solid fa-arrow-right text-[9px] group-hover/btn:translate-x-0.5 transition-transform"></i>
                                </button>
                              </div>
                            </div>

                            {/* BACK FACE (BBC News: French Supermarket Fridges Hit by Cyber Attack) */}
                            <div
                              className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-5 sm:p-6 rounded-2xl glass-panel-elevated border border-amber-500/70 bg-slate-950/95 flex flex-col justify-between shadow-2xl overflow-hidden"
                            >
                              {/* Ambient Amber Glow */}
                              <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/20 rounded-full blur-xl pointer-events-none"></div>

                              <div>
                                {/* Top Bar: Breaking Badge, Source & Flip Back */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1 animate-pulse shadow-sm">
                                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                      BBC NEWS
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                                      Critical OT Sabotage
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setFlippedInfrastructure(false)}
                                    title="Flip back to Protects Critical Infrastructure"
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <span>Back</span>
                                    <i className="fa-solid fa-rotate-left text-[9px]"></i>
                                  </button>
                                </div>

                                {/* Article Headline */}
                                <h4 className="text-sm font-bold text-white leading-snug hover:text-amber-200 transition-colors">
                                  Fridges in French supermarkets hit by cyber attack
                                </h4>

                                {/* Report Highlights & Security Takeaway */}
                                <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] leading-relaxed text-slate-300">
                                  <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono text-amber-400 font-bold">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <span>PHYSICAL OT INFRASTRUCTURE IMPACT</span>
                                  </div>
                                  <p className="text-[11px] text-slate-300">
                                    Hackers sabotaged refrigeration across hundreds of stores overnight, spoiling <strong className="text-white">millions of euros in food</strong>. Real-world proof of why physical OT, SCADA, and cold-chain supply systems require rigorous cybersecurity.
                                  </p>
                                </div>
                              </div>

                              {/* Footer Action Links */}
                              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                                <a
                                  href="https://www.bbc.com/news/articles/crq5nzxv9q4yo"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors group/link"
                                >
                                  <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                                  <span className="underline underline-offset-2">Read on BBC</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setFlippedInfrastructure(false)}
                                  className="text-slate-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                                >
                                  <span>Return to Card</span>
                                  <i className="fa-solid fa-arrows-rotate text-[9px]"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={point.id}
                        className={`group/pt p-5 sm:p-6 rounded-2xl glass-panel border transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:bg-slate-900/95 ${colSpanClass} ${theme.border}`}
                      >
                        {/* Ambient Card Glow on Hover */}
                        <div
                          className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-xl transition-all duration-500 pointer-events-none opacity-20 group-hover/pt:opacity-100 ${theme.glow}`}
                        ></div>

                        <div>
                          {/* Point Number and Impact Metric Badges */}
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-mono font-black tracking-wider text-slate-400 group-hover/pt:text-white flex items-center gap-1.5 transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              POINT {point.number}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border transition-all duration-300 shadow-sm ${theme.badge}`}
                            >
                              {point.badge}
                            </span>
                          </div>

                          {/* Icon and Title */}
                          <div className="flex items-start gap-3.5 mb-3">
                            <div
                              className={`w-11 h-11 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/pt:scale-110 shadow-md ${theme.iconBox}`}
                            >
                              <i className={`${point.icon} text-lg`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base font-bold text-white group-hover/pt:text-rose-200 transition-colors leading-snug">
                                {point.title}
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                {point.stat}
                              </span>
                            </div>
                          </div>

                          {/* Clear Core Description */}
                          <p className="text-xs text-slate-300 leading-relaxed mt-2 mb-4">
                            {point.summary}
                          </p>
                        </div>

                        {/* Clean Static Key Defense Pillar (Always visible, stable, no expansion) */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px] font-mono">
                          <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                            <i className="fa-solid fa-shield-halved text-[9px] text-cyan-400"></i> Key Defense:
                          </span>
                          <span className="text-cyan-300 font-semibold truncate text-right">
                            {point.defense}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Global Cybersecurity Stats Ticker */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/40 transition-colors">
                    <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono block">
                      3.5M+
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block mt-0.5">
                      Unfilled Cyber Jobs Globally
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                    <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono block">
                      $10.5T
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block mt-0.5">
                      Annual Cybercrime Damage (2025)
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
                    <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono block">
                      99.99%
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block mt-0.5">
                      Business Continuity Defense
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">
                      100%
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block mt-0.5">
                      Regulatory &amp; Trust Compliance
                    </span>
                  </div>
                </div>
              </div>

              {/* REAL-WORLD CYBERCRIME THREAT VECTORS */}
              <div id="threats" className="glass-panel-elevated rounded-3xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-rose-950/20">
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-400 border border-rose-800/60 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Real-World Cybercrime Threat Vectors
                    </span>
                    <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
                      6 Critical Vectors Confronting Global Organizations
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <i className="fa-solid fa-shield-halved text-rose-400"></i>
                    <span>Threat Intelligence &amp; Vector Profiles</span>
                  </div>
                </div>

                {/* 6 Cybercrime Threat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {REAL_WORLD_CRIMES.map((crime) => (
                    <div
                      key={crime.id}
                      className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-rose-500/50 hover:bg-slate-900/95 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-950/20"
                    >
                      <div>
                        {/* Category & Impact Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                            {crime.category}
                          </span>
                          <span className="text-[10px] font-mono text-rose-400 font-semibold px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-900/50 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> {crime.badge}
                          </span>
                        </div>

                        {/* Icon & Title */}
                        <div className="flex items-start gap-3.5 my-2.5">
                          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-400 text-lg shrink-0 group-hover:scale-105 group-hover:border-rose-500/50 transition-all shadow-md">
                            <i className={crime.icon}></i>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors leading-snug">
                              {crime.title}
                            </h4>
                            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                              {crime.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Brief Description */}
                        <p className="text-xs text-slate-300 leading-relaxed mt-3 mb-4">
                          {crime.desc}
                        </p>
                      </div>

                      {/* Brief Key Details Footer */}
                      <div className="pt-3.5 border-t border-slate-800/80 space-y-2 text-[11px] font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <i className="fa-solid fa-crosshairs text-[10px] text-rose-400"></i> Primary Target:
                          </span>
                          <span className="text-slate-300 font-medium text-right truncate max-w-[58%]">
                            {crime.target}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <i className="fa-solid fa-shield-halved text-[10px] text-cyan-400"></i> Core Defense:
                          </span>
                          <span className="text-cyan-400 font-medium text-right truncate max-w-[58%]">
                            {crime.defense}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* RADWARE LIVE CYBER THREAT MAP LINK & RADAR PANEL */}
                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-cyan-950/40 border border-rose-500/40 hover:border-rose-500/70 transition-all duration-300 shadow-xl shadow-rose-950/20 relative overflow-hidden group">
                    {/* Ambient Glow */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all"></div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-rose-950/90 text-rose-400 border border-rose-800/80 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                            LIVE RADAR TELEMETRY
                          </span>
                          <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            RADWARE GLOBAL THREAT CLOUD
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                          <i className="fa-solid fa-satellite-dish text-rose-500"></i>
                          <span>Global Live Cyber Threat Map</span>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          Witness live cyber warfare in real time. Track volumetric DDoS attacks, automated botnet surges, and active attack vectors targeting organizations across 190+ countries worldwide.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <i className="fa-solid fa-link text-rose-400 text-[11px]"></i> Direct Live Link:
                          </span>
                          <a
                            href="https://livethreatmap.radware.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-400 hover:text-rose-300 underline font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <span>https://livethreatmap.radware.com/</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                          </a>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
                        <a
                          href="https://livethreatmap.radware.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
                        >
                          <i className="fa-solid fa-globe text-sm"></i>
                          <span>Launch Live Threat Map</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-[11px] group-hover/btn:translate-x-0.5 transition-transform"></i>
                        </a>

                        <button
                          onClick={() => setShowLiveThreatMap(!showLiveThreatMap)}
                          className="px-4 py-3 rounded-xl font-mono text-xs font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 hover:text-white border border-slate-700/80 hover:border-cyan-500/50 transition flex items-center justify-center gap-2"
                        >
                          <i className={`fa-solid ${showLiveThreatMap ? 'fa-compress' : 'fa-display text-cyan-400'}`}></i>
                          <span>{showLiveThreatMap ? 'Hide In-Page Map' : 'Preview Live Map Here'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Embedded Radar View */}
                    {showLiveThreatMap && (
                      <div className="mt-6 pt-5 border-t border-slate-800/80 animate-window-expand">
                        <div className="flex items-center justify-between py-2 px-3 bg-slate-950 rounded-t-xl border-t border-x border-slate-800 text-xs font-mono text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span className="text-white font-semibold">Live Feed: https://livethreatmap.radware.com/</span>
                          </div>
                          <a
                            href="https://livethreatmap.radware.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                          >
                            <span>Open In Full Window</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                          </a>
                        </div>
                        <div className="w-full h-[540px] rounded-b-xl border border-slate-800 overflow-hidden bg-slate-950 relative">
                          <iframe
                            src="https://livethreatmap.radware.com/"
                            title="Radware Live Threat Map"
                            className="w-full h-full border-0"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <i className="fa-solid fa-network-wired text-cyan-400 text-lg mb-1"></i>
                <span className="text-xs font-semibold text-slate-200">TCP/IP &amp; OSI Mastery</span>
                <span className="text-[11px] text-slate-500">Wireshark &amp; Packet Anatomy</span>
              </div>
              <div className="flex flex-col items-center">
                <i className="fa-brands fa-linux text-amber-400 text-lg mb-1"></i>
                <span className="text-xs font-semibold text-slate-200">Server &amp; Linux Security</span>
                <span className="text-[11px] text-slate-500">SSH, Active Directory &amp; ACLs</span>
              </div>
              <div className="flex flex-col items-center">
                <i className="fa-solid fa-crosshairs text-rose-400 text-lg mb-1"></i>
                <span className="text-xs font-semibold text-slate-200">Offensive Methodology</span>
                <span className="text-[11px] text-slate-500">Nmap, Burp Suite &amp; Kali</span>
              </div>
              <div className="flex flex-col items-center">
                <i className="fa-solid fa-chart-line text-emerald-400 text-lg mb-1"></i>
                <span className="text-xs font-semibold text-slate-200">Defensive SOC Triage</span>
                <span className="text-[11px] text-slate-500">Splunk SIEM &amp; Incident Logs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Course Roadmap & Structured Curriculum (Exact Template Match) */}
      <section id="roadmap" className="py-24 bg-slate-950/80 border-y border-slate-900 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header (Image 2 Match) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-rose-600 font-mono text-xs uppercase tracking-widest font-extrabold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 shadow-sm shadow-rose-600/50"></span>
                {CURRICULUM_DATA.header.tag}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-1.5 tracking-tight">
                {CURRICULUM_DATA.header.title}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                {CURRICULUM_DATA.header.subtitle}
              </p>
            </div>

            {/* Interactive Controls Deck */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsRoadmapTourPlaying(prev => !prev)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition shadow-sm ${isRoadmapTourPlaying
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/80 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-slate-800 hover:border-cyan-500/50'
                  }`}
                title="Automatically step through all 5 course checkpoints"
              >
                <i className={`fa-solid ${isRoadmapTourPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                <span>{isRoadmapTourPlaying ? 'Pause Tour' : 'Play Roadmap Tour'}</span>
              </button>

              <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
                <button
                  onClick={() => setActiveCheckpointId(prev => (prev <= 1 ? 5 : prev - 1))}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Previous Checkpoint"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span className="px-3 py-1 text-xs font-mono font-bold text-slate-200 flex items-center">
                  {currentCheckpoint.number} / 05
                </span>
                <button
                  onClick={() => setActiveCheckpointId(prev => (prev >= 5 ? 1 : prev + 1))}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Next Checkpoint"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          {/* 3D Winding Highway Roadmap Template (Image 1 Match) */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/90 p-5 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl group">
            {/* Ambient Highway Atmosphere */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Roadmap Top Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block shadow-sm shadow-cyan-400/50"></span>
                <span className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
                  60-DAY CAREER HIGHWAY ROADMAP
                </span>
                <span
                  className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold"
                  style={{
                    backgroundColor: `${currentCheckpoint.pinColor}15`,
                    color: currentCheckpoint.pinColor,
                    borderColor: `${currentCheckpoint.pinColor}50`
                  }}
                >
                  Active Checkpoint {currentCheckpoint.number}: {currentCheckpoint.days}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <i className="fa-solid fa-hand-pointer text-cyan-400 animate-bounce"></i>
                <span>Hover checkpoint pins along highway to elaborate points</span>
              </div>
            </div>

            {/* Winding 3D Road SVG Container */}
            <div className="relative w-full py-4 overflow-x-auto terminal-scroll">
              <div className="min-w-[700px] w-full">
                <svg
                  viewBox="0 0 1000 520"
                  className="w-full h-auto select-none overflow-visible filter drop-shadow-2xl"
                >
                  <defs>
                    {/* Asphalt Surface Gradient */}
                    <linearGradient id="roadAsphaltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e2433" />
                      <stop offset="50%" stopColor="#2c3345" />
                      <stop offset="100%" stopColor="#191e2b" />
                    </linearGradient>

                    {/* 3D Extruded Curb Gradient */}
                    <linearGradient id="roadCurbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="30%" stopColor="#e2e8f0" />
                      <stop offset="70%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    {/* Road Drop Shadow */}
                    <filter id="roadDropShadow" x="-10%" y="-10%" width="120%" height="150%">
                      <feGaussianBlur stdDeviation="9" result="blur" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.55 0"
                      />
                    </filter>

                    {/* Pin Contact Shadow */}
                    <filter id="pinDropShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"
                      />
                    </filter>
                  </defs>

                  {/* 1. Road Ground Drop Shadow */}
                  <path
                    d={ROAD_SVG_PATH}
                    fill="none"
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth="76"
                    strokeLinecap="round"
                    filter="url(#roadDropShadow)"
                    transform="translate(0, 18)"
                  />

                  {/* 2. 3D Raised Curb Edge (Viewer Perspective Extrusion) */}
                  <path
                    d={ROAD_SVG_PATH}
                    fill="none"
                    stroke="url(#roadCurbGrad)"
                    strokeWidth="70"
                    strokeLinecap="round"
                    transform="translate(0, 8)"
                  />

                  {/* 3. Curb Upper Bevel Highlight */}
                  <path
                    d={ROAD_SVG_PATH}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="68"
                    strokeLinecap="round"
                    opacity="0.45"
                    transform="translate(0, 4)"
                  />

                  {/* 4. Top Asphalt Surface */}
                  <path
                    d={ROAD_SVG_PATH}
                    fill="none"
                    stroke="url(#roadAsphaltGrad)"
                    strokeWidth="62"
                    strokeLinecap="round"
                  />

                  {/* 5. Road Outer Boundary Traces */}
                  <path
                    d={ROAD_SVG_PATH}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="63"
                    strokeLinecap="round"
                    opacity="0.25"
                  />

                  {/* 6. Center White Dashed Lane Line */}
                  <path
                    d={ROAD_SVG_PATH}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.2"
                    strokeDasharray="14 12"
                    strokeLinecap="round"
                    opacity="0.95"
                    className="animate-road-dash"
                  />

                  {/* 7. Interactive Checkpoint Pins (Matching 5 Pins in Image 1) */}
                  {ROADMAP_CHECKPOINTS.map((cp) => {
                    const isSelected = activeCheckpointId === cp.id;
                    const isHovered = hoveredCheckpointId === cp.id;
                    const isHighlighted = isSelected || isHovered;

                    return (
                      <g
                        key={cp.id}
                        className="cursor-pointer transition-transform duration-300"
                        onMouseEnter={() => setHoveredCheckpointId(cp.id)}
                        onMouseLeave={() => setHoveredCheckpointId(null)}
                        onClick={() => {
                          setActiveCheckpointId(cp.id);
                          setIsRoadmapSideWindowOpen(true);
                          triggerToast(`Opened Checkpoint ${cp.number}: ${cp.title}`);
                        }}
                      >
                        {/* Pin Base Contact Shadow on Road */}
                        <ellipse
                          cx={cp.pinCoord.x}
                          cy={cp.pinCoord.y + 4}
                          rx={isHighlighted ? 24 : 18}
                          ry={isHighlighted ? 8 : 6}
                          fill="rgba(0,0,0,0.5)"
                          filter="url(#pinDropShadow)"
                        />

                        {/* Pulsing Radar Ring When Active */}
                        {isHighlighted && (
                          <circle
                            cx={cp.pinCoord.x}
                            cy={cp.pinCoord.y}
                            r="20"
                            fill="none"
                            stroke={cp.pinColor}
                            strokeWidth="2.5"
                            className="animate-ping opacity-75"
                          />
                        )}

                        {/* Pin Graphic Group with Vertical Hover Bounce */}
                        <g
                          transform={`translate(${cp.pinCoord.x}, ${cp.pinCoord.y - (isHighlighted ? 35 : 28)}) scale(${isHighlighted ? 1.12 : 1})`}
                          style={{
                            transformOrigin: '0px 28px',
                            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        >
                          {/* Map Pin Teardrop Body */}
                          <path
                            d="M 0,-34 C -16,-34 -25,-24 -25,-10 C -25,9 0,28 0,28 C 0,28 25,9 25,-10 C 25,-24 16,-34 0,-34 Z"
                            fill={cp.pinColor}
                            stroke="#ffffff"
                            strokeWidth="2.2"
                            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.35))"
                          />

                          {/* Inner Circular Cutout Hole (Matching Image 1 Donut Pin Style) */}
                          <circle
                            cx="0"
                            cy="-12"
                            r="10.5"
                            fill="#ffffff"
                          />

                          {/* Checkpoint Milestone Number Inside Donut */}
                          <text
                            x="0"
                            y="-8"
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="900"
                            fill="#0f172a"
                            fontFamily="monospace"
                          >
                            {cp.number}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Road Bottom Status Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: currentCheckpoint.pinColor }}
                ></span>
                <span className="text-slate-300">
                  Checkpoint <strong className="text-white font-bold">{currentCheckpoint.number}</strong> ({currentCheckpoint.days}):{' '}
                  <span className="text-slate-400 font-sans">{currentCheckpoint.title}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRoadmapSideWindowOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 border shadow-sm group"
                  style={{
                    backgroundColor: `${currentCheckpoint.pinColor}18`,
                    color: currentCheckpoint.pinColor,
                    borderColor: `${currentCheckpoint.pinColor}60`
                  }}
                  title="Click to open side window"
                >
                  <i className="fa-solid fa-table-columns text-xs"></i>
                  <span>Open Side Window</span>
                  <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide-over Side Window for Checkpoint Details ("WHEN CLICK ON THE PIN OPEN A WINDOW ON SIDE AND CLOSING BUTTON ALSO") */}
        {isRoadmapSideWindowOpen && (
          <div
            onClick={() => setIsRoadmapSideWindowOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity animate-window-expand"
          />
        )}

        <div
          className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl md:max-w-2xl bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col transform transition-transform duration-300 ease-out ${isRoadmapSideWindowOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Side Window Top Header Bar */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/60 shrink-0">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-2"
                  style={{
                    backgroundColor: `${currentCheckpoint.pinColor}18`,
                    color: currentCheckpoint.pinColor,
                    borderColor: `${currentCheckpoint.pinColor}60`
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentCheckpoint.pinColor }}></span>
                  CHECKPOINT {currentCheckpoint.number} • {currentCheckpoint.days}
                </span>

                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80">
                  {currentCheckpoint.levelName}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white mt-2.5 flex items-center gap-2.5">
                <i className={`${currentCheckpoint.icon}`} style={{ color: currentCheckpoint.pinColor }}></i>
                {currentCheckpoint.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg">
                {currentCheckpoint.subtitle} — {currentCheckpoint.briefSummary}
              </p>
            </div>

            {/* Closing Button (User Request: "AND CLOSING BUTTON ALSO") */}
            <button
              onClick={() => setIsRoadmapSideWindowOpen(false)}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition shrink-0 group shadow-md"
              title="Close side window (Esc)"
            >
              <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform"></i>
            </button>
          </div>

          {/* Side Window Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 terminal-scroll">
            {/* Quick Milestone Stepper Inside Side Window */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveCheckpointId(prev => (prev <= 1 ? 5 : prev - 1))}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-chevron-left text-[10px]"></i> Prev Checkpoint
              </button>
              <span className="text-slate-400">
                Milestone <strong className="text-white font-bold">{currentCheckpoint.number}</strong> of 5
              </span>
              <button
                onClick={() => setActiveCheckpointId(prev => (prev >= 5 ? 1 : prev + 1))}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
              >
                Next Checkpoint <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>

            {/* Elaborated Bullet Points */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                  <i className="fa-solid fa-list-check" style={{ color: currentCheckpoint.pinColor }}></i>
                  Elaborated Curriculum Points ({currentCheckpoint.elaboratedPoints.length} Core Concepts)
                </span>
              </div>

              <div className="space-y-3">
                {currentCheckpoint.elaboratedPoints.map((pt, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm"
                        style={{ backgroundColor: currentCheckpoint.pinColor }}
                      ></span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center justify-between">
                          <span>{pt.topic}</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {pt.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Hands-On Lab Specs */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                <i className="fa-solid fa-flask text-emerald-400 mr-1.5"></i> Practical Hands-On Lab Deliverable
              </span>
              <h5 className="text-sm font-bold text-white">
                {currentCheckpoint.practicalLab.name}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCheckpoint.practicalLab.objective}
              </p>
            </div>

            {/* Tools Mastered & Certifications */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                Tools Mastered & Industry Certification
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-amber-950/40 text-amber-300 border border-amber-800/60 font-bold">
                  <i className="fa-solid fa-certificate mr-1.5"></i> {currentCheckpoint.certAlignment}
                </span>
                {currentCheckpoint.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Side Window Bottom Closing Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
            <span className="text-xs font-mono text-slate-400">
              60-Day Cybersecurity Roadmap
            </span>
            <button
              onClick={() => setIsRoadmapSideWindowOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition flex items-center gap-2 border border-slate-700"
            >
              <span>Close Window</span>
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Red Team vs Blue Team Section */}
      <section id="teams" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-rose-400 text-xs font-mono uppercase tracking-widest font-semibold">Offense vs Defense</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Red Team or Blue Team?</h2>
            <p className="text-slate-400 text-sm mt-3">Compare both career tracks side-by-side or select a focus to evaluate typical roles, mindsets, and arsenal.</p>

            {/* Toggle Controls */}
            <div className="mt-6 inline-flex p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setTeamView('split')}
                className={`px-5 py-2 text-xs font-mono rounded-lg transition-all ${teamView === 'split' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setTeamView('red')}
                className={`px-5 py-2 text-xs font-mono rounded-lg transition-all ${teamView === 'red' ? 'bg-rose-950 text-rose-300 font-bold border border-rose-800' : 'text-slate-400 hover:text-rose-400'
                  }`}
              >
                Offensive (Red)
              </button>
              <button
                onClick={() => setTeamView('blue')}
                className={`px-5 py-2 text-xs font-mono rounded-lg transition-all ${teamView === 'blue' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-cyan-400'
                  }`}
              >
                Defensive (Blue)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Red Team Card */}
            {(teamView === 'split' || teamView === 'red') && (
              <div className="glass-panel p-8 rounded-3xl border border-rose-500/20 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-rose-950 text-rose-400 border border-rose-800/80">OFFENSIVE SECURITY</span>
                    <h3 className="text-2xl font-bold text-white mt-2">The Red Team</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 text-2xl">
                    <i className="fa-solid fa-skull"></i>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mt-5 leading-relaxed">
                  Red Teamers simulate actual adversary tactics, techniques, and procedures (TTPs) to find vulnerabilities before malicious attackers do.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold block mb-2">Core Mindset &amp; Mission</span>
                    <p className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800/60">
                      "Think like an adversary. Every locked door has an unmonitored window, misconfigured permission, or human element to bypass."
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold block mb-2">Methodology Pipeline</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-rose-400 font-bold">1</span>
                        <span className="text-[10px] text-slate-400">Recon</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-rose-400 font-bold">2</span>
                        <span className="text-[10px] text-slate-400">Scan</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-rose-400 font-bold">3</span>
                        <span className="text-[10px] text-slate-400">Exploit</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-rose-400 font-bold">4</span>
                        <span className="text-[10px] text-slate-400">PrivEsc</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold block mb-2">Essential Toolkit</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-brands fa-linux text-rose-400 mr-1"></i> Kali Linux</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-radar text-rose-400 mr-1"></i> Nmap Port Scanner</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-arrows-split-up-and-left text-rose-400 mr-1"></i> Burp Suite Interceptor</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-bolt text-rose-400 mr-1"></i> Metasploit Framework</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <span>Job Titles: <strong className="text-white">Penetration Tester, Ethical Hacker, Red Teamer</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Blue Team Card */}
            {(teamView === 'split' || teamView === 'blue') && (
              <div className="glass-panel p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/80">DEFENSIVE SECURITY</span>
                    <h3 className="text-2xl font-bold text-white mt-2">The Blue Team</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                </div>

                <p className="text-slate-300 text-sm mt-5 leading-relaxed">
                  Blue Teamers protect enterprise infrastructure, monitor telemetry 24/7, detect unauthorized intrusion patterns, and mitigate breaches.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold block mb-2">Core Mindset &amp; Mission</span>
                    <p className="text-xs text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800/60">
                      "The attacker only has to succeed once; the defender must secure everything every second. Visibility is power."
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold block mb-2">Methodology Pipeline</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-cyan-400 font-bold">1</span>
                        <span className="text-[10px] text-slate-400">Harden</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-cyan-400 font-bold">2</span>
                        <span className="text-[10px] text-slate-400">Detect</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-cyan-400 font-bold">3</span>
                        <span className="text-[10px] text-slate-400">Isolate</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="block text-cyan-400 font-bold">4</span>
                        <span className="text-[10px] text-slate-400">Remediate</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold block mb-2">Essential Toolkit</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-chart-pie text-cyan-400 mr-1"></i> Splunk &amp; Elastic SIEM</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-network-wired text-cyan-400 mr-1"></i> Wireshark &amp; Zeek</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-eye text-cyan-400 mr-1"></i> Microsoft Sysmon / EDR</span>
                      <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"><i className="fa-solid fa-fire text-cyan-400 mr-1"></i> Snort &amp; Suricata IDS</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                    <span>Job Titles: <strong className="text-white">SOC Analyst, Incident Responder, Threat Hunter</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Career Outcomes: Cybersecurity Career Roles & Salaries Section (From Presentation Deck) */}
      <section id="salaries" className="py-20 relative border-t border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-3xl transition-all duration-300 p-6 sm:p-8 lg:p-12 relative overflow-hidden shadow-2xl ${salaryTheme === 'light'
              ? 'bg-white text-slate-900 border border-slate-200 shadow-slate-900/10'
              : 'glass-panel-elevated border border-rose-500/30 hover:border-rose-500/50 shadow-rose-950/20'
              }`}
          >
            {/* Ambient Background Glow (in dark mode) */}
            {salaryTheme === 'dark' && (
              <>
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              </>
            )}

            {/* Top Header Row with Logo & Controls */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${salaryTheme === 'light' ? 'border-slate-200' : 'border-slate-800/80'
              }`}>
              {/* Brand Logo & Name (Matches Slide Deck: Red Box P + PEOPLECLICK LEARNING) */}
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-sm bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm shadow-rose-600/50">
                  P
                </span>
                <span className={`font-mono font-bold tracking-wider text-xs sm:text-sm uppercase ${salaryTheme === 'light' ? 'text-slate-900' : 'text-white'
                  }`}>
                  PEOPLECLICK LEARNING
                </span>
              </div>

              {/* View Switcher Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Team Filter */}
                <div className={`inline-flex p-1 rounded-xl border text-xs font-mono ${salaryTheme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
                  }`}>
                  <button
                    onClick={() => setSalaryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${salaryFilter === 'all'
                      ? salaryTheme === 'light'
                        ? 'bg-white text-rose-600 font-bold shadow-sm'
                        : 'bg-rose-950 text-rose-300 font-bold border border-rose-800'
                      : salaryTheme === 'light'
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    All Roles (6)
                  </button>
                  <button
                    onClick={() => setSalaryFilter('blue')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${salaryFilter === 'blue'
                      ? salaryTheme === 'light'
                        ? 'bg-white text-cyan-700 font-bold shadow-sm'
                        : 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                      : salaryTheme === 'light'
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    Blue Team
                  </button>
                  <button
                    onClick={() => setSalaryFilter('red')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${salaryFilter === 'red'
                      ? salaryTheme === 'light'
                        ? 'bg-white text-rose-700 font-bold shadow-sm'
                        : 'bg-rose-950 text-rose-300 font-bold border border-rose-800'
                      : salaryTheme === 'light'
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    Red Team
                  </button>
                </div>

                {/* Theme Mode Toggle (Cyber Dark vs Slide Deck White) */}
                <button
                  onClick={() => setSalaryTheme(salaryTheme === 'dark' ? 'light' : 'dark')}
                  className={`text-xs font-mono px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${salaryTheme === 'light'
                    ? 'bg-slate-900 text-rose-400 border-slate-800 hover:bg-slate-800'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-rose-500/40 hover:text-white'
                    }`}
                  title={salaryTheme === 'light' ? 'Switch to Cyber Dark Mode' : 'Switch to Slide Deck View'}
                >
                  <i className={`fa-solid ${salaryTheme === 'light' ? 'fa-moon text-rose-400' : 'fa-sun text-amber-400'}`}></i>
                  <span className="hidden sm:inline">
                    {salaryTheme === 'light' ? 'Cyber Dark' : 'Slide Deck View'}
                  </span>
                </button>
              </div>
            </div>

            {/* Slide Header Content */}
            <div className="mb-8">
              <span className="text-rose-500 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest block mb-1">
                CAREER OUTCOMES
              </span>
              <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-1 mb-3 ${salaryTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                Cybersecurity Career Roles &amp; Salaries
              </h2>
              <div className="text-rose-500 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span>CAREER OPPORTUNITIES — INDIA SALARY BANDS</span>
              </div>
            </div>

            {/* 6 Cards Grid (Exact 2-Column Match to Presentation Image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 mb-5">
              {CAREER_SALARY_ROLES
                .filter(role => salaryFilter === 'all' || role.team === salaryFilter || (role.team === 'hybrid' && salaryFilter === 'all'))
                .map((role) => (
                  <div
                    key={role.roleNum}
                    className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1 relative group cursor-default ${salaryTheme === 'light'
                      ? 'bg-white border border-slate-200 hover:border-rose-500/60 shadow-sm hover:shadow-md'
                      : 'bg-slate-900/80 border border-slate-800/90 hover:border-rose-500/60 shadow-lg hover:shadow-rose-950/30'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Role Number & Job Title */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono uppercase tracking-wider font-semibold ${salaryTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                            {role.roleNum}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${role.team === 'red'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                            : role.team === 'blue'
                              ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/60'
                              : 'bg-purple-950/60 text-purple-400 border border-purple-800/60'
                            }`}>
                            {role.teamLabel}
                          </span>
                        </div>
                        <h3 className={`text-base sm:text-lg font-bold tracking-tight mt-1 group-hover:text-rose-400 transition-colors ${salaryTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}>
                          {role.title}
                        </h3>
                        <p className={`text-xs mt-1 leading-relaxed hidden sm:block ${salaryTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                          {role.focus}
                        </p>
                      </div>

                      {/* Right: Salary Band & Period */}
                      <div className="text-right shrink-0">
                        <div className={`text-xl sm:text-2xl font-black tracking-tight ${salaryTheme === 'light' ? 'text-rose-600' : 'text-rose-500'
                          }`}>
                          {role.salary}
                        </div>
                        <div className={`text-xs font-mono mt-0.5 ${salaryTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                          {role.period}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footnote Sourcing */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t ${salaryTheme === 'light' ? 'border-slate-200' : 'border-slate-800/60'
              }`}>
              <p className={`text-xs italic leading-relaxed ${salaryTheme === 'light' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                Salary bands sourced from current Indian market data; actual offers vary by city, experience, and certification.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <i className="fa-solid fa-graduation-cap"></i>
                <span>Get Career Path Roadmap</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulators Section */}
      <section id="simulators" className="py-20 bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Interactive Labs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Test-Drive Security Tools In Your Browser</h2>
            <p className="text-slate-400 text-sm mt-3">Beginners often struggle with setting up virtual machines. Experiment with these realistic simulators right now to feel the workflow.</p>

            {/* Tool Tabs Switcher */}
            <div className="mt-8 flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 max-w-xl mx-auto">
              <button
                onClick={() => setActiveSim('nmap')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${activeSim === 'nmap' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <i className="fa-solid fa-terminal text-cyan-400 mr-1.5"></i> Nmap Terminal
              </button>
              <button
                onClick={() => setActiveSim('burp')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${activeSim === 'burp' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <i className="fa-solid fa-shuffle text-rose-400 mr-1.5"></i> Burp Repeater
              </button>
              <button
                onClick={() => setActiveSim('splunk')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all ${activeSim === 'splunk' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
              >
                <i className="fa-solid fa-chart-line text-emerald-400 mr-1.5"></i> Splunk SOC SIEM
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('cybercrime-simulator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  triggerToast('Viewing Real-World Cybercrime Simulator (DDoS & MITM)');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all text-rose-400 hover:text-white hover:bg-slate-800"
              >
                <i className="fa-solid fa-bolt-lightning text-rose-400 mr-1.5"></i> Cybercrime Lab (DDoS &amp; MITM)
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* 1. NMAP SIMULATOR */}
            {activeSim === 'nmap' && (
              <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden block">
                {/* Terminal Top Bar */}
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="text-xs font-mono text-slate-400 ml-2">root@kali-linux: ~ (Network Port Enumeration)</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">Bash v5.2</div>
                </div>

                {/* Presets & Input Bar */}
                <div className="p-4 bg-slate-950/70 border-b border-slate-900 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <span>Quick Commands:</span>
                    <button
                      onClick={() => { setNmapInput('nmap -sV 192.168.1.105'); runNmap('nmap -sV 192.168.1.105'); }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-cyan-400 hover:border-cyan-600 transition"
                    >
                      Service Detection
                    </button>
                    <button
                      onClick={() => { setNmapInput('nmap -p 21,22,80,443,3306 192.168.1.105'); runNmap('nmap -p 21,22,80,443,3306 192.168.1.105'); }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-cyan-400 hover:border-cyan-600 transition"
                    >
                      Key Ports Scan
                    </button>
                    <button
                      onClick={() => { setNmapInput('nmap -A -T4 192.168.1.105'); runNmap('nmap -A -T4 192.168.1.105'); }}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-rose-400 hover:border-rose-600 transition"
                    >
                      Aggressive Scan
                    </button>
                  </div>
                  <button
                    onClick={clearNmap}
                    className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
                  >
                    <i className="fa-solid fa-trash-can mr-1"></i> Clear
                  </button>
                </div>

                {/* Terminal Body */}
                <div className="p-5 font-mono text-xs text-slate-300 bg-slate-950 min-h-[300px] max-h-[420px] overflow-y-auto terminal-scroll leading-relaxed">
                  {nmapHistory.map((entry, idx) => {
                    if (entry.type === 'system') {
                      return <div key={idx} className="text-slate-500 mb-4 whitespace-pre-line">{entry.content}</div>;
                    }
                    if (entry.type === 'command') {
                      return (
                        <div key={idx} className="text-slate-400 mt-4 mb-2">
                          <span className="text-emerald-400">attacker@kali</span>:<span className="text-cyan-400">~</span>$ {entry.cmd}
                        </div>
                      );
                    }
                    if (entry.type === 'output') {
                      if (entry.scanType === 'ports') {
                        return (
                          <div key={idx} className="text-slate-300 mb-3">
                            Starting Nmap 7.94 ( https://nmap.org )<br />
                            Nmap scan report for 192.168.1.105<br />
                            PORT &nbsp; &nbsp; STATE &nbsp; &nbsp;SERVICE<br />
                            <span className="text-rose-400">21/tcp</span> &nbsp; <span className="text-rose-300">filtered</span> ftp<br />
                            <span className="text-emerald-400">22/tcp</span> &nbsp; <span className="text-green-400">open</span> &nbsp; &nbsp; ssh<br />
                            <span className="text-emerald-400">80/tcp</span> &nbsp; <span className="text-green-400">open</span> &nbsp; &nbsp; http<br />
                            <span className="text-emerald-400">443/tcp</span> &nbsp;<span className="text-green-400">open</span> &nbsp; &nbsp; https<br />
                            <span className="text-amber-400">3306/tcp</span> <span className="text-green-400">open</span> &nbsp; &nbsp; mysql<br /><br />
                            <span className="text-cyan-400">[i] Analysis:</span> Ports 80 and 443 are listening HTTP/S web interfaces. Port 3306 indicates an externally exposed relational database.
                          </div>
                        );
                      }
                      if (entry.scanType === 'aggressive') {
                        return (
                          <div key={idx} className="text-slate-300 mb-3">
                            Starting Nmap 7.94 ( https://nmap.org )<br />
                            Nmap scan report for 192.168.1.105 (target.cyberlab.lan)<br />
                            PORT &nbsp; &nbsp;STATE SERVICE VERSION<br />
                            22/tcp &nbsp;open &nbsp;ssh &nbsp; &nbsp; OpenSSH 8.9p1 (protocol 2.0)<br />
                            | ssh-hostkey: 256 71:4a:92:ef (ED25519)<br />
                            80/tcp &nbsp;open &nbsp;http &nbsp; &nbsp;Apache/2.4.52 (Ubuntu)<br />
                            |_http-title: Corporate Portal - Sign In<br />
                            | http-robots.txt: 1 disallowed entry<br />
                            | <span className="text-rose-400 font-bold">/admin_dev_backup.sql (POTENTIAL LEAK)</span><br />
                            443/tcp open &nbsp;ssl/ssl Apache/2.4.52<br />
                            |_ssl-date: TLS randomness does not represent time<br />
                            Device type: general purpose | OS details: Linux 5.4 - 5.15<br />
                            Network Distance: 1 hop<br />
                            <span className="text-rose-400 font-bold">[!] VULNERABILITY DETECTED:</span> Disallowed entry in robots.txt reveals sensitive database backup!
                          </div>
                        );
                      }
                      // Default service detection
                      return (
                        <div key={idx} className="text-slate-300 mb-3">
                          Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-29 12:44 UTC<br />
                          Nmap scan report for target-server.lab.lan (192.168.1.105)<br />
                          Host is up (0.0012s latency).<br />
                          Not shown: 996 closed tcp ports (reset)<br /><br />
                          <span className="text-slate-400 font-semibold">PORT &nbsp; &nbsp; STATE SERVICE &nbsp; &nbsp; VERSION</span><br />
                          <span className="text-emerald-400">22/tcp</span> &nbsp; <span className="text-green-400">open</span> &nbsp;ssh &nbsp; &nbsp; &nbsp; &nbsp; <span className="text-slate-200">OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux)</span><br />
                          <span className="text-emerald-400">80/tcp</span> &nbsp; <span className="text-green-400">open</span> &nbsp;http &nbsp; &nbsp; &nbsp; &nbsp;<span className="text-slate-200">Apache httpd 2.4.52 ((Ubuntu))</span><br />
                          <span className="text-rose-400 font-bold">443/tcp</span> &nbsp;<span className="text-green-400">open</span> &nbsp;ssl/http &nbsp; &nbsp;<span className="text-slate-200">Apache httpd 2.4.52</span><br />
                          <span className="text-amber-400">3306/tcp</span> <span className="text-green-400">open</span> &nbsp;mysql &nbsp; &nbsp; &nbsp; <span className="text-slate-200">MySQL 8.0.35-0ubuntu0.22.04.1</span><br /><br />
                          <span className="text-cyan-400">Service Info:</span> OS: Linux; CPE: cpe:/o:linux:linux_kernel<br />
                          Nmap done: 1 IP address (1 host up) scanned in 1.87 seconds.
                        </div>
                      );
                    }
                    return null;
                  })}
                  <div ref={terminalEndRef} />
                </div>

                {/* Interactive Input Bar */}
                <form
                  onSubmit={(e) => { e.preventDefault(); runNmap(); }}
                  className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 font-mono text-xs"
                >
                  <span className="text-emerald-400 shrink-0">attacker@kali:~$</span>
                  <input
                    type="text"
                    value={nmapInput}
                    onChange={(e) => setNmapInput(e.target.value)}
                    placeholder="Type nmap command here..."
                    className="w-full bg-transparent text-slate-200 focus:outline-none placeholder-slate-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded text-xs transition shrink-0"
                  >
                    Run
                  </button>
                </form>
              </div>
            )}

            {/* 2. BURP SUITE REPEATER SIMULATOR */}
            {activeSim === 'burp' && (
              <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden block">
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="text-xs font-mono font-bold text-amber-500 ml-1">Burp Suite Professional [Repeater]</span>
                    <span className="text-xs text-slate-500 hidden sm:inline">| Intercepting HTTP Request to Banking API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={sendBurp}
                      className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <i className="fa-solid fa-paper-plane text-[10px]"></i> Send
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950">
                  {/* Request Column */}
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">Raw HTTP Request</span>
                        <span className="text-[11px] font-mono text-slate-500">Target: api.fintechbank.lab</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mb-2 font-mono">
                        Simulate Parameter Tampering: Modify <code className="text-rose-400 bg-slate-900 px-1 py-0.5 rounded">role=user</code> to <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">role=admin</code> below and press <strong>Send</strong>.
                      </div>
                      <textarea
                        rows={12}
                        value={burpRequest}
                        onChange={(e) => setBurpRequest(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => tamperBurp('admin')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition"
                      >
                        <i className="fa-solid fa-wand-magic-sparkles mr-1"></i> Tamper to role: "admin"
                      </button>
                      <button
                        onClick={() => tamperBurp('user')}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 transition"
                      >
                        Reset to "user"
                      </button>
                    </div>
                  </div>

                  {/* Response Column */}
                  <div className="p-4 bg-slate-950 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">Server HTTP Response</span>
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${burpStatus.color}`}>
                          {burpStatus.text}
                        </span>
                      </div>
                      <div className="h-64 md:h-72 bg-slate-900/80 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-y-auto terminal-scroll leading-relaxed">
                        {!burpResponse ? (
                          <span className="text-slate-500">// Press "Send" to forward the request to the simulated web application server...</span>
                        ) : burpResponse.escalated ? (
                          <>
                            <span className="text-emerald-400">HTTP/1.1 200 OK</span><br />
                            Date: {burpResponse.date}<br />
                            Server: Apache-Coyote/1.1<br />
                            Content-Type: application/json;charset=UTF-8<br />
                            Content-Length: 184<br /><br />
                            {`{
  "status": "success",
  "message": "User profile updated successfully.",`}
                            <br />
                            <span className="text-rose-400 font-bold">&nbsp; "assigned_privilege": "{burpResponse.privilege}",</span><br />
                            <span className="text-rose-400 font-bold">&nbsp; "transfer_limit_usd": {burpResponse.limit},</span><br />
                            {`  "audit_flag": false
}`}
                            <br /><br />
                            <span className="text-amber-400">// [!] VULNERABILITY CONFIRMED: Broken Object Level Authorization (BOLA / IDOR). The backend trusted user client input without server-side role verification!</span>
                          </>
                        ) : (
                          <>
                            <span className="text-emerald-400">HTTP/1.1 200 OK</span><br />
                            Date: {burpResponse.date}<br />
                            Server: Apache-Coyote/1.1<br />
                            Content-Type: application/json;charset=UTF-8<br />
                            Content-Length: 122<br /><br />
                            {`{
  "status": "success",
  "message": "Profile synced.",
  "assigned_privilege": "${burpResponse.privilege}",
  "transfer_limit_usd": ${burpResponse.limit}
}`}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-500">
                      <i className="fa-solid fa-info-circle text-cyan-400 mr-1"></i> <strong>Takeaway:</strong> Burp Suite acts as a Man-in-the-Middle proxy between your browser and the server, letting ethical hackers test input validation and Broken Access Control (OWASP Top 10).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SPLUNK SIEM SIMULATOR */}
            {activeSim === 'splunk' && (
              <div className="glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden block">
                {/* Header */}
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">SPLUNK &gt; Enterprise</span>
                    <span className="text-xs font-mono text-slate-400">App: SOC Threat Hunting Dashboard</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 hidden sm:block">
                    Index: <span className="text-emerald-400 font-semibold">`wineventlog`</span> &amp; <span className="text-cyan-400 font-semibold">`auth_audit`</span>
                  </div>
                </div>

                {/* Query bar */}
                <div className="p-4 bg-slate-950 border-b border-slate-800">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="w-full relative">
                      <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-500 text-xs"></i>
                      <input
                        type="text"
                        value={splunkQuery}
                        onChange={(e) => setSplunkQuery(e.target.value)}
                        className="w-full bg-slate-900 text-slate-200 pl-8 pr-4 py-2 rounded-lg text-xs font-mono border border-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleFilterSplunk('all')}
                        className={`flex-1 sm:flex-none px-3 py-2 rounded-lg text-xs font-mono transition ${splunkFilter === 'all' ? 'bg-slate-700 text-white font-bold' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          }`}
                      >
                        All Logs
                      </button>
                      <button
                        onClick={() => handleFilterSplunk('CRITICAL')}
                        className={`flex-1 sm:flex-none px-3 py-2 border rounded-lg text-xs font-mono transition ${splunkFilter === 'CRITICAL' ? 'bg-rose-900 text-rose-200 border-rose-700' : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border-rose-800/80'
                          }`}
                      >
                        Critical
                      </button>
                      <button
                        onClick={() => handleFilterSplunk('WARNING')}
                        className={`flex-1 sm:flex-none px-3 py-2 border rounded-lg text-xs font-mono transition ${splunkFilter === 'WARNING' ? 'bg-amber-900 text-amber-200 border-amber-700' : 'bg-amber-950 hover:bg-amber-900 text-amber-300 border-amber-800/80'
                          }`}
                      >
                        Warning
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto p-4 bg-slate-950 max-h-80 overflow-y-auto terminal-scroll">
                  <table className="w-full text-left font-mono text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-500 uppercase">
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Severity</th>
                        <th className="py-2 px-3">Event Signature</th>
                        <th className="py-2 px-3">Source IP</th>
                        <th className="py-2 px-3">Target Host</th>
                        <th className="py-2 px-3 text-right">Triage Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {filteredLogs.map((log) => {
                        const badgeColor =
                          log.level === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            log.level === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-slate-800 text-slate-300';
                        return (
                          <tr key={log.id} className="hover:bg-slate-900/60 transition">
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{log.time}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>{log.level}</span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-200 text-xs">{log.sig}</td>
                            <td className="py-2.5 px-3 text-cyan-400 font-mono text-[11px]">{log.src}</td>
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{log.target}</td>
                            <td className="py-2.5 px-3 text-right">
                              {log.status === 'blocked' ? (
                                <span className="text-xs text-slate-500 font-mono flex items-center justify-end gap-1">
                                  <i className="fa-solid fa-lock text-rose-400"></i> Blocked
                                </span>
                              ) : (
                                <button
                                  onClick={() => blockIp(log.id, log.src)}
                                  className="px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[11px] font-mono transition"
                                >
                                  <i className="fa-solid fa-shield-virus mr-1"></i> Block IP
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* SOC Status Banner */}
                <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-slate-400">
                    <i className="fa-solid fa-shield-cat text-emerald-400 mr-2"></i> SOC Playbook: Identify suspicious anomalous traffic and trigger remediation.
                  </span>
                  <span className="text-emerald-400 font-semibold">{socStatusBanner}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Offer You Before You Start Your Career (Slide Reference Pillars 01 & 02) */}
      <section id="offerings" className="py-24 relative border-t border-slate-900 bg-slate-950/90 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
                <span className="text-xs font-mono font-bold tracking-widest text-rose-500 uppercase flex items-center gap-1.5">
                  WHAT WE OFFER TO YOU
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60 uppercase">
                  Career Enablement
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Everything We Offer Before You Start Your Career
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
                Bridging the gap between conceptual understanding and corporate hiring through immersive practical labs and end-to-end recruitment mentorship.
              </p>
            </div>

            {/* Slide View Toggle Button */}
            <div className="shrink-0">
              <button
                onClick={() => setOfferTheme(offerTheme === 'dark' ? 'slide' : 'dark')}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-rose-500/50 transition flex items-center gap-2 shadow-sm"
                title={offerTheme === 'dark' ? 'Switch to Slide Presentation View' : 'Switch to Cyber Dark Mode'}
              >
                <i className={`fa-solid ${offerTheme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-rose-400'}`}></i>
                <span>{offerTheme === 'dark' ? 'Slide Deck View' : 'Cyber Dark Mode'}</span>
              </button>
            </div>
          </div>

          {/* 2-Card Grid (Exact Match to Presentation Slide) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* CARD 01: 100% Hands-On Training */}
            <div
              className={`rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between transform hover:-translate-y-1.5 shadow-2xl group ${offerTheme === 'slide'
                  ? 'bg-white text-slate-900 border border-slate-200 border-t-8 border-t-rose-600 p-8 sm:p-10 shadow-slate-300/40'
                  : 'bg-slate-900/90 border border-slate-800 border-t-8 border-t-rose-500 p-8 sm:p-10 hover:border-rose-500/60 shadow-rose-950/20'
                }`}
            >
              <div>
                {/* Number 01 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-6xl sm:text-7xl font-black text-rose-600 tracking-tight leading-none font-sans">
                    01
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${offerTheme === 'slide'
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-rose-950/70 text-rose-400 border border-rose-800/60'
                    }`}>
                    PRACTICE FIRST
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 ${offerTheme === 'slide' ? 'text-slate-900' : 'text-white'
                  }`}>
                  100% Hands-On Training
                </h3>

                {/* Subtitle / Tagline */}
                <p className={`text-sm sm:text-base leading-relaxed mb-8 ${offerTheme === 'slide' ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                  Theory alone doesn't get you hired. Every concept is reinforced through practical application.
                </p>

                {/* Bullet Points with red dots */}
                <div className="space-y-3.5 mb-8">
                  {[
                    'Real-World Labs',
                    'Security Simulations',
                    'Practical Exercises',
                    'Industry Tools',
                    'Guided Assessments',
                    'Capstone Projects'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0 shadow-sm shadow-rose-600/50"></span>
                      <span className={`text-sm sm:text-base font-semibold ${offerTheme === 'slide' ? 'text-slate-800' : 'text-slate-200'
                        }`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer Action */}
              <div className={`pt-6 border-t flex items-center justify-between text-xs font-mono ${offerTheme === 'slide' ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                }`}>
                <span>Simulated live environments</span>
                <a
                  href="#simulators"
                  className="text-rose-600 hover:text-rose-500 font-bold flex items-center gap-1.5 transition"
                >
                  <span>Explore Simulators</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            </div>

            {/* CARD 02: Complete Career Support (Solid Red Background as in Slide) */}
            <div className="rounded-3xl bg-gradient-to-br from-rose-600 via-rose-600 to-red-700 text-white p-8 sm:p-10 shadow-2xl shadow-rose-950/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between transform hover:-translate-y-1.5 group">
              {/* Subtle ambient lighting inside red card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                {/* Number 02 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-none font-sans opacity-95">
                    02
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    CAREER ACCELERATOR
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                  Complete Career Support
                </h3>

                {/* Subtitle / Tagline */}
                <p className="text-sm sm:text-base text-rose-100/95 leading-relaxed mb-8">
                  Your success is our mission. We don't just train students — we help build successful cybersecurity careers.
                </p>

                {/* List Items */}
                <div className="space-y-3.5 mb-8">
                  {[
                    'Resume Building',
                    'LinkedIn Optimization',
                    'Mock Interviews',
                    'Tech Interview Prep',
                    'Portfolio Development',
                    'Career Guidance',
                    'Placement Assistance'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[10px] shrink-0">
                        <i className="fa-solid fa-check"></i>
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer Action */}
              <div className="pt-6 border-t border-white/20 flex items-center justify-between text-xs font-mono text-rose-100">
                <span>Placement cell &amp; interview coaching</span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-rose-700 font-bold hover:bg-rose-50 transition shadow-md flex items-center gap-1.5"
                >
                  <span>Apply for Support</span>
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <section className="py-16 cyber-grid relative border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">Start Your Cybersecurity Journey Today</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Join over 1,800 aspiring ethical hackers and SOC defense analysts. Seats are limited to guarantee server capacity for the live attack simulations.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 text-white shadow-xl shadow-cyan-500/20 hover:opacity-95 transition transform hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-shield-halved mr-2"></i> Claim Your Free Ticket Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-xs text-slate-500 text-center font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 CyberSpectrum Education Labs. For educational and ethical cybersecurity instruction only.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-cyan-400 cursor-pointer">Code of Ethics</span>
            <span className="hover:text-cyan-400 cursor-pointer">Lab Disclaimer</span>
            <span className="hover:text-cyan-400 cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>

      {/* POP-OUT OS WINDOW MODAL */}
      {activeWindowModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-rose-500/60 p-0 relative shadow-2xl shadow-rose-950/50 overflow-hidden animate-window-expand">
            {/* Window Chrome Titlebar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-xs font-mono font-bold text-slate-200 ml-2">
                  Peopleclick_Learning // {activeWindowModal.id.toUpperCase()}_WINDOW.exe
                </span>
              </div>
              <button
                onClick={() => setActiveWindowModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Window Body */}
            <div className="p-6 bg-slate-950">
              <div className="flex items-center gap-3 mb-4">
                <i className={`${activeWindowModal.icon} text-3xl text-rose-500`}></i>
                <div>
                  <div className="text-2xl font-black text-white">{activeWindowModal.stat}</div>
                  <div className="text-sm font-semibold text-rose-400">{activeWindowModal.label}</div>
                </div>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {activeWindowModal.expandedInfo.headline}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {activeWindowModal.description}
              </p>

              {/* Highlights 4-grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {activeWindowModal.expandedInfo.highlights.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-sm sm:text-base font-mono font-bold text-rose-400">{h.val}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1">{h.label}</div>
                  </div>
                ))}
              </div>

              {/* Key takeaways */}
              <div className="space-y-2 mb-6">
                {activeWindowModal.expandedInfo.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <i className="fa-solid fa-check text-rose-400 text-xs mt-0.5 shrink-0"></i>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Window Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[11px] font-mono text-slate-500">
                  Slide Ref: 04 / 11 • Peopleclick Learning
                </span>
                <button
                  onClick={() => setActiveWindowModal(null)}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xl mb-3">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Reserve Your Free Seat</h3>
              <p className="text-xs text-slate-400 mt-1">Interactive live stream &amp; tool cheatsheets included</p>
            </div>

            {!isRegistered ? (
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Email Address (For Calendar Invite)</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="jordan@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Primary Career Interest</label>
                  <select
                    value={regForm.interest}
                    onChange={(e) => setRegForm({ ...regForm, interest: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    <option value="both">Both Red &amp; Blue (Explore Everything)</option>
                    <option value="red">Offensive Hacking / Red Team (Penetration Tester)</option>
                    <option value="blue">Cyber Defense / Blue Team (SOC Analyst)</option>
                    <option value="network">Network &amp; Server Administration Fundamentals</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    required
                    checked={regForm.consent}
                    onChange={(e) => setRegForm({ ...regForm, consent: e.target.checked })}
                    className="mt-0.5 rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="consentCheck" className="text-[11px] text-slate-400">
                    I agree to practice cybersecurity techniques strictly on authorized lab systems.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg transition"
                >
                  Confirm Seat Registration
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xl mb-3">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 className="text-base font-bold text-white">Access Pass Granted!</h4>
                <p className="text-xs text-slate-300 mt-2">
                  We have sent your streaming link and digital lab starter package to{' '}
                  <span className="text-cyan-400 font-mono">{regForm.email}</span>.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-5 px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 glass-panel border border-cyan-500/50 text-white px-4 py-3 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-3 transition-all duration-300 ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
          }`}
      >
        <i className="fa-solid fa-shield-heart text-cyan-400 text-base"></i>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
