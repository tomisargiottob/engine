import Dialog from "../dialogEngine";

class DialogNexus {
  constructor ({db}, config) {
    this.dialogs = {}
    this.db = db;
    this.config = config;
  }

  init() {
    const skillsets = this.db.skillsets.getAll();
    for( const skillset of skillsets) {
      const dialog = new Dialog(skillset)
      if(this.dialogs[dialog.assistantId]) {
        this.dialog[dialog.assistantId] = {}
      }
      this.dialogs[dialog.assistantId][dialog.id] = dialog;
      dialog.init();
    }
  }

  processResponse(assistantId, skillsetId, message) {
    console.log(message, assistantId,skillsetId)
    return 'Hello world'
  }
}

export default DialogNexus