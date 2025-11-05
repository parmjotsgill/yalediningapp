# Sprint 2 Planning (Nov 11 – Nov 24, 2025)

## Sprint Goal
Deploy a working Django web app to **Render (staging)** that displays a unified dining hall menu table with sample data and a working meal-period filter.  
This sprint focuses on getting the foundation live and stable.

---

## Selected User Stories
| # | Story | Points | Assignee |
|--|--|--:|--|
| #1 | Set up Django project with PostgreSQL | 5 | Louis |
| #2 | Create database models (DiningHall, Menu, Dish) | 3 | Sachit |
| #3 | Build unified menu table UI (sample data) | 8 | Parm |
| #4 | Implement meal period filter | 5 | Louis |
| #5 | Deploy to Render staging | 5 | Sachit |
| #6 | Create README and setup documentation | 2 | Parm |

**Total Committed Story Points:** 28 (≈ 28 hours of work)

---

## Team Capacity and Assignments
- **Total capacity:** 16 hours/week × 2 weeks = **32 hours**
- **Committed:** 28 points → ~87% of available capacity  
- **Buffer:** 4 hours reserved for reviews and testing

**Assignments**
- Louis → Django setup, filter logic, reviews  
- Sachit → Database models, deployment setup  
- Parm → Frontend table, Tailwind CSS, documentation  
- Piquet (PO) → Sample data and acceptance validation  

---

## Dependencies
1. **Story #1** (Django setup) must finish before #2 and #3.  
2. **Story #2** (models) required before live data integration.  
3. **Stories #3–#4** must complete before **#5 (deployment)**.

---

## Risks and Mitigation
| Risk | Impact | Mitigation |
|--|--|--|
| New to Render deployment | Medium | Pair Louis + Sachit; test early |
| Limited weekly hours | Medium | Tight scope; focus on high-priority tasks |
| Sample data may not reflect real menus | Low | Piquet provides realistic examples |

---

## Definition of Done
- Code merged via PR (≥1 reviewer)  
- Runs locally using README instructions  
- Deployed successfully to staging (no major errors)  
- Menu table shows ≥3 dining halls  
- Meal filter toggles correctly  
- Responsive on mobile  

**Success Criteria:**  
Staging site live and usable with working sample menus and filters.