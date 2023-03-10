//questions

//i.e. what is the relationship between apple and pig?
function whatRelation(entry){
    let exclude = ["and", "an", "a", "?", "!"]
    let [first, second] = entry.replaceAll("what is the relationship between ", "")
    .replaceAll("?", "")
    .split(/\s/g)
    .filter(word => !exclude.includes(word))
    
 
    for(let i = 0; i < nodes[first].parents.length; i++){
        let toFind = nodes[first].parents[nodes[first].parents.length - (i + 1)]
        if(nodes[second].parents.includes(toFind) && toFind !== "root"){
            return printLeft(`both are ${toFind}`)
        }
    }
    printLeft("no ralation")
  }
  
  //i.e. what is an apple?
  function whatIs(entry){
    entry = entry
      .replaceAll(/(what is (an|a)) /g, '')
      .replaceAll(/\?/g, '')
      .trim()
  
    if (nodes[entry]?.parents.length > 1) {
      printLeft(
        `an ${entry} is a ${nodes[entry].parents[nodes[entry].parents.length - 1]}`
    
      )
    } else printLeft(`I don't know, what is an ${entry}?`)
  }
  
  //i.e. is an apple red? // is a plant a living being?
  function isProperty(entry){
    let values = entry.replace('?', '').split(' ').splice(2)
    let node = values[0]
    if (nodes[node]) {
      if (values.length === 3) {
        if (nodes[node].parents.includes(values[2])) printLeft('yes')
        else printLeft('no')
      } 
      else {
        let props = Object.values(nodes[node].properties)
        if (props.includes(values[1])) printLeft('yes')
        else printLeft('no', 'left')
      }
    } else printLeft(`what is an ${node}?`)
  }
  