function converseController(logger, db, errors) {
  return {
    post: async function converse(req, res) {
      const log = logger.child({ module: 'converseController', method: 'converse' });
      try {
        const {id, skillsetId} = req.params;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        const skillset = await assistant.getSkillset(skillsetId)
        if (!skillset) {
          log.warn({assistantId: id},'Skillset does not exist')
          throw new errors.NotFoundError('Skillset does not exist')
        }
        const response = await skillset.converse();
        res.status(200).send({
          response
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error('Could not find assistant')
          res.status(500).send({
              message: 'Could not get assistant'
          })
        }
      }
   }
  };
}

export default converseController