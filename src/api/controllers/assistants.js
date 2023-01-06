function userController(logger, db) {
    return {
      get: async function getAssistants(req, res) {
        const log = logger.child({ function: 'registerUser' });
        try {
          const assistants = db.assistants.getAll()
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
     }
    };
}

export default userController