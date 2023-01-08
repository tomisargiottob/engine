function skillsetsController(logger, db, errors) {
  return {
    get: async function getAssistantSkillsets(req, res) {
      const log = logger.child({ module: 'skillsetsController', method: 'getAssistantSkillsets' });
      try {
        const {id} = req.params;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        const skillsets = await assistant.getSkillsets(id)
        res.status(200).send({
          skillsets
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error('Could not find assistants skillsets')
          res.status(500).send({
              message: 'Could not get assistants skillsets'
          })
        }
      }
   }
  };
}

export default skillsetsController