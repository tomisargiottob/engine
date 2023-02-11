function interactionsController(logger, db, errors) {
  return {
    get: async function getSkillsetInteractions(req, res) {
      const log = logger.child({ module: 'interactionsControllers', method: 'getSkillsetInteractions' });
      try {
        const {id, skillset: skillsetId} = req.params;
        const { sessionId } = req.query
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
        const fetchedInteractions = await db.interactions.getAll({ skillsetId, assistantId: id, sessionId})
        log.info('Sending fetched interactions')
        res.status(200).send(fetchedInteractions)
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message },'Could not find skillset interactions')
          res.status(500).send({
              message: 'Could not find skillset interactions'
          })
        }
      }
    },
  };
}

export default interactionsController