import { MongoClient } from "mongodb";
import Assistants from "./collections/assistants";
import Interactions from "./collections/interactions";
import Skillsets from "./collections/skillsets";

class Database {
  constructor({logger}, config) {
    this.logger = logger.child({module: 'Database'});
    this.client = new MongoClient(config.uri);
    this.config = config
  }

  async connect() {
    await this.client.connect();
    this.logger.info('Successfully connected to database')
    this.db = this.client.db(this.config.dbName);
    this.assistants = new Assistants(this.db)
    this.skillsets = new Skillsets(this.db)
    this.interactions = new Interactions(this.db)
  }
}

export default Database