class DialogNode{
  constructor(node) {
    this.condition = node.condition;
    this.message = node.message;
    this.saveVariables = node.saveVariables;
    // webhook
    this.goTo = node.goTo;
    this.parent = node.parent;
    this.children = node.children;
  }
}

export default DialogNode