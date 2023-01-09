import createGraph from "ngraph.graph";

class Dialog {
  constructor(dialog) {
    this.id = dialog.id
    this.assistantId = dialog.assistantId
    this.dialog = createGraph()
    this.nodes = {}
  }

  init(dialog) {
    for(const node of dialog) {
      this.nodes[node.name] = new Node(node)
    }
  }
}

export default Dialog