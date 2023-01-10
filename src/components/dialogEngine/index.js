import createGraph from "ngraph.graph";
import DialogNode from '../dialogNodes/index'

class Dialog {
  constructor(skillset) {
    this.id = skillset.id
    this.assistantId = skillset.assistantId
    this.dialog = createGraph()
    this.nodes = {}
    // this.currentDialog = skillset.dialog
    this.currentDialog = [
      {name: 'ROOT', response: 'Hello world', condition:'/start', goTo: '', parent: ''},
      {name: 'Default', response: 'default message', condition:'Anything else', goTo: '', parent: ''},
      {name: 'first', response: 'Hello world', condition:'Anything else', goTo: '', parent: 'ROOT'}
    ]
  }

  init() {
    for(const node of this.currentDialog) {
      this.nodes[node.name] = new DialogNode(node)
      this.dialog.addNode(node.name, node)
      if(node.parent) {
        this.dialog.addLink(node.name, node.parent)
      }
    }
  }

  converse(message, context) {
    let lastNodeName = 'ROOT'
    if(context.lastNode) {
      lastNodeName = context.lastNode;
    }
    const lastNode = this.dialog.getNode(lastNodeName)
    const nextNodes = this.dialog.getLinks(lastNode);
    console.log(nextNodes)

  }
}

export default Dialog