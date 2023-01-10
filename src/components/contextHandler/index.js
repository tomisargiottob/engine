import { v4 as uuid } from "uuid";

class ContextHandler {
  constructor({logger}, config) {
    this.sessions={};
    this.config = config;
    this.logger = logger.child({module: 'ContextHandler'})
  }

  getContext(sessionId) {
    this.logger.info({method: 'getContext'}, 'Getting session context if existent')
    const newSessionId = sessionId || uuid()
    if(!this.sessions[newSessionId]) {
      this.sessions[newSessionId] = {
        id: newSessionId
      }
    }
    clearTimeout(this.sessions[newSessionId].timeout)
    this.sessions[newSessionId].timeout = setTimeout(() => {
      delete this.sessions[newSessionId]
      this.logger.info(`Session ${newSessionId} expired`)
    }, this.config.timeout)
    return this.sessions[newSessionId]
  }
}

export default ContextHandler;