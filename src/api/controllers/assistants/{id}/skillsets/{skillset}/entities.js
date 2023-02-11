function entitiesController(logger, db, errors, entities) {
  return {
    get: async function getSkillsetEntities(req, res) {
      const log = logger.child({ module: 'entitiesController', method: 'getSkillsetEntities' });
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
        const fetchedEntities = await entities.getEntities(id, skillsetId)
        log.info('Sending fetched entities')
        res.status(200).send(fetchedEntities)
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message },'Could not find skillset entities')
          res.status(500).send({
              message: 'Could not find skillset entities'
          })
        }
      }
    },
    post: async function createSkillsetEntity(req, res) {
      const log = logger.child({ module: 'entitiesController', method: 'createSkillsetEntity' });
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
        const createdEntity = await entities.createEntity(id, skillsetId, req.body)
        res.status(200).send(
          createdEntity
        )
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message },'Could not create skillset entity')
          res.status(500).send({
              message: 'Could not create skillset entity'
          })
        }
      }
    }
  };
}

export default entitiesController