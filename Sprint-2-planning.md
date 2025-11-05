## 7. Sprint 2 Plan

**Sprint Duration:** 2 weeks (November 11 - November 24, 2025)

**Sprint Goal:** *"Deploy a working Django application to Render staging environment with a basic unified menu table displaying sample data, functional meal period filter, and solid technical foundation for future features."*

### Committed User Stories

| Issue # | Story Title | Story Points | Assignee | Notes |
|---------|-------------|--------------|----------|-------|
| #1 | Set up Django project with PostgreSQL | 5 | Louis | Includes local dev environment setup for all team members |
| #2 | Create database models (DiningHall, Menu, Dish) | 3 | Sachit | Includes migrations and Django admin registration |
| #3 | Build unified menu table UI (hardcoded sample data) | 8 | Parm | Uses Tailwind CSS, responsive design, hardcoded 3 dining halls |
| #4 | Implement meal period filter (breakfast/lunch/dinner) | 5 | Louis | Frontend button group + backend filtering logic |
| #5 | Deploy to Render staging environment | 5 | Sachit | Includes database setup, environment variables, domain config |
| #6 | Create project README and setup documentation | 2 | Parm | Local setup instructions, architecture overview, contribution guide |

**Total Committed Story Points:** 28

### Team Capacity Analysis

**Total Available Hours:**
- 4 developers × 20 hours/week × 2 weeks = **160 total hours**
- Minus: Thanksgiving week (Nov 21-24) reduced capacity = **-20 hours**
- **Adjusted Available Hours: 140 hours**

**Velocity Assumption:**
- First sprint = conservative estimate: **1 story point ≈ 4-5 hours**
- Expected capacity: 140 hours ÷ 4.5 hours/point = **~31 story points**
- **Committed: 28 story points (90% of capacity)**

**Capacity Buffer:** 10% buffer accounts for:
- First-time Render deployment unknowns
- Django learning curve for team members new to framework
- Code review and testing time
- Thanksgiving week disruptions

### Sprint Backlog (Task Breakdown for Story #3 Example)

**User Story #3: Build unified menu table UI (8 points)**
- Task 3.1: Design table HTML structure with dining hall columns (2 hours) - Parm
- Task 3.2: Implement Tailwind CSS responsive styles (3 hours) - Parm  
- Task 3.3: Create hardcoded sample menu data (realistic Yale menus) (1 hour) - Piquet
- Task 3.4: Connect Django template to sample data (2 hours) - Parm
- Task 3.5: Test responsive behavior on mobile devices (1 hour) - Parm
- Task 3.6: Code review and refinements (1 hour) - Louis

### Dependencies & Risks

**Critical Path Dependencies:**
1. **Story #1 (Django setup)** must complete **by Day 3** (Nov 13) before:
   - Story #2 (Database models)
   - Story #3 (Menu table UI)
2. **Story #2 (Database models)** must complete **by Day 5** (Nov 15) before:
   - Story #3 can use real database queries (currently uses hardcoded data as fallback)
3. **All feature stories (#3, #4)** must complete **by Day 10** (Nov 21) before:
   - Story #5 (Deployment) on Day 11-13

**Identified Risks:**

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Team unfamiliar with Render deployment | High | Medium | Allocate 5 story points; pair Louis + Sachit on deployment; research Render docs ahead of sprint |
| Thanksgiving week availability (Nov 21-24) | Certain | Medium | Front-load critical work to Nov 11-20; only deployment tasks during Thanksgiving week |
| Hardcoded data doesn't represent real menu complexity | Medium | Low | Piquet to provide realistic sample data with edge cases (long names, multiple dietary tags) |
| Django version compatibility issues | Low | Medium | Pin Django 4.2 LTS in requirements.txt; test locally before pushing to staging |
| Merge conflicts from parallel development | Medium | Low | Daily standups to coordinate; Louis reviews all PRs to catch conflicts early |

### Definition of Done Checklist (Sprint 2)

For each user story to be marked "Done":
- [ ] Code implemented and committed to feature branch
- [ ] Code merged to `develop` branch via pull request
- [ ] Minimum 1 code review approval (preferably from Louis)
- [ ] Local testing completed by developer (manual verification)
- [ ] Deployed to staging environment (https://yale-dining-staging.onrender.com)
- [ ] Manual QA completed in staging by another team member
- [ ] No critical bugs blocking basic functionality
- [ ] README updated if setup instructions changed

**Sprint 2 Success Criteria:**
- [ ] Staging site is publicly accessible and loads without errors
- [ ] Menu table displays 3+ dining halls with sample dishes
- [ ] Meal filter buttons (Breakfast/Lunch/Dinner) visibly filter table content
- [ ] Site is responsive on mobile devices (tested on iPhone/Android)
- [ ] All team members can run application locally using README instructions