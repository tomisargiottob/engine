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

  getValue(value) {
    if(value.startsWith('$')) {
      return this.variables[value]
    }
    if(value.startsWith('_')) {
      return this.tempVariables[value]
    }
    if(this.data[value]) {
      return this.data[value]
    }
    return value
  }

  cleanTemporaryState() {
    this.tempVariables = {}
  }

  toJson() {
    return {
      id: this.id,
      temporaryVariables: this.tempVariables,
      variables: this.variables,
      data: this.data,
    }
  }
}

export default Context