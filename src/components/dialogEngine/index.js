import createGraph from "ngraph.graph";
import DialogNode from '../dialogNodes/index'

class Dialog {
  constructor({skillset, logger}) {
    this.id = skillset.id
    this.assistantId = skillset.assistantId
    this.dialog = createGraph()
    this.nodes = {}
    this.logger= logger.child({assistant: this.assistantId, skillset: skillset.name})
    // this.currentDialog = skillset.dialog
    this.currentDialog = [
      {name: 'ROOT', response: 'Hello from the root node', condition:'/start', goTo: '', parent: ''},
      {name: 'Default', response: 'default message', condition:'Anything else', goTo: '', parent: ''},
      {name: 'first', response: 'Hello from first node', condition:'Anything else', goTo: '', parent: 'ROOT'},
      {name: 'second', response: 'Hello from second node', condition:'Anything else', goTo: '', parent: 'first'},
      {name: 'third', response: 'Hello from third node', condition:'Anything else', goTo: '', parent: 'second'},
      {name: 'fourth', response: 'Hello from fourth node', condition:'Anything else', goTo: '', parent: 'third'}
    ]
  }

  init() {
    this.logger.info('Initializing dialog')
    for(const node of this.currentDialog) {
      this.nodes[node.name] = new DialogNode(node)
      this.dialog.addNode(node.name, node)
      if(node.parent) {
        this.dialog.addLink(node.parent, node.name)
      }
    }
  }

  converse(message, context) {
    this.logger.info('Searching for next dialog node')
    let lastNodeName = ''
    if(context.data.lastNode) {
      lastNodeName = context.data.lastNode;
    }
    let nextNode;
    if(!lastNodeName) {
      nextNode = this.dialog.getNode('ROOT')
    } else {
      const nextNodesLinks = this.dialog.getLinks(lastNodeName);
      nextNodesLinks.forEach((link) => {
        const nextNodeName = link.toId;
        nextNode = this.dialog.getNode(nextNodeName)
      })
    }
    return [nextNode.data.response, nextNode.data.name]
  }
}

export default Dialog