import Skillset from "../models/skillset";
import { v4 as uuid } from 'uuid'

class Skillsets{
  constructor(db) {
    this.db = db;
    this.collection= this.db.collection('skillsets')
  }

  async getAll(filter) {
    const skillsets = await this.collection.find({assistantId : filter.assistantId}).toArray();
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

  async create(skillsetData) {
    const createSkillset= {
      _id: uuid(),
      ...skillsetData,
      dialog: []
    }
    const skillset = await this.collection.insertOne(createSkillset);
    return this.getById(skillset.insertedId)
  }
}

export default Skillsets