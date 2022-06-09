"use stric"
//---------BASE---------
class Node {
    constructor(props = {}){
      this.parents = props.parents || [];
      this.children = props.children || [];
      this.brothers = props.borthers || [];
      this.properties = props.properties || {};
    }
}
const nodes = {
    root: new Node({
      properties: {
        volume: null,
        shape: null,
        color: null,
        x: null,
        y: null,
        z: null,
        actions: null
      }
    })
 }
//------------------------

//-------FUNCTIONS--------
function addNode(parent, name, properties){
	nodes[name] = new Node({
        parents: [...nodes[parent].parents, parent],
        properties: {
            ...nodes[parent].properties,
            ...properties
        }
	})
	nodes[name].brothers.push(...nodes[parent].children)
	nodes[parent].children.push(name)
    for(brother of nodes[name].brothers){
       nodes[brother].brothers.push(name)
    }
    console.log(nodes)
}


function conversation(entry){
  entry = entry.trim()
  //question
  if(entry.includes("?")){
    if(entry.includes("what is")){
      entry = entry.replaceAll(/what is (an|a) /g, '').replace(/\?/g, '').trim()
      if(nodes[entry]){
        print(`an ${entry} is a ${nodes[entry].parents[nodes[entry].parents.length - 1]}`, "left")
      }else {
        print("I don't know","left")
        print(`what is an ${entry}?`, "left")
      }
      
    }else if(entry.match(/is\s(an|a).*\?/g)){
      let values = entry.replace("?",'').split(" ").splice(2)
      if(nodes[values[0]]){
        if(values.length === 3){
          let [name, pointer, prop] = values
          if(nodes[name].parents.includes(prop)){
            print("yes", "left")
          }else print("no", "left")
        }else{
          let [name, prop] = values
          let props = Object.values(nodes[name].properties)
          if(props.includes(prop)) print("yes", "left")
          else print("no", "left")
          
        }
      }else print(`what is an ${values[0]}?`, "left")
      
    }
  }
  //affirmation
  else if(entry.includes("have")){
      
  }
  else{
    //an apple is a fruit, red in color, spherical in shape, sweet in smell
    let sentences = entry.split(',')
    let [name, parent] = sentences[0].split(' ').filter(str => str !== "an" && str !== "a" && str !== "is")

    let properties = {}
    if(sentences.length >= 2){
      for(let i = 1; i <sentences.length; i++ ){
        let [value, prop] = sentences[i].trim().split(" in ")
        properties[prop] = value
      }
    }
    
    if(nodes[parent]){
      addNode(parent, name, properties)
    }else {
      addNode("root", parent, {})
      addNode(parent, name, properties)
    }
    

  }
}

//------------------------