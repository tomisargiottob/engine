function assistantsController(logger, db, dialogNexus) {
  return {
    get: async function getAssistants(req, res) {
      const log = logger.child({ module: 'assistantsController', method: 'getAssistants' });
      try {
        const assistants = await db.assistants.getAll()
        log.info('Assistants found')
        const parsedAssistants = assistants.map((assistant) => assistant.toJson())
        res.status(200).send({
          assistants: parsedAssistants
        })
      } catch (err){
          log.error({reason: err.message},'Could not find assistants')
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
        log.info('Assistant created')
        const skillset = await db.skillsets.create({name: 'published', assistantId: assistant.id});
        await dialogNexus.initializeDialog(skillset)
        res.status(200).send(
          assistant.toJson()
        )
      } catch (err){
        log.error({reason: err.message},'Could not find assistants')
        res.status(500).send({
          message: err.message
        })
      }
    }
  };
}

export default assistantsController