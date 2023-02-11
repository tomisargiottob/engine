class Skillset{
  constructor(collection, data){
    this.collection = collection;
    this.name = data.name;
    this.id = data._id;
    this.assistantId = data.assistantId;
    this.dialog = data.dialog;
  }

  update(dialog) {
    return this.collection.updateOne({_id: this.id}, { $set: { dialog, updatedAt: Date.now()}})
  }
  
  toJson() {
    return {
      id: this.id,
      name: this.name,
      assistatId: this.assistantId,
      dialog: this.dialog
    }
  }
}

export default Skillset