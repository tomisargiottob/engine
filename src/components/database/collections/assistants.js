import Assistant from "../models/assistant";
import { v4 as uuid } from 'uuid'

class Assistants{
  constructor(db) {
    this.db = db;
    this.collection= this.db.collection('assistants')
  }

  async getAll() {
    const assistants = await this.collection.find({}).toArray();
    return assistants.map((assistant) => new Assistant(this.collection, assistant))
  }

  async getById(id) {
    const assistant = await this.collection.findOne({_id:id});
    if(assistant) {
      return new Assistant(this.collection, assistant)
    } else {
      return null
    }
  }

  async create(assistantData) {
    const assistant = await this.collection.insertOne({_id: uuid(), ...assistantData});
    return this.getById(assistant.insertedId)
  }
}

export default Assistants