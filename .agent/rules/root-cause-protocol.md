---
trigger: always_on
---

# Root Cause Analysis Protocol

## Core Directive
When hitting issues, always identify the root cause before attempting a fix. Do not guess or apply speculative patches.

## Requirements for Action
1. **Evidence-Based Diagnosis**: Before any code change is proposed, you must provide proof of the failure (e.g., logs, a failing test case, or a trace of the logic flow).
2. **Elimination of Guessing**: Do not implement "fixes" based on assumptions. If the cause is not clear, use diagnostic tools or add temporary logging to gather evidence first.
3. **Targeted Resolution**: Once the root cause is proven, implement the simplest solution that addresses the source of the problem, rather than its symptoms.

## Goal
To maintain a clean and predictable codebase by ensuring every change is intentional and solves the actual problem identified.