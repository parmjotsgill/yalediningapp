# Sprint 3 Retrospective
**Yale Dining Hall Comparison Platform**  
**Team:** alex-the-lion  
**Sprint Period:** November 12 - November 19, 2025  
**Retrospective Date:** November 19, 2025  
**Facilitator:** Parm (Scrum Master)  
**Attendees:** Parm, Louis, Piquet, Sachit

---

## What Went Well ✅

### 1. Successfully Integrated Automated Scraper with Real-Time Menu Data
- Scraper successfully fetches menus from Yale Dining website and populates database
- Error logging and retry logic provide robust failure handling
- Cron job runs daily at 5:00 AM EST without manual intervention

### 2. Dynamic Filtering System Works Smoothly
- Meal period and dietary filters work correctly across all combinations
- Active filter states provide clear visual feedback
- "Clear all filters" button resets state cleanly

### 3. Team Collaboration Improved with Clearer Task Assignments
- Task assignments were clear and well-distributed
- Communication improved with more frequent check-ins
- Team worked well together despite tight timeline

### 4. Core Functionality (Menu Comparison Table) Exceeded Initial Design Expectations
- Unified menu table is clean, professional, and responsive
- Mobile layout works well across devices
- Dish detail modal and empty state handle edge cases gracefully

---

## What Didn't Go Well ⚠️

### 1. Render Deployment Configuration Severely Underestimated
**Problem:**
- Story #3 estimated at 3 points but required extensive debugging
- Environment-specific issues with static files, database connections, and environment variables
- Louis worked extended hours to resolve deployment issues

**Why This Happened:**
- Assumed Render would be straightforward (similar to other platforms)
- No proof-of-concept testing before sprint commitment

### 2. Stakeholder Expectations Introducing New Requirements Mid-Cycle Without Scope Negotiation
**Problem:**
- Kyle added 3 new stories mid-Sprint 3 (A/B testing, analytics, CAPTCHA) totaling 22 story points
- No corresponding scope reduction discussed
- Team struggles to say "no" to additional work even when it impacts committed deliverables

**Why This Happened:**
- No formal change request process
- Team wants to please stakeholder, leading to conflict avoidance
- Need clearer MVP definition to avoid scope creep

---

## What to Improve 🔧

### 1. Better Upfront Research and Proof-of-Concept Testing for Deployment Platforms
**Action Items:**
- **Action:** Do proof-of-concept deployment research before sprint commitments
- **Owner:** Louis
- **Deadline:** Before Sprint 4 planning

### 2. Need Clearer MVP Definition and Scope Management
**Action Items:**
- **Action:** Remove non-MVP stories like dish count from backlog; focus on value-add features only
- **Owner:** Parm
- **Deadline:** Sprint 4 planning (finalize backlog)

- **Action:** Practice saying "That's a great idea for Sprint 5" when new requirements are added mid-sprint
- **Owner:** Team
- **Deadline:** Ongoing in Sprint 4

### 3. More Proactive Communication During High-Intensity Weeks
**Action Items:**
- **Action:** Check in more frequently when team members are carrying heavy workloads
- **Owner:** Parm & Team
- **Deadline:** Ongoing in Sprint 4

- **Action:** Flag blockers earlier rather than grinding through solo
- **Owner:** Louis (and all team members)
- **Deadline:** Ongoing in Sprint 4

---

## Team Dynamics Reflection

**Overall Assessment:**
The team is performing well and continues to deliver strong technical output under tight timelines. Sprint 3 was particularly heavy for Louis, who carried substantial development and deployment responsibilities. 

**Learning:**
More proactive check-ins would have allowed us to rebalance the workload earlier. Going forward, the team will maintain closer, more hands-on communication to ensure everyone feels supported, especially during high-intensity weeks.

**Positives:**
Despite the pressure, the team demonstrated resilience, collaboration, and a shared commitment to moving the MVP forward.

---

## Action Items for Sprint 4

| Action Item | Owner | Deadline |
|-------------|-------|----------|
| Lead Sprint 4 planning to ensure realistic scope commitment | Parm | Sprint 4 planning |
| Prioritize core MVP features over nice-to-haves | Parm | Sprint 4 planning |
| Finalize backlog by removing non-MVP stories like dish count | Parm | Sprint 4 planning |
| Document deployment process for team reference | Louis | November 21 |
| Focus UI/UX polish on core user journeys | Piquet | Sprint 4 |
| Ensure responsive design works flawlessly across devices | Piquet | Sprint 4 |
| Complete A/B testing and analytics integration per Kyle's requirements | Sachit | Sprint 4 |
| Ensure clean implementation of new features | Sachit | Sprint 4 |
| Deliver all Sprint 4 committed requirements | Team | End of Sprint 4 |
| Conduct thorough end-to-end testing | Team | End of Sprint 4 |
| Ensure production-ready quality with clean, professional UI/UX | Team | End of Sprint 4 |
| Prepare final report | Parm | End of Sprint 4 |

---

**Document Prepared By:** Parm (Scrum Master)  
**Date:** November 19, 2025
