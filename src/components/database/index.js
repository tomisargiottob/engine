import { MongoClient } from "mongodb";
import Assistants from "./collections/assistants";

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
  }
}

export default Database