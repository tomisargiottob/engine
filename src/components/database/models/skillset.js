class Skillset{
  constructor(collection, data){
    this.collection = collection;
    this.name = data.name;
    this.id = data._id;
  }

  converse() {
    return 'Hello world'
  }

  toJson() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

export default Skillset