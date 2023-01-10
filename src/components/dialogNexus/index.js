import ContextHandler from "../contextHandler";
import Dialog from "../dialogEngine";

class DialogNexus {
  constructor ({db, logger}, config) {
    this.dialogs = {}
    this.db = db;
    this.config = config;
    this.logger = logger.child({module: 'DialogNexus'})
    this.contextHandler = new ContextHandler({logger: this.logger},config.context)
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
    const dialog = new Dialog(skillset)
    if(!this.dialogs[dialog.assistantId]) {
      this.dialogs[dialog.assistantId] = {}
    }
    this.dialogs[dialog.assistantId][dialog.id] = dialog;
    dialog.init();
  }

  processResponse(assistantId, skillsetId, message, sessionId) {
    this.logger.info('Processing response')
    const context = this.contextHandler.getContext(sessionId);
    const response = this.dialogs[assistantId][skillsetId].converse(message, context)
    return response || 'Hello world'
  }
}

export default DialogNexus