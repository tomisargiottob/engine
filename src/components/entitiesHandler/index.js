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

  }

  async createEntity(assistantId, skillsetId, entity ) {
    try {
      this.logger.info({assistantId, skillsetId, entity: entity.name}, 'Creating new entity')
      await this.client.createEntity({assistantId, skillsetId, entity})
      this.logger.info({assistantId, skillsetId, entity: entity.name}, 'Entity successfully created')
      return true
    } catch (err) {
      this.logger.error({assistantId, skillsetId, entity: entity.name, reason: err.message},'Could not create entity')
      return false
    }
  }

  async updateEntity(assistantId, skillsetId, entityId, entityData ) {
    try {
      this.logger.info({assistantId, skillsetId, entity: entityId}, 'Updating entity')
      await this.client.updateEntity({assistantId, skillsetId, entityId ,entityData})
      this.logger.info({assistantId, skillsetId, entity: entityId}, 'Entities successfully updated')
      return true
    } catch (err) {
      this.logger.error({assistantId, skillsetId,  entity: entityData.name, reason: err.message},'Could not update entity')
      return false
    }
  }

  async deleteEntity(assistantId, skillsetId, entityId ) {
    try {
      this.logger.info({assistantId, skillsetId, entity: entityId}, 'Removing entity')
      await this.client.deleteEntity({assistantId, skillsetId, entityId})
      this.logger.info({assistantId, skillsetId, entity: entityId}, 'Entity successfully removed')
      return true
    } catch (err) {
      this.logger.error({assistantId, skillsetId,  entity: entityId, reason: err.message},'Could not remove entity')
      return false
    }
  }

  async getEntities(assistantId, skillsetId ) {
    try {
      this.logger.info({assistantId, skillsetId}, 'Fetching entities')
      await this.client.getEntities({assistantId, skillsetId})
      this.logger.info({assistantId, skillsetId}, 'Entities successfully fetched')
      return true
    } catch (err) {
      this.logger.error({assistantId, skillsetId, reason: err.message},'Could not fetch entities')
      return false
    }
  }

  async getEntity(assistantId, skillsetId, entityId ) {
    try {
      this.logger.info({assistantId, skillsetId, entity: entityId}, 'Fetching entity')
      await this.client.getEntity({assistantId, skillsetId, entityId })
      this.logger.info({assistantId, skillsetId, entity: entityId}, 'Entity successfully fetched')
      return true
    } catch (err) {
      this.logger.error({assistantId, skillsetId,  entity: entityId, reason: err.message},'Could not fetch entity')
      return false
    }
  }

  async identifyEntities(assistantId, skillsetId, message) {
    try {
      this.logger.info({assistantId, skillsetId, message}, 'Searching for entities in message')
      const entities = await this.client.identifyEntities({assistantId, skillsetId, message})
      this.logger.info({assistantId, skillsetId, message}, 'Entities successfully identified')
      return entities
    } catch (err) {
      this.logger.error({assistantId, skillsetId, message, reason: err.message},'Could not search entities in message')
      return []
    }
  }
}

export default Entities