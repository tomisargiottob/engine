function checkGreaterThan(leftCondition, rightCondition) {
  return leftCondition > rightCondition
}
function checkGreaterThanOrEqual(leftCondition, rightCondition) {
  return leftCondition >= rightCondition 
}
function checkLowerThan(leftCondition, rightCondition) {
  return leftCondition < rightCondition
}
function checkLowerThanOrEqual(leftCondition, rightCondition) {
  return leftCondition <= rightCondition
}
function checkIncludes(leftCondition, rightCondition) {
  if(Array.isArray(rightCondition) || typeof rightCondition === 'string') {
    let checkNumber;
    const numberCondition = !isNaN(leftCondition) && +leftCondition  
    if(numberCondition) {
      checkNumber = rightCondition.includes(numberCondition)
    }
    return rightCondition.includes(leftCondition) || checkNumber
  }
}
function checkEqual(leftCondition, rightCondition) {
  return leftCondition == rightCondition
}

const methods = {
  EQ: checkEqual,
  GT: checkGreaterThan,
  GTE: checkGreaterThanOrEqual,
  LT: checkLowerThan,
  LTE: checkLowerThanOrEqual,
  IN: checkIncludes
}

// eslint-disable-next-line no-unused-vars
function deepSearch(searchedItem, searchObject) {
  const dividedSearch = searchedItem.split('.')
  const search = (prop, parent) => {
    if(parent[prop]) {
      return parent[prop]
    }
    return ''
  }
  let result = searchObject
  dividedSearch.forEach((prop) =>{
    if(result) {
      result = search(prop, result)
    } else {
      return ''
    }
  })
  return result
}

function getConditionValue(condition, message, context) {
  let conditionValue;
  if (condition.startsWith('/')) {
    conditionValue = condition
  } else if (condition === 'message') {
    conditionValue = message;
  } else if(condition.startsWith('@')) {
    const entities = context.getValue('entities')
    if(!entities) {
      return ''
    }
    return entities.includes(condition.slice(1))
  }else{
    // const parsedCondition = !['string', 'number'].includes(typeof parsedCondition) ? JSON.parse(condition) : condition
    // if(typeof parsedCondition === 'string') {
    //   conditionValue = context.getValue(parsedCondition)
    // } else {
    conditionValue = condition
    // }
  }
  return conditionValue
}

function checkCondition(condition, message, context){
  if(condition === 'Anything else') {
    return true
  }
  const splitCondition = condition.split(' ');
  if(splitCondition.length === 1 && splitCondition[0].startsWith('@')) {
    const identifiedEntity = getConditionValue(splitCondition[0], message, context)
    if(!identifiedEntity) {
      return false
    }
    return true
  }
  if(splitCondition.length !== 3) {
    return false
  }
  const checkMethod = methods[splitCondition[1]]
  const leftCondition = getConditionValue(splitCondition[0], message, context)
  const rightCondition = getConditionValue(splitCondition[2], message, context)
  
  return checkMethod(leftCondition,rightCondition)
}

export default checkCondition