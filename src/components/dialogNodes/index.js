class DialogNode{
  constructor(node) {
    this.label = node.label
    this.condition = node.condition;
    this.message = node.message;
    // webhook
    this.goTo = node.goTo;
    this.parent = node.parent;
    this.children = node.children;
  }
}

export default DialogNode