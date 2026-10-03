Original provider summary returned by Vercel; tool truncates long entries as marked below. No raw provider payloads or coordinates are recorded.

## Runtime Logs

**Project:** prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm
**Deployment:** dpl_JBCV767umF9iMBsVoRQQMJQrBkDc
**Time range:** 2026-10-03T00:44:08.790Z → 2026-10-03T00:54:08.790Z

### 00:53:50 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 0 [info/serverless]
dep=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc

### 00:53:50 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 0 [info/serverless]
dep=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc

### 00:53:37 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 200 [warn/serverless]
dep=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc branch=fix/date-night-live-discovery-resilience-1 cache=MISS
    [discovery] provider-chain {
      mode: 'date-night',
      strategy: 'hedged',
      source: 'fallback',
      durationMs: 12500,
      budgetExhausted: false,
      requestedGroups: 1,
      successfulGroups: 0,
      failedGroups: 1,
      partial: false,
      groups: [ { group: 'seasonal', outcome: 'failed', durationMs: 12500 } ],
      attempts: [
        {
          group: 'seasonal',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 2,
          hedgeOffsetMs: 1499,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 3,
          hedgeOffsetMs: 2999,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 4,
          hedgeOffsetMs: 4499,
          durationMs: 8000,
          outcome: 'timeout'
        }
      ]
    }

### 00:53:24 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 200 [warn/serverless]
dep=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc branch=fix/date-night-live-discovery-resilience-1 cache=MISS
    [discovery] provider-chain {
      mode: 'date-night',
      strategy: 'hedged',
      source: 'merged',
      durationMs: 12522,
      budgetExhausted: false,
      requestedGroups: 4,
      successfulGroups: 3,
      failedGroups: 1,
      partial: true,
      groups: [
        { group: 'seasonal', outcome: 'failed', durationMs: 12500 },
        {
          group: 'entertainment',
          outcome: 'success',
          durationMs: 1830,
          winnerMirror: 1
        },
        {
          group: 'culture',
          outcome: 'success',
          durationMs: 4297,
          winnerMirror: 1
        },
        {
          group: 'outdoor',
          outcome: 'success',
          durationMs: 1912,
          winnerMirror: 1
        }
      ],
      attempts: [
        {
          group: 'culture',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 4297,
          outcome: 'success'
        },
        {
          group: 'culture',
          mirror: 2,
          hedgeOffsetMs: 1503,
          durationMs: 2794,
          outcome: 'cancelled'
        },
        {
          group: 'culture',
          mirror: 3,
          hedgeOffsetMs: 3001,
          durationMs: 1297,
          outcome: 'cancelled'
        },
        {
          group: 'entertainment',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 1829,
          outcome: 'success'
        },
        {
          group: 'entertainment',
          mirror: 2,
          hedgeOffsetMs: 1501,
          durationMs: 329,
          outcome: 'cancelled'
        },
        {
          group: 'outdoor',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 1912,
          outcome: 'success'
        },
        {
          group: 'outdoor',
          mirror: 2,
          hedgeOffsetMs: 1504,
          durationMs: 408,
          outcome: 'cancelled'
        },
        {
          group: 'seasonal',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 2,
          hedgeOffsetMs: 1500,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 3,
          hedgeOffsetMs: 2999,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirro… (truncated)

### 00:53:23 GET / 200 [info/serverless]
dep=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc branch=fix/date-night-live-discovery-resilience-1 cache=MISS

### 00:51:19 GET / 200 [info/serverless]
dep=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc branch=fix/date-night-live-discovery-resilience-1 cache=MISS
