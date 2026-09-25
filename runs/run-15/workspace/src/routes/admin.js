'use strict';

const express = require('express');
const models = require('../models');
const { verifyLogin, requireAuth } = require('../auth');
const status = require('../status');

function createAdminRouter(db, config) {
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.siteTitle = config.siteTitle;
    res.locals.siteDescription = config.siteDescription;
    res.locals.isAdmin = Boolean(req.session && req.session.userId);
    next();
  });

  router.get('/login', (req, res) => {
    if (req.session.userId) return res.redirect('/admin');
    res.render('admin/login', { pageTitle: `Sign in — ${config.siteTitle}`, error: null });
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = verifyLogin(db, username || '', password || '');
    if (!user) {
      return res.status(401).render('admin/login', {
        pageTitle: `Sign in — ${config.siteTitle}`,
        error: 'Incorrect username or password.',
      });
    }
    req.session.userId = user.id;
    res.redirect('/admin');
  });

  router.post('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
  });

  router.use(requireAuth);

  router.get('/', (req, res) => {
    const components = models.listComponents(db);
    const incidents = models.listIncidents(db, { limit: 20 });
    res.render('admin/dashboard', {
      pageTitle: `Admin — ${config.siteTitle}`,
      components,
      incidents,
      componentStatuses: status.COMPONENT_STATUSES,
      componentLabel: status.componentLabel,
    });
  });

  // Components

  router.get('/components/new', (req, res) => {
    res.render('admin/component-form', {
      pageTitle: `New component — ${config.siteTitle}`,
      component: null,
      componentStatuses: status.COMPONENT_STATUSES,
      componentLabel: status.componentLabel,
    });
  });

  router.post('/components', (req, res) => {
    const { name, description, group_name, position } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).render('admin/component-form', {
        pageTitle: `New component — ${config.siteTitle}`,
        component: req.body,
        error: 'Name is required.',
        componentStatuses: status.COMPONENT_STATUSES,
        componentLabel: status.componentLabel,
      });
    }
    models.createComponent(db, {
      name: name.trim(),
      description,
      group_name,
      position: Number(position) || 0,
    });
    res.redirect('/admin');
  });

  router.get('/components/:id/edit', (req, res) => {
    const component = models.getComponent(db, req.params.id);
    if (!component) return res.status(404).send('Component not found');
    res.render('admin/component-form', {
      pageTitle: `Edit ${component.name} — ${config.siteTitle}`,
      component,
      componentStatuses: status.COMPONENT_STATUSES,
      componentLabel: status.componentLabel,
    });
  });

  router.post('/components/:id', (req, res) => {
    const { name, description, group_name, position, status: newStatus } = req.body;
    if (!name || !name.trim()) {
      const component = models.getComponent(db, req.params.id);
      return res.status(400).render('admin/component-form', {
        pageTitle: `Edit ${component.name} — ${config.siteTitle}`,
        component: { ...component, ...req.body },
        error: 'Name is required.',
        componentStatuses: status.COMPONENT_STATUSES,
        componentLabel: status.componentLabel,
      });
    }
    models.updateComponent(db, req.params.id, {
      name: name.trim(),
      description,
      group_name,
      position: Number(position) || 0,
      status: newStatus,
    });
    res.redirect('/admin');
  });

  router.post('/components/:id/delete', (req, res) => {
    models.deleteComponent(db, req.params.id);
    res.redirect('/admin');
  });

  // Incidents & maintenance (an incident with impact = 'maintenance')

  router.get('/incidents/new', (req, res) => {
    const kind = req.query.kind === 'maintenance' ? 'maintenance' : 'incident';
    res.render('admin/incident-form', {
      pageTitle: `New ${kind === 'maintenance' ? 'maintenance window' : 'incident'} — ${config.siteTitle}`,
      kind,
      components: models.listComponents(db),
      incidentStatuses: status.INCIDENT_STATUSES,
      maintenanceStatuses: status.MAINTENANCE_STATUSES,
      impacts: status.IMPACTS,
      error: null,
      values: {},
    });
  });

  router.post('/incidents', (req, res) => {
    const { title, impact, status: incStatus, body, scheduled_for, scheduled_until } = req.body;
    const componentIds = [].concat(req.body.component_ids || []).map(Number).filter(Boolean);
    const kind = impact === 'maintenance' ? 'maintenance' : 'incident';

    if (!title || !title.trim() || !body || !body.trim()) {
      return res.status(400).render('admin/incident-form', {
        pageTitle: `New ${kind === 'maintenance' ? 'maintenance window' : 'incident'} — ${config.siteTitle}`,
        kind,
        components: models.listComponents(db),
        incidentStatuses: status.INCIDENT_STATUSES,
        maintenanceStatuses: status.MAINTENANCE_STATUSES,
        impacts: status.IMPACTS,
        error: 'Title and an initial update are required.',
        values: req.body,
      });
    }

    const incident = models.createIncident(db, {
      title: title.trim(),
      impact,
      status: incStatus,
      body: body.trim(),
      componentIds,
      scheduled_for: scheduled_for || null,
      scheduled_until: scheduled_until || null,
    });

    // Reflect the incident's chosen status onto the components it names,
    // so the public page's worst-status banner updates immediately.
    if (impact !== 'maintenance') {
      const componentStatus = impactToComponentStatus(impact, incStatus);
      for (const id of componentIds) {
        models.setComponentStatus(db, id, componentStatus);
      }
    } else {
      for (const id of componentIds) {
        models.setComponentStatus(db, id, 'under_maintenance');
      }
    }

    res.redirect(`/admin/incidents/${incident.id}`);
  });

  router.get('/incidents/:id', (req, res) => {
    const incident = models.getIncident(db, req.params.id);
    if (!incident) return res.status(404).send('Incident not found');
    res.render('admin/incident-detail', {
      pageTitle: `${incident.title} — ${config.siteTitle}`,
      incident,
      updates: models.getIncidentUpdates(db, incident.id),
      linkedComponents: models.getIncidentComponents(db, incident.id),
      incidentStatuses: status.INCIDENT_STATUSES,
      maintenanceStatuses: status.MAINTENANCE_STATUSES,
    });
  });

  router.post('/incidents/:id/updates', (req, res) => {
    const { body, status: newStatus } = req.body;
    const incident = models.getIncident(db, req.params.id);
    if (!incident) return res.status(404).send('Incident not found');
    if (!body || !body.trim()) {
      return res.status(400).render('admin/incident-detail', {
        pageTitle: `${incident.title} — ${config.siteTitle}`,
        incident,
        updates: models.getIncidentUpdates(db, incident.id),
        linkedComponents: models.getIncidentComponents(db, incident.id),
        incidentStatuses: status.INCIDENT_STATUSES,
        maintenanceStatuses: status.MAINTENANCE_STATUSES,
        error: 'An update needs a message.',
      });
    }

    models.addIncidentUpdate(db, incident.id, { body: body.trim(), status: newStatus });

    const linked = models.getIncidentComponents(db, incident.id);
    const resolved = newStatus === 'resolved' || newStatus === 'completed';
    for (const c of linked) {
      models.setComponentStatus(
        db,
        c.id,
        resolved
          ? 'operational'
          : incident.impact === 'maintenance'
          ? 'under_maintenance'
          : impactToComponentStatus(incident.impact, newStatus)
      );
    }

    res.redirect(`/admin/incidents/${incident.id}`);
  });

  return router;
}

function impactToComponentStatus(impact, incidentStatus) {
  if (incidentStatus === 'resolved') return 'operational';
  if (impact === 'critical') return 'major_outage';
  if (impact === 'major') return 'partial_outage';
  return 'degraded_performance';
}

module.exports = { createAdminRouter };
