'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { computeOverallStatus } = require('../src/status');

test('no components means operational', () => {
  assert.equal(computeOverallStatus([]), 'operational');
});

test('all operational stays operational', () => {
  const components = [{ status: 'operational' }, { status: 'operational' }];
  assert.equal(computeOverallStatus(components), 'operational');
});

test('worst status wins over a mix', () => {
  const components = [
    { status: 'operational' },
    { status: 'degraded_performance' },
    { status: 'major_outage' },
  ];
  assert.equal(computeOverallStatus(components), 'major_outage');
});

test('under_maintenance ranks below any real outage', () => {
  const components = [{ status: 'under_maintenance' }, { status: 'partial_outage' }];
  assert.equal(computeOverallStatus(components), 'partial_outage');
});

test('under_maintenance still outranks fully operational', () => {
  const components = [{ status: 'under_maintenance' }, { status: 'operational' }];
  assert.equal(computeOverallStatus(components), 'under_maintenance');
});

test('order of components does not change the result', () => {
  const a = [{ status: 'major_outage' }, { status: 'operational' }];
  const b = [{ status: 'operational' }, { status: 'major_outage' }];
  assert.equal(computeOverallStatus(a), computeOverallStatus(b));
});
