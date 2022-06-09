'use stric'
//---------BASE---------
class Node {
  constructor(props = {}) {
    this.parents = props.parents || []
    this.children = props.children || []
    this.brothers = props.borthers || []
    this.properties = props.properties || {}
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
      actions: null,
    },
  }),
}
//------------------------
let onGoingIssue = ""
let cache
//-------FUNCTIONS--------
function addNode(parent, name, properties) {
  nodes[name] = new Node({
    parents: [...nodes[parent].parents, parent],
    properties: {
      ...nodes[parent].properties,
      ...properties,
    },
    brothers: [...nodes[parent].children]
  })
  nodes[parent].children.push(name)
  for (brother of nodes[name].brothers) nodes[brother].brothers.push(name)
}


function updateParent(parent = 'root', name = "", entry) {

  if(entry === "yes" || entry === "no"){
    parent = cache[0]
    name = cache[1]

    if(entry === "yes" && onGoingIssue === "updating parent"){
      nodes[name].parents.push(parent)
      let branch = getBranch(name)
      for (let i = 0; i < branch.length; i++) {
          let idx = nodes[branch[i]].parents.indexOf(parent)
          nodes[branch[i]].parents.splice(idx, 0, parent)
      }
      onGoingIssue = ""
    }else if(entry === "no" && onGoingIssue === "updating parent"){
        print(`${nodes[name].parents.at(1)} is a type of ${parent}?`, "left")
        onGoingIssue = "updating parent 2"
    }
    if(entry === "yes" && onGoingIssue === "updating parent 2"){
      nodes[nodes[name].parents.at(1)].parents.push(parent)
      let branch = getBranch(nodes[name].parents.at(1))
      for (let i = 0; i < branch.length; i++) nodes[branch[i]].parents.splice(1, 0, parent)
      onGoingIssue = ""
    }

  }
  else if (parent !== 'root' && nodes[name].parents.length === 1) {
    nodes[name].parents.push(parent)
    let branch = getBranch(name)
    for (let i = 0; i < branch.length; i++) nodes[branch[i]].parents.splice(1, 0, parent)
  } else if (parent !== 'root' && nodes[name].parents.length > 1) {
    print(`${parent} is a type of ${nodes[name].parents.at(-1)}?`, "left")
    onGoingIssue = "updating parent",
    cache = [parent, name]
  }
}


function conversation(entry) {
  entry = entry.trim()
  //question
  if(entry === "yes" || entry == "no"){
    if(onGoingIssue === "updating parent" || onGoingIssue === "updating parent 2") updateParent(null, null, entry)
  }
  else if (entry.includes('?')) {
    if(entry.includes('what is the relationship between')){
      let [first, second] = entry.replace("what is the relationship between ", "")
              .replace("and ", "")
              .replace("?", "")
              .split(" ")
    
      for(let i = 0; i < nodes[first].parents.length; i++){
        let toFind = nodes[first].parents[nodes[first].parents.length - (i + 1)]
        if(nodes[second].parents.includes(toFind) && toFind !== "root"){
          return print(`both are ${toFind}`, "left")
        }
      }
      print("no ralation", "left")
    }
    else if (entry.includes('what is')) {
      entry = entry
        .replaceAll(/what is (an|a) /g, '')
        .replace(/\?/g, '')
        .trim()
      if (nodes[entry] && nodes[entry].parents.length > 1) {
        print(
          `an ${entry} is a ${nodes[entry].parents[nodes[entry].parents.length - 1]}`,
          'left'
        )
      } else print(`I don't know, what is an ${entry}?`, 'left')

    } else if (entry.match(/is\s(an|a).*\?/g)) {
      let values = entry.replace('?', '').split(' ').splice(2)
      if (nodes[values[0]]) {
        if (values.length === 3) {
          if (nodes[values[0]].parents.includes(values[2])) print('yes', 'left')
          else print('no', 'left')
        } else {
          let props = Object.values(nodes[values[0]].properties)
          if (props.includes(values[1])) print('yes', 'left')
          else print('no', 'left')
        }
      } else print(`what is an ${values[0]}?`, 'left')
    }
  }
  //affirmation
  else  {
    //an apple is a fruit, red in color, spherical in shape, sweet in smell
    let sentences = entry.split(',')
    let [name, parent] = sentences[0]
      .split(' ')
      .filter((str) => str !== 'an' && str !== 'a' && str !== 'is')

    let properties = {}
    if (sentences.length >= 2) {
      for (sentence of sentences) {
        let [value, prop] = sentence.trim().split(' in ')
        properties[prop] = value
      }
    }

    if (nodes[name] && !nodes[name].parents.includes(parent)) updateParent(parent, name)
    else if (nodes[parent]) addNode(parent, name, properties)
    else {
      addNode('root', parent, {})
      addNode(parent, name, properties)
    }

  }
}

function getBranch(name, ignore = true) {
  let queue = []
  function browse(name) {
    for (child of nodes[name].children) {
      if (!ignore) queue.push(child)
      else if (nodes[child].type !== 'group') queue.push(child)
      if (nodes[child].children.length) browse(child)
    }
  }
  browse(name)
  return queue
}
//------------------------
