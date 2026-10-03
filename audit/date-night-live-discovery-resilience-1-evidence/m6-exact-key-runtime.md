## Runtime Logs

**Project:** prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm
**Deployment:** dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm
**Time range:** 2026-10-03T00:52:27.299Z → 2026-10-03T01:02:27.299Z

### 01:01:53 POST /_serverFn/608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253 200 [warn/serverless]
dep=dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm branch=fix/date-night-live-discovery-resilience-1 cache=MISS
    [discovery] provider-chain {
      mode: 'date-night',
      strategy: 'hedged',
      source: 'merged',
      durationMs: 12526,
      budgetExhausted: false,
      requestedGroups: 4,
      successfulGroups: 3,
      failedGroups: 1,
      partial: true,
      groups: [
        { group: 'seasonal', outcome: 'failed', durationMs: 12501 },
        {
          group: 'entertainment',
          outcome: 'success',
          durationMs: 2101,
          winnerMirror: 1
        },
        {
          group: 'culture',
          outcome: 'success',
          durationMs: 1434,
          winnerMirror: 1
        },
        {
          group: 'outdoor',
          outcome: 'success',
          durationMs: 3897,
          winnerMirror: 1
        }
      ],
      attempts: [
        {
          group: 'culture',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 1434,
          outcome: 'success'
        },
        {
          group: 'entertainment',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 2101,
          outcome: 'success'
        },
        {
          group: 'entertainment',
          mirror: 2,
          hedgeOffsetMs: 1500,
          durationMs: 601,
          outcome: 'cancelled'
        },
        {
          group: 'outdoor',
          mirror: 1,
          hedgeOffsetMs: 0,
          durationMs: 3897,
          outcome: 'success'
        },
        {
          group: 'outdoor',
          mirror: 2,
          hedgeOffsetMs: 1501,
          durationMs: 2396,
          outcome: 'cancelled'
        },
        {
          group: 'outdoor',
          mirror: 3,
          hedgeOffsetMs: 3002,
          durationMs: 895,
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
          hedgeOffsetMs: 1499,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 3,
          hedgeOffsetMs: 3000,
          durationMs: 8000,
          outcome: 'timeout'
        },
        {
          group: 'seasonal',
          mirror: 4,
          hedgeOffsetMs: 4500,
          durationMs: 8001,
          outcome: 'timeout'
        }
      ]
    }

### 01:01:51 GET / 200 [info/serverless]
dep=dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm branch=fix/date-night-live-discovery-resilience-1 cache=MISS
