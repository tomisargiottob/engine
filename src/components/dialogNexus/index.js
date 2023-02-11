import ContextHandler from "../contextHandler";
import Dialog from "../dialogEngine";

class DialogNexus {
  constructor ({db, logger, entities}, config) {
    this.dialogs = {}
    this.db = db;
    this.config = config;
    this.logger = logger.child({module: 'DialogNexus'})
    this.contextHandler = new ContextHandler({logger: this.logger},config.context)
    this.entityHandler = entities
  }

  async init() {
    this.logger.info('Initializing dialog nexus')
    const skillsets = await this.db.skillsets.getAll();
    for( const skillset of skillsets) {
      this.initializeDialog(skillset)
    }
  }
  
  initializeDialog(skillset) {
    this.logger.info(`Initializing assistant ${skillset.assistantId}, skillset ${skillset.id}`)
    const dialog = new Dialog({skillset, logger: this.logger})
    if(!this.dialogs[dialog.assistantId]) {
      this.dialogs[dialog.assistantId] = {}
    }
    this.dialogs[dialog.assistantId][dialog.id] = dialog;
    dialog.init();
  }

  async processResponse(assistantId, skillsetId, message, sessionId) {
    this.logger.info('Processing response')
    const context = this.contextHandler.getContext(sessionId);
    if(!message.startsWith('/')) {
      const entities = await this.entityHandler.identifyEntities(assistantId, skillsetId, message)
      context.setContext(entities)
    }
    const [response, lastNode] = this.dialogs[assistantId][skillsetId].converse(message, context)
    context.setContext({lastNode})
    await this.db.interactions.create({message, response, skillsetId, assistantId, sessionId: context.id, context: context.toJson()})
    context.cleanTemporaryState({lastNode})
    return [response, context.id]
  }
}

export default DialogNexus