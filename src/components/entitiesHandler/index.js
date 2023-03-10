import { promisify } from 'util';
import grpc from '@grpc/grpc-js'
import ProtoLoader from '@grpc/proto-loader'
import path from 'path'

class Entities {
  constructor({logger}, config) {
    this.config = config;
    this.logger = logger.child({ module: 'Entities'})
    const PROTO_PATH = `${path.resolve()}/src/components/entitiesHandler/protos/enitites.proto`
    const packageDefinition = ProtoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)

    const { Entities } = protoDescriptor;

    this.client = new Entities(
      `${this.config.host}:${this.config.port}`,
      grpc.credentials.createInsecure(),
      {
        'grpc.keepalive_time_ms':300000,
        'grpc.keepalive_permanent_without_calls':1
      }
    )
    this.client.createEntity= promisify(this.client.createEntity)
    this.client.updateEntity= promisify(this.client.updateEntity)
    this.client.identifyEntities= promisify(this.client.identifyEntities)
    this.client.deleteEntity= promisify(this.client.deleteEntity)
    this.client.getEntities= promisify(this.client.getEntities)
    this.client.getEntity= promisify(this.client.getEntity)
  }

  async createEntity(assistantId, skillsetId, entity ) {
    this.logger.info({assistantId, skillsetId, entity: entity.name}, 'Creating new entity')
    const createdEntity = await this.client.createEntity({parent: {assistantId, skillsetId}, entityData: entity})
    this.logger.info({assistantId, skillsetId, entity: entity.name}, 'Entity successfully created')
    return createdEntity
  }

  async updateEntity(assistantId, skillsetId, entityId, entityData ) {
    this.logger.info({assistantId, skillsetId, entity: entityId}, 'Updating entity')
    entityData.id = entityId;
    const updatedEntity = await this.client.updateEntity({parent: {assistantId, skillsetId} ,entityData})
    this.logger.info({assistantId, skillsetId, entity: entityId}, 'Entities successfully updated')
    return updatedEntity
  }

  async deleteEntity(assistantId, skillsetId, entityId ) {
    this.logger.info({assistantId, skillsetId, entity: entityId}, 'Removing entity')
    await this.client.deleteEntity({parent: {assistantId, skillsetId}, entityId})
    this.logger.info({assistantId, skillsetId, entity: entityId}, 'Entity successfully removed')
    return true
   
  }

  async getEntities(assistantId, skillsetId ) {
    this.logger.info({assistantId, skillsetId}, 'Fetching entities')
    const entities = await this.client.getEntities({assistantId, skillsetId})
    this.logger.info({assistantId, skillsetId}, 'Entities successfully fetched')
    return entities
  }

  async getEntity(assistantId, skillsetId, entityId ) {
    this.logger.info({assistantId, skillsetId, entity: entityId}, 'Fetching entity')
    const entity = await this.client.getEntity({parent: {assistantId, skillsetId}, entityId })
    this.logger.info({assistantId, skillsetId, entity: entityId}, 'Entity successfully fetched')
    return entity
  }

  async identifyEntities(assistantId, skillsetId, message) {
    try {
      this.logger.info({assistantId, skillsetId, message}, 'Searching for entities in message')
      const entities = await this.client.identifyEntities({parent: {assistantId, skillsetId}, message})
      this.logger.info({assistantId, skillsetId, message}, 'Entities successfully identified')
      return entities
    } catch (err) {
      this.logger.error({assistantId, skillsetId, message, reason: err.message},'Could not search entities in message')
      return []
    }
  }
}

export default Entities