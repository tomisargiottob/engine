function skillsetController(logger, db, errors) {
  return {
    get: async function getAssistantSkillset(req, res) {
      const log = logger.child({ module: 'skillsetController', method: 'getAssistantSkillset' });
      try {
        const {id, skillset: skillsetId} = req.params;
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
        log.info('Skillset found')

        res.status(200).send({
          skillset: skillset.toJson()
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message},'Could not find assistant skillset')
          res.status(500).send({
              message: 'Could not get assistant skillset'
          })
        }
      }
    },
    patch: async function updateSkillset(req, res) {
      const log = logger.child({ module: 'skillsetController', method: 'updateSkillset' });
      try {
        const {id, skillset:skillsetId} = req.params;
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
        if(dialog && (!dialog.find((node) => node.name === 'ROOT' && !node.parent ) || !dialog.find((node) => node.name === 'Default' && !node.parent ))) {
          throw new errors.ValidationError('Can not delete Root node')
        }
        await skillset.update(dialog)
        const updatedSlillset = await db.skillsets.getOne(skillsetId, id)
        log.info('Assistant skillset successfully updated')
        res.status(200).send({
          skillset: updatedSlillset.toJson()
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message},'Could not find assistant skillset')
          res.status(500).send({
              message: 'Could not update assistant'
          })
        }
      }
    }
  };
}

export default skillsetController