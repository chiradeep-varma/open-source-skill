'use strict';

const COMPONENT_STATUSES = [
  'operational',
  'under_maintenance',
  'degraded_performance',
  'partial_outage',
  'major_outage',
];

const COMPONENT_STATUS_LABELS = {
  operational: 'Operational',
  under_maintenance: 'Under maintenance',
  degraded_performance: 'Degraded performance',
  partial_outage: 'Partial outage',
  major_outage: 'Major outage',
};

const OVERALL_LABELS = {
  operational: 'All systems operational',
  under_maintenance: 'Under maintenance',
  degraded_performance: 'Degraded performance',
  partial_outage: 'Partial outage',
  major_outage: 'Major outage',
};

const RANK = {
  operational: 0,
  under_maintenance: 1,
  degraded_performance: 2,
  partial_outage: 3,
  major_outage: 4,
};

const INCIDENT_STATUSES = ['investigating', 'identified', 'monitoring', 'resolved'];
const MAINTENANCE_STATUSES = ['scheduled', 'in_progress', 'completed'];
const IMPACTS = ['maintenance', 'minor', 'major', 'critical'];

// Worst-status-wins: the page banner reflects the single worst component
// status currently reported, never an average or a vote.
function computeOverallStatus(components) {
  if (!components || components.length === 0) return 'operational';
  let worst = 'operational';
  for (const c of components) {
    if (RANK[c.status] > RANK[worst]) worst = c.status;
  }
  return worst;
}

function overallLabel(status) {
  return OVERALL_LABELS[status] || OVERALL_LABELS.operational;
}

function componentLabel(status) {
  return COMPONENT_STATUS_LABELS[status] || status;
}

module.exports = {
  COMPONENT_STATUSES,
  COMPONENT_STATUS_LABELS,
  OVERALL_LABELS,
  INCIDENT_STATUSES,
  MAINTENANCE_STATUSES,
  IMPACTS,
  computeOverallStatus,
  overallLabel,
  componentLabel,
};
