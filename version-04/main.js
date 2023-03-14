'use stric'
//---------BASE---------
class Node {
  constructor(props = {}) {
    
    this.parents = props.parents || []
    this.children = props.children || []
    this.brothers = props.brothers || []
    this.properties = props.properties || {}
    this.type = props.type || "noun",
    this.subType = props.subType  || null
  }
}
//creating Graph with an initial node

//update type and subtype in other functions
//-------FUNCTIONS--------
function addNode(name, parent = "root", properties = {}, type, subType) {
  nodes[name] = new Node({
    parents: [...nodes[parent].parents, parent],
    properties: {
      ...nodes[parent].properties,
      ...properties,
    },
    brothers: [...nodes[parent].children],
    type: type ? type : nodes[parent].type,
    subType: subType ? subType : nodes[parent].subType,
  })
  nodes[parent].children.push(name)
  for (brother of nodes[name].brothers) nodes[brother].brothers.push(name)
}

//update
function updateFirstParent(){
  let {newParent, name} = cache
  if(!nodes[newParent]) addNode( newParent, nodes[name].parents.at(-1), {} )
  updateLocation(name, newParent)
  context = ""
}

function updateLastParent(){
  let {newParent, name, type} = cache
  if(!nodes[newParent]) addNode( newParent, type, {} )
  updateLocation(nodes[name].parents[2], newParent )
  context = ""
}

function updateIntermediateParent(){

}

function updateParent(name, newParent, type = "noun") {
  if (nodes[name].parents.length === 2){ //if root -> noun -> node
    if(!nodes[newParent]) addNode(newParent, type, {})
    updateLocation(name, newParent)
  }  
  else if (nodes[name].parents.length > 2) { //if root -> noun -> parents -> node
    printLeft(`${newParent} is a type of ${nodes[name].parents.at(-1)}?`)
    context = "updating first parent",
    cache = {newParent, name, type}
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


function getArticle(word){
  if(word.at(0).match(/[aeiou]/g)) return "an"
  else return "a"
}
// function updatePropertiesBranch(name, newProperties){
//   let children = getBranch(name)
//   for(let child of children){
    
//   }
// }
//'group'