import Skillset from "../models/skillset";
import { v4 as uuid } from 'uuid'

class Skillsets{
  constructor(db) {
    this.db = db;
    this.collection= this.db.collection('skillsets')
  }

  async getAll(filter) {
    const where = {}
    if (filter?.assistantId) {
      where.assistantId = filter.assistantId
    }
    const skillsets = await this.collection.find(where).toArray();
    return skillsets.map((assistant) => new Skillset(this.collection, assistant))
  }

  async getById(id) {
    const skillset = await this.collection.findOne({_id: id})
    if(skillset) {
      return new Skillset(this.collection, skillset)
    } else {
      return null
    }
  }

  async getOne(id, assistantId) {
    const skillset = await this.collection.findOne({_id: id, assistantId})
    if(skillset) {
      return new Skillset(this.collection, skillset)
    } else {
      return null
    }
  }

  async create(skillsetData) {
    skillsetData.createdAt = Date.now()
    const createSkillset= {
      _id: uuid(),
      ...skillsetData,
      dialog: [
        {label: "ROOT", "name": "ROOT", "response": "Send 1 for branch 1, 2 for branch 2", "condition":"message EQ /start", "goTo": "", "parent": ""},
        {label: "Default", "name": "Default", "response": "default message", "condition":"Anything else", "goTo": "", "parent": ""}
      ]
    }
    const skillset = await this.collection.insertOne(createSkillset);
    return this.getById(skillset.insertedId)
  }
}

export default Skillsets