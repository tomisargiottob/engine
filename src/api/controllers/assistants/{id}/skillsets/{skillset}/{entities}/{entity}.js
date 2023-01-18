function entityInstanceController(logger, db, errors, entities) {
  return {
    patch: async function updateEntity(req, res) {
      const log = logger.child({ module: 'entityInstanceController', method: 'updateEntity' });
      try {
        const {id, skillset: skillsetId, entityId} = req.params;
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
        const updatedEntity = await entities.updateEntity(id, skillsetId, entityId, req.body)
        res.status(200).send(updatedEntity)
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message },'Could not update skillset entity')
          res.status(500).send({
              message: 'Could not update skillset entity'
          })
        }
      }
    },
    delete: async function removeSkillsetEntities(req, res) {
      const log = logger.child({ module: 'entityInstanceController', method: 'removeSkillsetEntities' });
      try {
        const {id, skillset: skillsetId, entityId} = req.params;
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
        await entities.deleteEntity(id, skillsetId, entityId)
        res.status(204).send()
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message },'Could not remove skillset entity')
          res.status(500).send({
              message: 'Could not remove skillset entity'
          })
        }
      }
    },
    get: async function getSkillsetEntity(req, res) {
      const log = logger.child({ module: 'entityInstanceController', method: 'getSkillsetEntity' });
      try {
        const {id, skillset: skillsetId, entityId} = req.params;
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
        const entity = await entities.getEntity(id, skillsetId, entityId)
        res.status(200).send(entity)
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message },'Could not fetch skillset entity')
          res.status(500).send({
              message: 'Could not fetch skillset entity'
          })
        }
      }
    },
  };
}

export default entityInstanceController