class Assistant{
  constructor(collection, data){
    this.collection = collection;
    this.name = data.name
  }

  toJson() {
    return {
      name: this.name
    }
  }
}

export default Assistant