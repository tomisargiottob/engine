import createGraph from "ngraph.graph";
import checkCondition from "../conditionHandler";
import DialogNode from '../dialogNodes/index'

class Dialog {
  constructor({skillset, logger}) {
    this.id = skillset.id
    this.assistantId = skillset.assistantId
    this.dialog = createGraph()
    this.nodes = {}
    this.logger= logger.child({assistant: this.assistantId, skillset: skillset.name})
    this.currentDialog = skillset.dialog
    // this.currentDialog = [
    //   {name: 'ROOT', response: 'Send 1 for branch 1, 2 for branch 2', condition:'message EQ /start', goTo: '', parent: ''},
    //   {name: 'Default', response: 'default message', condition:'Anything else', goTo: '', parent: ''},
    //   {name: 'first', response: 'You have reached bottom of the line', condition:'@telephone.argentina', goTo: '', parent: 'ROOT'},
    //   {name: 'second', response: 'We are in the second branch, Send 1 for branch 3, 2 for branch 4', condition:'message EQ 2', goTo: '', parent: 'ROOT'},
    //   {name: 'third', response: 'Hello from third node', condition:'message EQ 1', goTo: '', parent: 'second'},
    //   {name: 'fourth', response: 'Hello from fourth node', condition:'message IN [2,3,5]', goTo: '', parent: 'second'}
    // ]
  }

  init() {
    this.logger.info('Initializing dialog')
    this.defaultNodes = []
    for(const node of this.currentDialog) {
      this.nodes[node.name] = new DialogNode(node)
      this.dialog.addNode(node.name, node)
      if(node.parent) {
        this.dialog.addLink(node.parent, node.name)
      } else if (!['ROOT'].includes(node.name)){
        this.defaultNodes.push(node.name)
      }
    }
    this.logger.info('Dialog successfully initiated')
  }

  checkDefaultNodes(message, context) {
    let nextNode
    for (const node of ['ROOT', ...this.defaultNodes]) {
      nextNode = this.dialog.getNode(node)
      if(checkCondition(nextNode.data.condition, message, context)) {
        return nextNode
      }
    }
    return 
  }

  converse(message, context) {
    this.logger.info('Searching for next dialog node')
    let lastNodeName = ''
    if(context.data.lastNode) {
      lastNodeName = context.data.lastNode;
    }
    let nextNode;
    if(!lastNodeName) {
      nextNode = this.checkDefaultNodes(message, context)
    } else {
      const nextNodesLinks = this.dialog.getLinks(lastNodeName);
      if(nextNodesLinks) {
        const nextLink = [...nextNodesLinks].find((link) => {
          if(link.toId === lastNodeName) {
            return false  
          }
          const nextNodeName = link.toId;
          const possibleNode = this.dialog.getNode(nextNodeName)
          if(checkCondition(possibleNode.data.condition, message, context)) {
            return true
          }
          return false
        })
        if (nextLink) {
          nextNode = this.dialog.getNode(nextLink.toId)
        }
      }
      if(!nextNode) {
        context.setContext({lastNode: ''})
        this.logger.info('No node matched condition, returning to root')
        return this.converse(message, context)
      }
    }
    this.logger.info({node: nextNode.data.name}, 'Sending node message')
    return [nextNode.data.response, nextNode.data.name]
  }
}

export default Dialog