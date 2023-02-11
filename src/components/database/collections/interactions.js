import { v4 as uuid } from 'uuid'

const interactionToJson = (interaction) => ({
  id: interaction._id, 
  message: interaction.message, 
  response: interaction.response,
  assistantId: interaction.assistantId, 
  skillsetId: interaction.skillsetId,
  createdAt: interaction.createdAt,
  sessionId: interaction.sessionId,
  context: interaction.context
})

class Interactions{
  constructor(db) {
    this.db = db;
    this.collection= this.db.collection('interactions')
  }

  async getAll(where) {
    let queryParams = {
      assistantId: where.assistantId,
      skillsetId: where.skillsetId,
    }
    if(where.sessionId) {
      queryParams.sessionId = where.sessionId
    }
    const interactions = await this.collection.find(queryParams).toArray();
    return interactions.map(interactionToJson)
  }

  async getById(id) {
    return this.collection.findOne({_id:id})
  }

  async create(interactionData) {
    interactionData.createdAt = Date.now()
    const interaction = await this.collection.insertOne({_id: uuid(), ...interactionData});
    return interactionToJson(this.getById(interaction.insertedId))
  }
}

export default Interactions