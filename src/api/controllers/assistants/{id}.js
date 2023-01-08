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
        res.status(200).send({
          assistant
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

export default assistantController