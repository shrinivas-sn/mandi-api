<!-- docs-structure: v1 -->
# DOCS index

One row per `WORK/<date>/` folder. Keep this updated in place — don't let it drift
from what's actually in `WORK/`. Add a row the same session a new day-folder is created.

Dates in this table are written **DD/MM/YYYY** (user is India-based). This is display
text only — the `WORK/<date>/` folder name underneath stays YYYY-MM-DD, since that's
the only format that sorts correctly on disk and in `git log`.

| Date | Summary | Status | Load-bearing | Touches | Continues |
|---|---|---|---|---|---|

No dated `WORK/` sessions yet for this project. See `CONTEXT/` for architecture,
backend/frontend design, and build-spec docs.

**Status** — `active` (in progress), `done` (finished, not touched again), `superseded`
(a later entry replaced this approach), `abandoned` (started, dropped, note why in the
WORK.md itself).

**Load-bearing** — `yes` if this session's decisions still constrain current
architecture/behavior, even if old. `no` once it's fully superseded or irrelevant to
anything still standing.

**Touches** — rough file paths or feature areas, used by `/recap` to decide whether
an old-but-load-bearing entry is relevant to what you're doing right now.

**Continues** — if this session picks up a multi-day work item, point at the earlier
date so recap follows the thread instead of treating same-topic sessions as unrelated.
