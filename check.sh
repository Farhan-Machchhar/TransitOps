#!/bin/bash
export PRISMA_TELEMETRY_DISABLED=1
export NEXT_TELEMETRY_DISABLED=1
node check_db.js < /dev/null
