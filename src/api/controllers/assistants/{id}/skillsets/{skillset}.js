function skillsetController(logger, db, errors) {
  return {
    get: async function getAssistantSkillset(req, res) {
      const log = logger.child({ module: 'skillsetController', method: 'getAssistantSkillset' });
      try {
        const {id, skillsetId} = req.params;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        const skillset = await db.skillsets.getOne(skillsetId, id)
        if (!skillset) {
          log.warn({assistantId: id},'Skillset does not exist')
          throw new errors.NotFoundError('Skillset does not exist')
        }
        res.status(200).send({
          skillset: skillset.toJSON()
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message},'Could not find assistant skillset')
          res.status(500).send({
              message: 'Could not get assistant'
          })
        }
      }
    },
    patch: async function updateSkillset(req, res) {
      const log = logger.child({ module: 'skillsetController', method: 'updateSkillset' });
      try {
        const {id, skillsetId} = req.params;
        const {dialog} = req.body;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        const skillset = await db.skillsets.getOne(skillsetId, id)
        if (!skillset) {
          log.warn({assistantId: id},'Skillset does not exist')
          throw new errors.NotFoundError('Skillset does not exist')
        }
        await skillset.update(dialog)
        res.status(200).send({
          skillset: skillset.toJSON()
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message},'Could not find assistant skillset')
          res.status(500).send({
              message: 'Could not get assistant'
          })
        }
      }
    }
  };
}

export default skillsetController