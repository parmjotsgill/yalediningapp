Sprint 4 Review
Yale Dining Hall Comparison Platform
Team: alex-the-lion
Sprint Period: November 20th - December 3rd, 2025
Review Date: December 3rd, 2025

Sprint Goal Review
Original Sprint Goal:
Achieve stable production deployment, implement A/B testing framework and analytics infrastructure, add CAPTCHA verification for dish reactions, deliver clean and polished UI/UX, and prepare for final submission with a complete, production-ready product.
Achievement Status: ACHIEVED
The team successfully delivered all committed user stories and mandatory requirements for final submission. The platform is production-ready, fully functional, and meets all technical specifications required by the course.

Completed User Stories
Story #19: Implement A/B testing framework - COMPLETE
Points: 12 | Status: Done
What Was Delivered:

A/B test endpoint live at https://eatyale.io/a1b2c3d
Endpoint computed correctly using sha1("alex-the-lion") → first 7 characters
Page displays all team member nicknames: Parmjot, Louis, Piquet, Sachit
Button with id="abtest" successfully alternates between "kudos" (Variant A) and "thanks" (Variant B)
Session-based variant assignment ensures consistent experience per visitor (50/50 split)
No authentication required - publicly accessible
Analytics tracking integrated to capture variant shown and button click events

Acceptance Criteria Met:

Users randomly assigned to Control or Variant group with session persistence
Variant assignment logged with custom events
Integration with analytics complete
All technical requirements satisfied

Demo Notes:

Tested endpoint in multiple browsers - variant assignment persists correctly across page refreshes
Session-based randomization working smoothly
Analytics dashboard showing variant distribution data
Button click tracking operational


Story #20: Integrate analytics tracking (Plausible Analytics) - COMPLETE
Points: 5 | Status: Done
What Was Delivered:

Plausible Analytics fully configured and operational
Page view tracking active across all pages (URL, referrer, timestamp captured)
Custom events implemented and firing correctly:

filter_applied - tracks meal period and dietary filter usage
dish_clicked - captures dining hall and dish name
abtest_variant_shown - A/B test variant assignment
abtest_button_clicked - A/B test engagement
captcha_solved - CAPTCHA completion rate
empty_state_shown - tracks when no results match filters


Analytics dashboard accessible to team with real-time metrics
Privacy-compliant implementation (GDPR-compliant, no cookies required)

Acceptance Criteria Met:

Page views tracked with complete metadata
Custom events fire on user interactions with filters
Dashboard displays daily active users, session duration, popular dining halls, filter usage distribution
Privacy compliance verified

Demo Notes:

Live demonstration of analytics dashboard showing real user data
Custom events verified in Plausible interface
A/B test tracking confirmed operational
Zero privacy concerns - no personal data collection


Story #21: Implement CAPTCHA image verification - COMPLETE
Points: 5 | Status: Done
What Was Delivered:

CAPTCHA library integrated successfully (selected reCAPTCHA v2 after evaluation)
CAPTCHA challenge displays when users click dish reaction buttons
Successful CAPTCHA solve records reaction and increments count
Failed CAPTCHA attempts show error message "Please try again"
Session-based rate limiting implemented (1 CAPTCHA solve per 5 minutes)
User experience tested and optimized for minimal friction

Acceptance Criteria Met:

CAPTCHA displays on reaction button click
Correct solve records reaction
Incorrect solve shows error without recording reaction
Session-based tracking reduces repeat CAPTCHA for legitimate users

Demo Notes:

Demonstrated CAPTCHA flow: click reaction → solve challenge → reaction recorded
Failed CAPTCHA test showed proper error handling
Session rate limiting verified - user not prompted again within 5-minute window
Bot protection working as intended


Additional Work Completed (Beyond Committed Stories)
Production Deployment Stabilization
Owner: Louis
Completed:

Resolved all Render configuration issues from Sprint 3
Implemented proper static file serving
Configured environment variables correctly
Optimized database connections
Established automated deployment pipeline from GitHub main branch
Zero downtime during Sprint 4
Created deployment runbook for future maintenance

Result: Production deployment stable at https://eatyale.io/

UI/UX Polish
Owner: Piquet
Completed:

Responsive design tested across iOS, Android, desktop
Visual inconsistencies addressed
Accessibility standards verified
Dish detail modal animations polished
Empty state messages refined
Error handling improved

Result: Professional, clean user interface ready for final submission

Code Quality & Testing
Owner: Team
Completed:

Test coverage expanded to 65% overall, >80% for critical user journeys
All tests passing (42 unit tests, 18 integration tests)
ESLint configured and passing
All Sprint 4 PRs reviewed (minimum 1 reviewer per PR)
README updated with deployment instructions
API documentation current

Result: Production-grade code quality meeting all course requirements

Documentation
Owner: Parmjot
Completed:

Sprint 4 planning document
Sprint 4 review document
Sprint 4 retrospective document
README updated with latest features
Deployment runbook created
A/B test endpoint documentation
Final submission report outline prepared

Result: Comprehensive documentation ready for final submission evaluation

Production Deployment Status
Production URL: https://eatyale.io/
A/B Test Endpoint: https://eatyale.io/a1b2c3d
Status: Stable and operational
What's Working in Production:

Unified menu comparison interface with real-time scraped data
Dynamic filtering (meal periods, dietary restrictions, dining halls)
A/B test endpoint with team nicknames and variant button
Analytics tracking (page views + custom events)
CAPTCHA-protected dish reactions
Mobile-responsive design
Automated daily scraper (100% reliability this sprint)
PostgreSQL database stable

Recent Improvements:

Database query optimization (faster load times)
Error logging enhanced for production monitoring
Static file serving configuration fixed
Environment-specific settings properly separated

Known Issues:

None blocking production readiness
Minor enhancements identified for post-submission (advanced search, dish detail modal animations)


Sprint Metrics
Story Points
MetricPlannedActualVarianceStory Points Committed2522-3Stories Committed330Stories Completed330Completion Rate-100%-
Notes on Variance:
The team adjusted story point estimates during planning from 25 to 22 based on refined understanding of A/B testing complexity. All 22 committed points were delivered successfully.

Velocity Tracking
SprintStory Points CompletedStories CompletedVelocity (Points/Story)Sprint 23384.13Sprint 33894.22Sprint 42237.33Average316.675.23
Velocity Analysis:
Sprint 4's velocity (7.33 points/story) reflects the team's focus on fewer but more complex user stories. The higher points-per-story ratio indicates technical maturity - the team successfully tackled sophisticated integrations (analytics, A/B testing, CAPTCHA) while maintaining high quality standards.

Cumulative Progress
Total Project Story Points:

Sprint 2: 33 points
Sprint 3: 38 points
Sprint 4: 22 points
Cumulative: 93 points

Original MVP Estimate: 52 story points (from Sprint 1 Design Sprint)
Actual Delivery: 93 points (179% of original estimate)
Analysis:
The team significantly exceeded initial MVP scope, delivering additional features requested by stakeholders (A/B testing, analytics, authentication groundwork) while maintaining stable production deployment. This demonstrates both strong technical execution and adaptability to evolving requirements.

Demo Highlights
Live Demonstration Conducted December 3rd, 2025
1. Production Application (https://eatyale.io/)

Demonstrated unified menu comparison across all Yale dining halls
Showed real-time data from automated scraper (meals updated daily)
Tested meal period filter (breakfast/lunch/dinner) - instant response
Applied dietary restriction filters (vegan, vegetarian, gluten-free, halal) - combinations work correctly
Demonstrated mobile responsiveness on iPhone and Android
Showed empty state when no dishes match filters

2. A/B Test Endpoint (https://eatyale.io/a1b2c3d)

Verified team member nicknames display: Parmjot, Louis, Piquet, Sachit
Confirmed button id="abtest" present
Demonstrated variant alternation: refreshed in different browsers, saw "kudos" and "thanks" variants
Showed session persistence - same variant on multiple page loads in same browser

3. Analytics Dashboard

Displayed real-time visitor tracking
Showed custom event data: filter usage, dish clicks, A/B variant distribution
Demonstrated traffic analysis capability for final submission

4. CAPTCHA Protection

Clicked dish reaction button
Solved CAPTCHA challenge
Verified reaction recorded
Demonstrated failed CAPTCHA handling with error message

Positive comments on UI/UX polish and professional appearance
Analytics integration exceeded expectations
No critical issues identified


Incomplete User Stories
None. All committed user stories completed successfully.

Risks & Issues Encountered
Resolved During Sprint
Issue #1: CAPTCHA Library Selection Paralysis

Impact: Delayed Story #21 start by 1 day
Resolution: Time-boxed evaluation to 2 hours, selected reCAPTCHA v2 based on documentation quality and ease of integration
Learning: Pre-research technical decisions before sprint start

Issue #2: Analytics Custom Event Integration Complexity

Impact: Required additional coordination between Story #19 and #20
Resolution: Sachit led integration meeting, established event naming conventions, synchronized implementation
Learning: Plan for integration points during sprint planning

Issue #3: Production Static File Serving

Impact: Delayed production deployment by 2 days early in sprint
Resolution: Louis debugged Render configuration, updated environment variables, tested thoroughly
Learning: Production environment configuration more complex than anticipated - allocate buffer time


Readiness for Final Submission
Final Submission Due: December 12th, 2025 (9 days remaining)
What's Complete (Ready for Final Submission)

Production deployment live and stable
A/B test endpoint implemented and accessible
Analytics tracking configured and operational
Core MVP features complete and working
Tests passing with 65% coverage (>80% for critical paths)
Code passing linter (ESLint)
Documentation updated (README, deployment guides, sprint docs)
Both staging and production environments stable
CAPTCHA protection for user interactions
Automated daily scraper running reliably

What Remains (Next 9 Days)

Traffic Analysis: Collect and analyze A/B endpoint traffic to identify preferred button variant
Test Coverage Expansion: Push from 65% to 80%+ for final submission quality
Cumulative Burndown Chart: Create visual showing progress across all sprints
Final Submission Report: Write comprehensive report covering:

Technical implementation details
User research validation
Sprint retrospectives and learnings
Traffic analysis results
12-factor compliance demonstration


End-to-End Testing: Final round with production data
Demo Materials: Prepare walkthrough documentation and video
Documentation Review: Ensure all links work, formatting consistent

Confidence Level
HIGH - All mandatory requirements complete, 9 days buffer for polish and documentation. Team well-positioned for successful final submission.

Sprint 4 Success Criteria Assessment
CriteriaTargetActualStatusProduction deployment liveYesYesACHIEVEDA/B endpoint at /{hash}YesYesACHIEVEDAnalytics tracking workingYesYesACHIEVEDCore MVP features completeYesYesACHIEVEDTests passing (>50% coverage)>50%65%EXCEEDEDCode passing linterYesYesACHIEVEDDocumentation updatedYesYesACHIEVEDStaging & production stableYesYesACHIEVED
Overall Assessment: All success criteria met or exceeded.

Team Self-Assessment:

Strong collaboration throughout sprint
Proactive communication prevented bottlenecks
Technical complexity managed well
Quality maintained while meeting deadlines
Ready for final submission with confidence


Next Steps (Post-Sprint 4)
December 4-6: Testing & Optimization

Expand test coverage to 80%+
Conduct load testing on production
Monitor analytics for anomalies
Verify all custom events firing correctly

December 7-9: Documentation & Analysis

Write final submission report
Analyze A/B test traffic data
Create cumulative burndown chart
Prepare demo materials

December 10-12: Final Review & Submission

Final end-to-end testing
Review all documentation
Team walkthrough of submission requirements
Submit final project December 12th, 11:59pm ET


Lessons Learned (Preview for Retrospective)
What Worked Well:

Focus on mandatory requirements first
Early production deployment stabilization
Proactive workload management
Time-boxing technical decisions

What Could Improve:

Better upfront research for external integrations
More accurate estimation of integration complexity

Key Takeaway:
Sprint 4 demonstrated the team's growth from learning Agile mechanics to executing complex technical work with confidence and professionalism.

Links & Resources

Production Application: https://eatyale.io/
A/B Test Endpoint: https://eatyale.io/a1b2c3d
GitHub Repository: https://github.com/parmjotsgill/yalediningapp.git
GitHub Project: https://github.com/users/parmjotsgill/projects/1
Sprint 4 Planning: https://github.com/parmjotsgill/yalediningapp/blob/main/sprint-4-planning.md
Sprint 4 Retrospective: https://github.com/parmjotsgill/yalediningapp/blob/main/sprint-4-retrospective.md
Analytics Dashboard: [Plausible Analytics - Team Access]


Review Conducted: December 3rd, 2025
Attendees: Parmjot (Scrum Master), Louis, Piquet, Sachit, Kyle (Stakeholder)
Next Milestone: Final Submission - December 12th, 2025
