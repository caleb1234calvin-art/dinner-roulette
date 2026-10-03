Read-only Vercel runtime excerpts for the two accepted Preview acquisitions. Tool truncates long attempt arrays; group timings shown below are retained exactly. No additional provider request was made to obtain these logs.

## Runtime Logs

**Project:** prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm
**Deployment:** dpl_2StAVNmaECY6k3HKiaeXdTyFoQVv
**Time range:** 2026-10-03T02:02:00.000Z → 2026-10-03T02:04:00.000Z

### 02:02:56 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 200 [warn/serverless]
dep=dpl_2StAVNmaECY6k3HKiaeXdTyFoQVv branch=fix/date-night-live-discovery-resilience-verification-remediation-1 cache=MISS
    [discovery] provider-chain {
      mode: 'date-night',
      strategy: 'hedged',
      source: 'merged',
      durationMs: 7518,
      budgetExhausted: false,
      requestedGroups: 4,
      successfulGroups: 4,
      failedGroups: 0,
      partial: false,
      groups: [
        {
          group: 'seasonal',
          outcome: 'success',
          durationMs: 6470,
          winnerMirror: 1
        },
        {
          group: 'entertainment',
          outcome: 'success',
          durationMs: 7118,
          winnerMirror: 1
        },
        {
          group: 'culture',
          outcome: 'success',
          durationMs: 4548,
          winnerMirror: 1
        },
        {
          group: 'outdoor',
          outcome: 'success',
          durationMs: 6385,
          winnerMirror: 1
        }
      ],
      attempts: [
        {
          group: 'culture',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 4548,
          outcome: 'success'
        },
        {
          group: 'culture',
          mirror: 2,
          hedgeOffsetMs: 1502,
          durationMs: 3047,
          outcome: 'cancelled'
        },
        {
          group: 'culture',
          mirror: 3,
          hedgeOffsetMs: 3001,
          durationMs: 793,
          outcome: 'http-error',
          status: 504
        },
        {
          group: 'culture',
          mirror: 4,
          hedgeOffsetMs: 3794,
          durationMs: 755,
          outcome: 'cancelled'
        },
        {
          group: 'entertainment',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 7118,
          outcome: 'success'
        },
        {
          group: 'entertainment',
          mirror: 2,
          hedgeOffsetMs: 1501,
          durationMs: 5617,
          outcome: 'cancelled'
        },
        {
          group: 'entertainment',
          mirror: 3,
          hedgeOffsetMs: 3004,
          durationMs: 787,
          outcome: 'http-error',
          status: 504
        },
        {
          group: 'entertainment',
          mirror: 4,
          hedgeOffsetMs: 3791,
          durationMs: 3327,
          outcome: 'cancelled'
        },
        {
          group: 'outdoor',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 6384,
          outcome: 'success'
        },
        {
          group: 'outdoor',
          mirror: 2,
          hedgeOffsetMs: 1503… (truncated)

### 02:02:48 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 200 [warn/serverless]
dep=dpl_2StAVNmaECY6k3HKiaeXdTyFoQVv branch=fix/date-night-live-discovery-resilience-verification-remediation-1 cache=MISS
    [discovery] provider-chain {
      mode: 'date-night',
      strategy: 'hedged',
      source: 'merged',
      durationMs: 4060,
      budgetExhausted: false,
      requestedGroups: 4,
      successfulGroups: 4,
      failedGroups: 0,
      partial: false,
      groups: [
        {
          group: 'seasonal',
          outcome: 'empty',
          durationMs: 2798,
          winnerMirror: 1
        },
        {
          group: 'entertainment',
          outcome: 'success',
          durationMs: 2292,
          winnerMirror: 1
        },
        {
          group: 'culture',
          outcome: 'success',
          durationMs: 4031,
          winnerMirror: 1
        },
        {
          group: 'outdoor',
          outcome: 'success',
          durationMs: 3416,
          winnerMirror: 1
        }
      ],
      attempts: [
        {
          group: 'culture',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 4031,
          outcome: 'success'
        },
        {
          group: 'culture',
          mirror: 2,
          hedgeOffsetMs: 1503,
          durationMs: 2528,
          outcome: 'cancelled'
        },
        {
          group: 'culture',
          mirror: 3,
          hedgeOffsetMs: 2999,
          durationMs: 1033,
          outcome: 'cancelled'
        },
        {
          group: 'entertainment',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 2291,
          outcome: 'success'
        },
        {
          group: 'entertainment',
          mirror: 2,
          hedgeOffsetMs: 1502,
          durationMs: 790,
          outcome: 'cancelled'
        },
        {
          group: 'outdoor',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 3416,
          outcome: 'success'
        },
        {
          group: 'outdoor',
          mirror: 2,
          hedgeOffsetMs: 1505,
          durationMs: 1912,
          outcome: 'cancelled'
        },
        {
          group: 'outdoor',
          mirror: 3,
          hedgeOffsetMs: 3001,
          durationMs: 416,
          outcome: 'cancelled'
        },
        {
          group: 'seasonal',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 2798,
          outcome: 'empty'
        },
        {
          group: 'seasonal',
          mirror: 2,
          hedgeOffsetMs: 1500,
          durationMs: 1299,
          outcome: 'cancelled'
        }… (truncated)
