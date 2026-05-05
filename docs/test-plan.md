# Test Plan Matrix

## Scope

This test plan covers core functional flows, role access, AI pipeline behavior, and operational analytics.

## Functional Matrix

| Area | Scenario | Expected Result |
|---|---|---|
| Auth | User signs in/out | Protected routes require auth and redirect correctly |
| Voice Intake | Browser recording upload | Audio saved and listed in recent uploads |
| Voice Intake | File upload (mp3/wav/webm) | Valid files accepted, invalid files rejected |
| AI Pipeline | Process uploaded audio | Structured output returned with ticketId + analysis |
| Ticket Automation | High urgency complaint | Ticket priority high/critical and status escalated |
| Ticket Automation | Agent assignment | Ticket assigned to support agent with lowest workload |
| Ticket Workflow | Valid status transition | Ticket status updates and activity log recorded |
| Notifications | Mark one notification read | Item updates state and unread count decrements |
| Notifications | Mark all as read | All unread notifications become read |
| Settings | Save user preferences | Preferences persist and rehydrate on reload |
| Analytics | Role-scoped dashboard data | Admin/all, agent/assigned, user/reporter scope works |

## Role Access Matrix

| Route | User | Support Agent | Admin |
|---|---|---|---|
| `/dashboard` | Yes | Yes | Yes |
| `/voice` | Yes | Yes | Yes |
| `/analytics` | Yes (own scope) | Yes (assigned scope) | Yes (global) |
| `/agent/dashboard` | No | Yes | Yes |
| `/admin/dashboard` | No | No | Yes |
| `/notifications` | Yes | Yes | Yes |
| `/settings` | Yes | Yes | Yes |

## Non-Functional Checks

- Performance: dashboard and analytics routes return within acceptable API latency under seed load
- Security: headers present, protected routes gated by Clerk middleware
- Reliability: AI process route enforces rate limit and surfaces structured errors
- Data integrity: ticket creation, analysis persistence, and notification records remain consistent

## Regression Command Set

Run before merge/release:

- `npm run check`
- `npm run build`
