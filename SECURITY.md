# Security Policy

## Supported Versions

Security fixes are applied on the `main` branch for the production GitHub Pages site.

| Branch | Supported |
| --- | --- |
| `main` | ✅ |
| Other branches/tags | ❌ |

## Security Alert Coverage

This repository uses the following GitHub security alert inventories:

- **Dependabot vulnerability alerts** (where supported): `Security` → `Dependabot`
- **Code scanning alerts**: `Security` → `Code scanning`
- **Secret scanning alerts** (where supported): `Security` → `Secret scanning`

Repository security maintainers must keep these features enabled in repository security settings and maintain read/triage access for the owner listed below.

## Alert Triage Ownership

- **Primary owner for unresolved alerts:** @RenegadeJayhawk
- **Backup owner:** repository administrators

Every open security finding must include:

1. Assigned owner
2. Remediation decision (`fix`, `accept risk`, or `false positive`)
3. Target resolution date

Track these details in the alert itself and, when needed, in a linked GitHub issue.

## Recurring Review Process

- Review all open Dependabot, code-scanning, and secret-scanning alerts **weekly**.
- Re-check unresolved alerts during monthly maintenance and update target dates.
- Close alerts only after remediation is verified or a documented risk decision is recorded.
- Treat `403`/inaccessible alert inventory API responses as a coverage failure and remediate repository feature enablement and permissions.

### Risk-based exception process

If a security feature cannot be enabled or is not supported for this repository, document the exception in a GitHub issue with:

- Feature name
- Reason/constraint
- Risk impact
- Compensating controls
- Next review date

## Reporting a Vulnerability

Please report vulnerabilities privately using GitHub Security Advisories:

1. Open the repository's **Security** tab.
2. Select **Advisories**.
3. Click **Report a vulnerability**.

If Security Advisories are unavailable, open a private contact request through GitHub profile contact channels and include reproduction steps and impact.
