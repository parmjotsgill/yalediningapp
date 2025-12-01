Sprint 4 Planning
Yale Dining Hall Comparison Platform
Team: alex-the-lion
Sprint Period: November 20th - December 3rd, 2025
Planning Date: November 19th, 2025

Sprint Goal
Achieve stable production deployment, implement A/B testing framework and analytics infrastructure, add CAPTCHA verification for dish reactions, deliver clean and polished UI/UX, and prepare for final submission with a complete, production-ready product.

Sprint Duration

Start Date: November 20th, 2025
End Date: December 3rd, 2025
Duration: 2 weeks (14 days)
Final Submission Deadline: December 12th, 2025


Team Capacity
Team MemberRoleAvailable HoursCapacity %ParmjotScrum Master / Developer20 hours100%LouisLead Developer20 hours100%PiquetFrontend Developer20 hours100%SachitDeveloper / Analytics20 hours100%
Total Team Capacity: 80 hours

Sprint Backlog
Committed User Stories
Story #19: Implement A/B testing framework
Priority: High | Points: 12
User Story:
As a product manager, I want an A/B testing framework integrated so that we can experiment with different UI variations and measure which performs better.
Acceptance Criteria:

Given the A/B testing framework is configured, when a user visits the site, then they are randomly assigned to either Control or Variant group with assignment persisted in their session
Given a user is in the Variant group, when they view the menu table, then they see the experimental UI variation (e.g., different filter layout, alternative color scheme)
Given A/B test is running, when users interact with the site, then their group assignment and key actions (filter usage, dish clicks) are logged for analysis

Technical Notes:

Implement session-based assignment (no authentication required)
Log events to database table: ABTestEvent(user_session_id, test_name, variant, action, timestamp)
Create A/B test endpoint at /{7-char-sha1-hash} per course requirements
Display team member nicknames and button with id="abtest" alternating between "kudos" and "thanks"

Assigned to: Sachit (lead), Parmjot (support)
Definition of Done:

A/B test endpoint live at correct hash URL
Team nicknames displayed
Button alternates between variants correctly
Session-based assignment working
Analytics tracking variant shown
Code reviewed and merged
Tests passing


Story #20: Integrate analytics tracking (Plausible Analytics)
Priority: High | Points: 5
User Story:
As a product manager, I want analytics tracking integrated so that we can measure user engagement, popular features, and identify improvement opportunities.
Acceptance Criteria:

Given analytics is configured, when a user visits any page, then page views are tracked with URL, referrer, and timestamp
Given analytics is active, when a user interacts with filters (meal period, dietary preferences), then custom events are fired tracking which filters are most used
Given the analytics dashboard, when I access it, then I can view metrics including daily active users, session duration, most popular dining halls, and filter usage distribution

Technical Notes:

Use Plausible Analytics (privacy-friendly, GDPR-compliant, no cookie consent needed)
Track custom events: filter_applied(filter_type, filter_value), dish_clicked(dish_name, dining_hall), empty_state_shown(active_filters), abtest_variant_shown, abtest_button_clicked
Add analytics script to base template
Implement event tracking via JavaScript

Assigned to: Sachit (lead), Louis (integration support)
Definition of Done:

Plausible Analytics configured and operational
All custom events firing correctly
Dashboard accessible to team
Privacy-compliant implementation
Code reviewed and merged
Documentation updated


Story #21: Implement CAPTCHA image verification
Priority: Medium | Points: 5
User Story:
As a developer, I want CAPTCHA image verification on the dish reaction feature so that we prevent automated bots from spamming reactions.
Acceptance Criteria:

Given a user wants to react to a dish, when they click the reaction button (👍/⭐), then a CAPTCHA challenge displays requiring them to identify characters or select matching images
Given the CAPTCHA is displayed, when the user solves it correctly, then their reaction is recorded and the reaction count increments
Given the CAPTCHA fails, when the user enters incorrect solution, then an error message displays "Please try again" and the reaction is not recorded

Technical Notes:

Evaluate CAPTCHA libraries (django-simple-captcha, django-recaptcha, or Node.js equivalent)
CAPTCHA required only for reaction submissions (not for viewing menus or filtering)
Session-based tracking: limit to 1 CAPTCHA solve per 5 minutes to reduce friction for legitimate users
Consider reCAPTCHA v3 (invisible, scores users) vs v2 (explicit checkbox/image challenge)

Assigned to: Louis (lead), Piquet (UI integration)
Definition of Done:

CAPTCHA library integrated
CAPTCHA displays on reaction click
Successful solve records reaction
Failed solve shows error message
Session-based rate limiting working
User experience tested and smooth
Code reviewed and merged


Additional Sprint 4 Focus Areas
Production Deployment Stabilization

Owner: Louis
Tasks:

Finalize Render production configuration
Resolve remaining environment variable issues
Test static file serving
Verify database connections stable
Set up automated deployment from main branch
Create deployment runbook



UI/UX Polish

Owner: Piquet
Tasks:

Responsive design final testing across devices
Address visual inconsistencies
Ensure accessibility standards met
Polish dish detail modal animations
Test empty states and error messages



Code Quality & Testing

Owner: Team
Tasks:

Expand test coverage to 65%+ overall, 80%+ for critical paths
Ensure ESLint passes completely
Code review all Sprint 4 PRs
Update README with deployment instructions
Document all environment variables



Documentation

Owner: Parmjot
Tasks:

Create Sprint 4 planning, review, retrospective documents
Update README with latest features
Document A/B test endpoint implementation
Prepare final submission report outline




Story Points Summary
Story #TitlePointsPriority#19Implement A/B testing framework12High#20Integrate analytics tracking5High#21Implement CAPTCHA verification5MediumTotal22
Note: Original commitment was 25 points, adjusted to 22 based on refined estimates during planning session.

Sprint Velocity Context
SprintStory Points CompletedSprint 233Sprint 338Average Velocity35.5
Sprint 4 Commitment: 22 story points
Rationale for Lower Commitment:

Sprint 4 focuses on fewer but more complex stories (A/B testing, analytics integration)
Final sprint requires substantial non-story work (production deployment, testing, documentation)
Team prioritizing quality over velocity for final submission
9 days after sprint for final polish and report writing


Risk Assessment
RiskLikelihoodImpactMitigation StrategyA/B endpoint implementation complexityMediumHighStart early, dedicate Sachit + Parmjot, reference course examplesAnalytics integration delaysLowMediumUse Plausible (simpler than Google Analytics), test earlyCAPTCHA library selection paralysisMediumLowTime-box evaluation to 2 hours, pick best option and move forwardProduction deployment issues persistLowHighLouis focused on this full-time first 3 days of sprintInsufficient time for final submission prepMediumHighComplete all stories by Nov 30, reserve Dec 1-3 for polish

Sprint Schedule
Week 1 (Nov 20-26)

Nov 20-22: Production deployment stabilization (Louis lead)
Nov 20-23: A/B test endpoint implementation (Sachit lead)
Nov 21-24: Analytics integration (Sachit lead)
Nov 22-25: CAPTCHA implementation (Louis lead)
Nov 23-26: UI/UX polish (Piquet lead)

Week 2 (Nov 27 - Dec 3)

Nov 27-29: Testing, code review, bug fixes (Team)
Nov 30: Sprint completion deadline - all stories done
Dec 1-3: Documentation, Sprint 4 review/retrospective, final polish

Post-Sprint (Dec 4-12)

Final submission preparation
Traffic analysis on A/B endpoint
Cumulative burndown chart creation
Comprehensive final report writing


Daily Standup Schedule
Time: 6:00 PM ET daily
Duration: 15 minutes
Format: Async Slack + Sync call if needed
Questions:

What did you complete yesterday?
What will you work on today?
Any blockers or concerns?


Definition of Done (Sprint Level)
Sprint 4 is considered "done" when:

All 3 committed user stories meet their acceptance criteria
Production deployment is stable and accessible
A/B test endpoint is live and functional
Analytics tracking is operational
All tests passing (65%+ coverage)
Code passes ESLint
All PRs reviewed and merged
Documentation updated (README, deployment guide)
Sprint review and retrospective completed
Ready for final submission period (Dec 4-12)


Success Criteria
Must Have:

Production URL live and stable
A/B endpoint at correct hash URL working
Analytics dashboard showing data
All mandatory final submission requirements met

Should Have:

Test coverage 65%+
Clean, polished UI/UX
Comprehensive documentation
Zero critical bugs in production

Nice to Have:

Test coverage 80%+
Performance optimization complete
Demo video prepared


Notes from Planning Session
Key Decisions:

Prioritize mandatory requirements (A/B endpoint, analytics) over nice-to-have features
Use Plausible Analytics instead of Google Analytics for privacy and simplicity
Evaluate CAPTCHA options quickly (2-hour time-box) to avoid decision paralysis
Reserve final 3 days of sprint for polish, not new development
Louis owns production deployment - make this his primary focus first 3 days

Scope Management:

Removed "advanced search functionality" from Sprint 4 scope
Removed "user authentication" - Kyle's mid-Sprint 3 addition deferred to post-submission
Focus on completing MVP with high quality vs. adding features

Team Agreements:

Daily check-ins to prevent workload imbalance (Sprint 3 learning)
No new feature additions after Nov 25
Code freeze for new features Nov 30
Dec 1-3 reserved for testing and documentation only


Planning Completed: November 19th, 2025
Team Attendees: Parmjot, Louis, Piquet, Sachit
Next Milestone: Sprint 4 Review - December 3rd, 2025
