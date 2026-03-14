Detailed PRD: Hospital Management System (HMS)
1. Project Overview
Yeh ek web-based platform hai jo hospital ke daily operations jaise patient records, appointment scheduling, billing, aur staff management ko automate karta hai.
2. Tech Stack (Updated)
 * Frontend: React.js, Tailwind CSS ya Material UI (Modern UI ke liye), React Router.
 * Backend: Node.js, Express.js.
 * Database: MongoDB.
 * Authentication: JWT (JSON Web Tokens) role-based access control ke liye.
3. User Roles & Access Control
System me 4 primary roles honge:
 * Admin: Poore system ka access, staff management, aur reports dekhna.
 * Doctor: Appointments manage karna aur patient medical history update karna.
 * Staff/Receptionist: Patient registration, appointment booking, aur billing manage karna.
 * Patient: Profile dekhna, medical history check karna, aur appointments book karna.
4. Key Modules & Features
A. Patient Management
 * Naya patient register karna aur unique ID assign karna.
 * Personal details aur medical history ka database maintain karna.
B. Appointment Scheduling
 * Doctor ki availability ke hisaab se slot book karna.
 * Appointments ko reschedule ya cancel karne ka feature.
C. Doctor & Staff Management
 * Doctors ki details, specialization, aur timing store karna.
 * Hospital staff ki records aur unke roles manage karna.
D. Billing & Report Generation
 * Consultation aur treatments ke liye automatic bill generate karna.
 * Patient records aur hospital revenue ki reports nikalna.
Antigravity IDE me Stepwise Use Kaise Karein:
Step 1: Setup & Planning
Antigravity ko yeh prompt dein:
> "Maine @hospital-management-prd.md upload kar diya hai. Mujhe ek MERN stack structure chahiye jisme frontend React.js par ho. 'client' aur 'server' folders banao aur pehle ek Technical Architecture Artifact generate karo."
> 
Step 2: Backend Development (Database & Auth)
Backend agent ko prompt dein:
> "Node.js aur Express use karke server setup karo. MongoDB me 'User', 'Patient', 'Appointment', aur 'Bill' ke schemas banao. JWT-based authentication system banao jisme Admin, Doctor, aur Patient roles honge."
> 
Step 3: React Frontend Development
Frontend agent ko prompt dein:
> "React.js aur Tailwind CSS ka use karke Dashboard UI banao. User role ke hisaab se sidebar change hona chahiye (Admin vs Doctor vs Patient). @hospital-management-prd.md ke modules ko follow karo."
> 
Step 4: API Integration & Testing
Aakhir me dono ko integrate karein:
> "React frontend ko backend API se connect karo. Axios use karke patient registration aur login flow pura karo. Antigravity ke built-in browser me test karke check karo ki roles sahi kaam kar rahe hain ya nahi."
>
