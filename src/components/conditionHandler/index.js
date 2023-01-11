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

function getConditionValue(condition, message, context) {
  let conditionValue;
  if (condition.startsWith('/')) {
    conditionValue = condition
  } else if (condition === 'message') {
    conditionValue = message;
  } else {
    const parsedCondition = JSON.parse(condition)
    if(typeof parsedCondition === 'string') {
      conditionValue = context.getValue(parsedCondition)
    } else {
      conditionValue = parsedCondition
    }
  }
  return conditionValue
}

function checkCondition(condition, message, context){
  if(condition === 'Anything else') {
    return true
  }
  const splitCondition = condition.split(' ');
  if(splitCondition.length !== 3) {
    return false
  }
  const checkMethod = methods[splitCondition[1]]
  const leftCondition = getConditionValue(splitCondition[0], message, context)
  const rightCondition = getConditionValue(splitCondition[2], message, context)
  
  return checkMethod(leftCondition,rightCondition)
}

export default checkCondition