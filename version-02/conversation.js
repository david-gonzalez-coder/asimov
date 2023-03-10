let context = ""
let cache = {}

const OPTIONSYES = {
    "updating first parent": updateFirstParent,
    "updating last parent": updateLastParent
}

const OPTIONSNO = {
    "updating first parent": () =>{
        let {newParent, name} = cache
        printLeft(`${nodes[name].parents[1]} is a type of ${newParent}?`)
        context = "updating last parent"
    },
    "updating last parent": () =>{
        // let {newParent, name} = cache
        // printLeft(`what type of think is ${newParent}?`)
        // context = "updating intermediate parent"
    }
}

function conversation(entry) {
    entry = entry.trim()
    //question
    if(entry === "yes") OPTIONSYES[context]() 
    else if(entry === "no") OPTIONSNO[context]()
    else if (entry.includes('?')) {
      if(entry.includes('what is the relationship between')) whatRelation(entry)  
      else if (entry.includes('what is')) whatIs(entry)
      else if (entry.match(/is\s(an|a).*\?/g)) isProperty(entry)
    }
    //affirmation
    else  {
      //an apple is a fruit, red in color, spherical in shape, sweet in smell
      let sentences = entry.split(',')
      let [name, parent] = sentences.shift()
        .split(' ')
        .filter((str) => str !== 'an' && str !== 'a' && str !== 'is')
  
      //adding new properties
      let properties = {}

      if (sentences.length) {
        for (let sentence of sentences) {
          let [value, prop] = sentence.trim().split(' in ')
          properties[prop] = value
        }
      }
      if(!nodes[name] && !nodes[parent]){
        addNode(parent, "root", {}) //adding parent
        addNode(name, parent, properties) //adding node
      }
      else if(!nodes[name] && nodes[parent]){
        addNode(name, parent, properties)
      }
      else if(nodes[name] && !nodes[parent]){
        updateParent(name, parent)
      }else if(nodes[name] && nodes[parent]){
        if(!nodes[name].parents.includes(parent)){
          updateParent(name, parent)
        }

      }
    }
  }

  // a tree is a tree