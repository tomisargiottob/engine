class Assistant{
  constructor(collection, data){
    this.collection = collection;
    this.name = data.name;
    this.id = data._id;
  }

  update(name) {
    return this.collection.updateOne({_id: this.id}, { $set: { name, updatedAt: Date.now()}})
  }

  remove() {
    return this.collection.deleteOne({_id: this.id})
  }

  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

export default Assistant