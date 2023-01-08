import Skillset from "../models/skillset";

class Skillsets{
  constructor(db) {
    this.db = db;
    this.collection= this.db.collection('skillsets')
  }

  async getAll() {
    const skillsets = await this.collection.find({}).toArray();
    return skillsets.map((assistant) => new Skillset(this.collection, assistant))
  }
}

export default Skillsets