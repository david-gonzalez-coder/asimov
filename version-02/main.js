'use stric'
//---------BASE---------
class Node {
  constructor(props = {}) {
    this.parents = props.parents || []
    this.children = props.children || []
    this.brothers = props.brothers || []
    this.properties = props.properties || {}
  }
}
//creating Graph with an initial node
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

//-------FUNCTIONS--------
function addNode(name, parent = "root", properties = {}) {
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

//update
function updateFirstParent(){
  let {newParent, name} = cache
  addNode( newParent, nodes[name].parents.at(-1), {} )
  updateLocation(name, newParent)
  context = ""
}

function updateLastParent(){
  let {newParent, name} = cache
  if(!nodes[newParent]) addNode( newParent, "root", {} )
  updateLocation(nodes[name].parents[1], newParent )
  context = ""
}

function updateIntermediateParent(){

}

function updateParent(name, newParent) {
  if (nodes[name].parents.length === 1){ //if root -> node
    if(!nodes[newParent]) addNode(newParent, "root", {})
    updateLocation(name, newParent)
  }  
  else if (nodes[name].parents.length > 1) { //if root -> parents -> node
    printLeft(`${newParent} is a type of ${nodes[name].parents.at(-1)}?`)
    context = "updating first parent",
    cache = {newParent, name}
  } 
}


function updateProperties(node, properties){
  Object.assign(nodes[node].properties, properties)
}

function updateLocation(name, newParent){
  //variables
  if(!newParent) newParent = cache.newParent
  if(!name) name = cache.newParent
  
  node = nodes[name]
  let parent = node.parents.at(-1)
  let brothers = node.brothers 
  let children = getBranch(name)
  //unlink parent
  let childIdx = nodes[parent].children.indexOf(name)
  nodes[parent].children.splice(childIdx, 1)
  //unlink brothers
  for(let brother of brothers) {
    let idx = nodes[brother].brothers.indexOf(name)
    nodes[brother].brothers.splice(idx, 1)
  }

  //unlink this 
  node.parents = []
  node.brothers = []
  
  //link
  node.parents = [...nodes[newParent].parents, newParent]
  node.brothers = [...nodes[newParent].children]
  for(let brother of nodes[newParent].children) nodes[brother].brothers.push(name)
  nodes[newParent].children.push(name)
  for(let child of children){
    let parentIdx = nodes[child].parents.indexOf(name)

    nodes[child].parents = [
      ...nodes[newParent].parents,
      newParent, 
      ...nodes[child].parents.slice(parentIdx)
    ]
  }
}

//get
function getBranch(name) {
  let queue = []

  function browse(name) {
    for (child of nodes[name].children) {
      queue.push(child)
      if (nodes[child].children.length) browse(child)
    }
  }

  browse(name)
  return queue
}
//'group'