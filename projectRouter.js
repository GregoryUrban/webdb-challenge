const express = require('express'); 

const router = express.Router();
const ProjectModel = require('./helpers/projectModel');
const ActionModel = require('./helpers/actionModel');


router.use((req,res,next)=> {
  console.log('projectRouter yippee');
  next();
})

// custom middleware
const logger = require('./logger'); 
router.use(logger);


// endpoints

// /api/projects = ProjectModel
// /api/projects/:id/actions= ActionModel

// Adding a new Project: using ProjectModel
router.post('/', validateProject, async (req, res) => {
    try {
      const project = await ProjectModel.insert(req.body);
      res.status(201).json(project);
    } catch (error) {
      console.log(error);
      next(({message: 'Error getting the posts for the project'}));
    }
  });

  // Adding a new project action using ActionModel
  router.post('/:id/actions', validateAction, async (req, res) => {
    const actionInfo = { ...req.body};

    try {
      const action = await ActionModel.insert(actionInfo);
      res.status(210).json(action);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'missing action data'
      });
    }
});

// Getting all projects using ProjectModel
router.get('/', async (req, res) => {
    try {
      const projects = await ProjectModel.getter(req.query);
      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      next(({message: 'Error retrieving the projects Greg'}))
    }
  });

// Getting a specific project using ProjectModel
router.get('/:id', validateProjectId, async (req, res) => {
    try {
        const project = await ProjectModel.get(req.params.id);
    
        if (project) {
          res.status(200).json(project);
        } else {
        next(({message: 'project not found'}))
        }
      } catch (error) {
        console.log(error);
        next(({message: 'Error retrieving the project'}))
      }
});

// Getting actions for a specific project using ActionModel
router.get('/:id/actions', validateProjectId, async (req, res) => {
   
    try {
        const actions = await ProjectModel.getProjectActions(req.params.id);
    
        res.status(200).json(actions);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Error getting the messages for the hub',
        });
      }
   
});

// Deleting a specific project using ProjectModel
router.delete('/:id', validateProjectId, async (req, res) => {
    try {
        const count = await ProjectModel.remove(req.params.id);
        if (count > 0) {
          res.status(200).json({ message: 'The project has been nuked' });
        } else {
          res.status(404).json({ message: 'The project could not be found' });
        }
      } catch (error) {
        console.log(error);
        next(({message: 'Error removing the project'}));
      }
});

// Deleting specific action for a specific project using ActionModel
router.delete('/:id/actions/:id', validateAction, async (req, res) => {
    try {
        const count = await ActionModel.remove(req.params.id);
        if (count > 0) {
          res.status(200).json({ message: 'The action has been nuked' });
        } else {
          res.status(404).json({ message: 'The action could not be found' });
        }
      } catch (error) {
        console.log(error);
        next(({message: 'Error removing the project'}));
      }
});

// Updating a specific project using ProjectModel
router.put('/:id/', validateProjectId, async (req, res) => {

    try {
        const project = await ProjectModel.update(req.params.id, req.body);
        if (project) {
          res.status(200).json(project);
        } else {
          res.status(404).json({ message: 'The project could not be found' });
        }
      } catch (error) {
        console.log(error);
        next(({message: 'Error updating the project'}));
      }

});

// Updating a specific action using ActionModel
router.put('/:id/actions/:id', validateAction, async (req, res) => {

    try {
        const action = await ActionModel.update(req.params.id, req.body);
        if (action) {
          res.status(200).json(action);
        } else {
          res.status(404).json({ message: 'The action could not be found' });
        }
      } catch (error) {
        console.log(error);
        next(({message: 'Error updating the action'}));
      }

});

//custom middleware

// Check for accurate projectID ProjectModel
async function validateProjectId (req, res, next) {
    try{
      const { id } = req.params;
      const project = await ProjectModel.get(id);
      if(project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({message: 'invalid project id'});
      }
    } catch (err) {
        next(({message: 'failed to process async request'}));
    } 
  
  }

// Making sure required fields are entered when posting ProjectModel
function validateProject(req, res, next) { 
    
    if (req.body && Object.keys(req.body).length) {
    next();
    } else {
    next(({message: 'missing project data'}));
    }
}

// Making sure required fields are entered when posting ActionModel
function validateAction(req, res, next) {

    if (req.body && Object.keys(req.body).length) {
        next();
        } else {
        next(({message: 'missing required action text field"'}));
        }
};

module.exports = router;
