function assistantController(logger, db, errors) {
  return {
    get: async function getAssistant(req, res) {
      const log = logger.child({ module: 'assistantController', method: 'getAssistant' });
      try {
        const {id} = req.params;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        res.status(200).send(
          assistant.toJson()
        )
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message}, 'Could not find assistant')
          res.status(500).send({
              message: 'Could not get assistant'
          })
        }
      }
    },
    patch: async function updateAssistant(req, res) {
      const log = logger.child({ module: 'assistantController', method: 'updateAssistant' });
      try {
        const {id} = req.params;
        const { name } = req.body;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        await assistant.update(name)
        res.status(200).send({
          assistant: assistant.toJSON()
        })
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message}, 'Could not find assistant')
          res.status(500).send({
              message: 'Could not update assistant'
          })
        }
      }
    },
    delete: async function removeAssistant(req, res) {
      const log = logger.child({ module: 'assistantController', method: 'removeAssistant' });
      try {
        const {id} = req.params;
        const assistant = await db.assistants.getById(id)
        if (!assistant) {
          log.warn({assistantId: id},'Assistant does not exist')
          throw new errors.NotFoundError('Assistant does not exist')
        }
        log.info('Assistant found')
        await assistant.remove()
        res.status(204).send({})
      } catch (err) {
        if (err instanceof errors.NotFoundError) {  
          res.status(404).send({message: err.message})
        } else {
          log.error({reason: err.message}, 'Could not find assistant')
          res.status(500).send({
              message: 'Could not remove assistant'
          })
        }
      }
    } 
  };
}

export default assistantController