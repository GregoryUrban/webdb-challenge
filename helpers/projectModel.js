const db = require('../data/dbConfig');
const helpers = require('./helpers');


module.exports = {
  getter,
  get,
  insert,
  update,
  remove,
  getProjectActions,
};

function getter() {
  return db('projects');
}

function get(id) {
  let query = db('projects as p');

  if (id) {
    query.where('p.id', id).first();

    const promises = [query, this.getProjectActions(id)]; 

    return Promise.all(promises).then(function(results) {
      let [project, actions] = results;

      if (project) {
        project.actions = actions;

        return helpers.projectToBody(project);
      } else {
        return null;
      }
    });
  }

  return query.then(projects => {
    return projects.map(project => helpers.projectToBody(project));
  });
}

function insert(project) {
  return db('projects')
    .insert(project)
    .then(([id]) => this.get(id));
}

function update(id, changes) {
  return db('projects')
    .where('id', id)
    .update(changes)
    .then(count => (count > 0 ? this.get(id) : null));
}

function remove(id) {
  return db('projects')
    .where('id', id)
    .del();
}

function getProjectActions(projectId) {
  return db('actions')
    .where('project_id', projectId)
    .then(actions => actions.map(action => helpers.actionToBody(action)));
}
