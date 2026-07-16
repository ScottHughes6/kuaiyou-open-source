const { test } = require("node:test");
const assert = require("node:assert/strict");
const { withDeviceLock, TimeoutError } = require("../build/device.js");

test("withDeviceLock serializes overlapping operations", async () => {
  const events = [];
  const makeTask = (label, delay) => async () => {
    events.push(`start:${label}`);
    await new Promise((r) => setTimeout(r, delay));
    events.push(`end:${label}`);
    return label;
  };

  // Start B while A is still "running"; the lock must run them one at a time.
  const a = withDeviceLock(makeTask("A", 30));
  const b = withDeviceLock(makeTask("B", 5));
  const results = await Promise.all([a, b]);

  assert.deepEqual(results, ["A", "B"]);
  assert.deepEqual(events, ["start:A", "end:A", "start:B", "end:B"]);
});

test("withDeviceLock keeps the chain alive after a rejected task", async () => {
  const failing = withDeviceLock(async () => {
    throw new Error("boom");
  });
  await assert.rejects(failing, /boom/);

  // A subsequent task must still run despite the prior rejection.
  const ok = await withDeviceLock(async () => "recovered");
  assert.equal(ok, "recovered");
});

test("TimeoutError is exported and named", () => {
  const err = new TimeoutError("x");
  assert.equal(err.name, "TimeoutError");
  assert.ok(err instanceof Error);
});
