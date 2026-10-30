---
description: Independent review of the current diff by a fresh subagent
---
Run the `code-reviewer` subagent on `git diff main...HEAD` (or the staged diff if on main). Give it no
explanation of how the code was written. Report its findings grouped as Must fix / Should fix / Nice to
have, then propose fixes for the Must-fix items. Note any finding that changes a decision in the RAID log.
$ARGUMENTS
