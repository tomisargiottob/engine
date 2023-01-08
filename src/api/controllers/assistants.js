function assistantsController(logger, db) {
  return {
    get: async function getAssistants(req, res) {
      const log = logger.child({ module: 'assistantsController', method: 'getAssistants' });
      try {
        const assistants = await db.assistants.getAll()
        log.info('Assistants found')
        res.status(200).send({
          assistants
        })
      } catch {
          log.error('Could not find assistants')
          res.status(500).send({
              message: 'Could not get assistants'
          })
      }
    },
    post: async function createAssistant(req, res) {
      const log = logger.child({ module: 'assistantsController', method: 'createAssistant' });
      log.info('Request to create an assistant received')
      try {
        const assistantData = req.body;
        const assistant = await db.assistants.create(assistantData)
        console.log(assistant.toJson());
        log.info('Assistant created')
        res.status(200).send(
          assistant.toJson()
        )
      } catch (err){
        res.status(500).send({
          message: err.message
        })
      }
    }
  };
}

export default assistantsController