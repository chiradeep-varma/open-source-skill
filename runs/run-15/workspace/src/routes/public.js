'use strict';

const express = require('express');
const models = require('../models');
const { computeOverallStatus, overallLabel } = require('../status');
const { buildIncidentsRss } = require('../rss');

function bannerTone(status) {
  if (status === 'operational') return 'operational';
  if (status === 'under_maintenance') return 'maintenance';
  if (status === 'major_outage' || status === 'partial_outage') return 'danger';
  return 'warning';
}

function groupComponents(components) {
  const groups = new Map();
  for (const c of components) {
    const key = c.group_name || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(c);
  }
  return Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
}

function attachDetails(db, incidents) {
  return incidents.map((incident) => ({
    ...incident,
    updates: models.getIncidentUpdates(db, incident.id),
    components: models.getIncidentComponents(db, incident.id),
  }));
}

function monthGroups(incidents) {
  const groups = new Map();
  for (const incident of incidents) {
    const d = new Date(incident.created_at);
    const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(incident);
  }
  return Array.from(groups.entries()).map(([month, items]) => ({ month, items }));
}

function createPublicRouter(db, config) {
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.siteTitle = config.siteTitle;
    res.locals.siteDescription = config.siteDescription;
    res.locals.isAdmin = Boolean(req.session && req.session.userId);
    next();
  });

  router.get('/', (req, res) => {
    const components = models.listComponents(db);
    const overall = computeOverallStatus(components);
    const activeIncidents = attachDetails(
      db,
      models.listIncidents(db, { onlyUnresolved: true })
    );
    const activeMaintenances = attachDetails(db, models.listActiveMaintenances(db));
    const recentHistory = attachDetails(
      db,
      models.listIncidents(db).filter((i) => i.status === 'resolved' || i.status === 'completed')
    ).slice(0, 5);

    res.render('public/index', {
      pageTitle: config.siteTitle,
      overall,
      overallLabel: overallLabel(overall),
      bannerTone: bannerTone(overall),
      componentGroups: groupComponents(components),
      activeIncidents,
      activeMaintenances,
      recentHistory,
    });
  });

  router.get('/incidents', (req, res) => {
    const all = attachDetails(db, models.listIncidents(db));
    res.render('public/incidents', {
      pageTitle: `Incident history — ${config.siteTitle}`,
      monthGroups: monthGroups(all),
    });
  });

  router.get('/incidents/:id', (req, res) => {
    const incident = models.getIncident(db, req.params.id);
    if (!incident) return res.status(404).render('public/not-found', { pageTitle: 'Not found' });
    const detailed = attachDetails(db, [incident])[0];
    res.render('public/incident-detail', {
      pageTitle: `${incident.title} — ${config.siteTitle}`,
      incident: detailed,
    });
  });

  router.get('/api/status.json', (req, res) => {
    const components = models.listComponents(db);
    const overall = computeOverallStatus(components);
    const activeIncidents = attachDetails(
      db,
      models.listIncidents(db, { onlyUnresolved: true })
    );
    res.json({
      status: overall,
      status_label: overallLabel(overall),
      components: components.map((c) => ({
        id: c.id,
        name: c.name,
        group: c.group_name || null,
        status: c.status,
      })),
      active_incidents: activeIncidents.map((i) => ({
        id: i.id,
        title: i.title,
        impact: i.impact,
        status: i.status,
        created_at: i.created_at,
      })),
      generated_at: new Date().toISOString(),
    });
  });

  router.get('/feed.xml', (req, res) => {
    const incidents = models
      .listIncidents(db, { limit: 20 })
      .map((incident) => {
        const updates = models.getIncidentUpdates(db, incident.id);
        const latest = updates[updates.length - 1];
        return { ...incident, latestBody: latest ? latest.body : '' };
      });
    const xml = buildIncidentsRss({
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      baseUrl: config.baseUrl,
      incidents,
    });
    res.type('application/rss+xml').send(xml);
  });

  return router;
}

module.exports = { createPublicRouter, groupComponents, monthGroups, bannerTone };
