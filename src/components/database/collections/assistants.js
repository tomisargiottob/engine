import Assistant from "../models/assistant";

class Assistants{
  constructor(db) {
    this.db = db;
    this.collection= this.db.collection('assistants')
  }

  async getAll() {
    const assistants = await this.collection.find({}).toArray();
    return assistants.map((assistant) => new Assistant(this.collection, assistant))
  }
}

export default Assistants