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
    let word = entry
      .replaceAll(/(what is (an|a)) /g, '')
      .replaceAll(/\?/g, '')
      .trim()
  
    if (nodes[word]?.parents.length > 2) {
      let parent = nodes[word].parents.at(-1)
      printLeft(
        `${getArticle(word)} ${word} is ${getArticle(parent)} ${parent}`
    
      )
    } else printLeft(`I don't know, what is ${getArticle(word)} ${word}?`)
  }
  
  //i.e. is an apple red? // is a plant a living being?
  function isProperty(entry){
    let values = entry.replace('?', '').split(' ').splice(2)
    let name = values[0]
    if (nodes[name]) {
      if (values.length === 3) {
        if (nodes[name].parents.includes(values[2])) printLeft('yes')
        else printLeft('no')
      } 
      else {
        let props = Object.values(nodes[name].properties)
        if (props.includes(values[1])) printLeft('yes')
        else printLeft('no', 'left')
      }
    } else printLeft(`what is ${getArticle(name)} ${name}?`)
  }

  function whatProperty(entry){
    
    entry = entry.replaceAll("?", "")
    let words = entry.split(/\s/g)
    if(nodes[words[4]] && nodes[words[4]].properties.hasOwnProperty(words[1])){
      printLeft(`${getArticle(words[4])} ${words[4]} is ${nodes[words[4]].properties[words[1]]}`)

    }
  }
  