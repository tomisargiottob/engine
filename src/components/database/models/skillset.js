class Skillset{
  constructor(collection, data){
    this.collection = collection;
    this.name = data.name
  }

  converse() {
    return 'Hello world'
  }
}

export default Skillset