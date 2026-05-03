# Release Protocol

## Core Directive
Ensure that every new feature or fix is properly documented with a release version and description, maintaining a clear, version-controlled history of changes.

## Requirements for Action
1. **Versioning Update:** Whenever a new feature is added, or a bug is fixed, determine the next appropriate semantic version (`MAJOR.MINOR.PATCH`).
   - `MAJOR`: Breaking changes.
   - `MINOR`: New features (backward compatible).
   - `PATCH`: Bug fixes.
2. **Documentation:** Update the `CHANGELOG.md` file in the root directory. Add a new section for the new release.
3. **Format:** Use the standard Keep a Changelog format, categorizing changes into `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, or `Security`.
4. **Timing:** The release notes must be updated BEFORE creating the final Pull Request for the feature or fix.
