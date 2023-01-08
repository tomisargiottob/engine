class Assistant{
  constructor(collection, data){
    this.collection = collection;
    this.name = data.name;
    this.id = data._id;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

export default Assistant