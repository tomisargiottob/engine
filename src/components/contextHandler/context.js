class Context {
  constructor(id) {
    this.id = id;
    this.data = {}
    this.variables = {}
    this.tempVariables= {}
  }
  setContext(newVars) {
    Object.keys(newVars).forEach((newVar) =>{
      if(newVar.startsWith('$')) {
        this.variables[newVar] = newVars[newVar]
      } else if (newVar.startsWith('_')) {
        this.tempVariables[newVar] = newVars[newVar]
      } else {
        this.data[newVar] = newVars[newVar]
      }
    })
  }
}

export default Context