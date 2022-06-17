"use stric"
//check conections on addNode
class Node {
    constructor(props = {}) {
      this.parents = props.parents || [] // inheritable
      this.children = props.children || []
      this.brothers = props.brothers || [] // inheritable (children of parent)
      this.properties = props.properties || {} //inheritable
      this.conections = props.conections || {} //semi inheritable //check functions
      this.type = props.type || "noun",
      this.subType = props.subType  || null
      this.variants = props.vairants || []
    }
}
const nodes = {root: new Node({type: "root"})}
function addNode(props, concurrent = true){
    let {name, parent = "root", ancestors = [], properties = {}, type, subType, variants, conections} = props
   
    if(nodes[name]){
        if(!concurrent) console.error(`"${name}" already exits`)
        else{
            let code = hash()
            let code2 = hash()
            //transform normal node into concurrent node
            let node = nodes[name]
            nodes[name] = []
            nodes[name].push(`${name}-${code}`)
            nodes[`${name}-${code}`] = new Node({
                parents: [...node.parents],
                properties:{...node.properties},
                brothers: [...node.brothers],
                type: node.type, subType: node.subType, variants: node.variants, conections: node.conections 
            })
            //add new node
            nodes[name].push(`${name}-${code2}`)
            nodes[`${name}-${code2}`] = new Node({
                parents: [...nodes[parent].parents, parent],
                properties:{
                    ...nodes[parent].properties,
                    ...properties
                },
                brothers: [...nodes[parent].children],
                type, subType, variants, conections 
            })
            for(let brother of nodes[parent].children) {
                if(Array.isArray(nodes[brother])){
                    brother = nodes[brother].filter(str => nodes[str].parents.includes(parent))[0]
                }
                nodes[brother].brothers.push(name)
            }
            nodes[parent].children.push(name)
            
        }
    }else{
        let prevParent = parent
        if(Array.isArray(nodes[parent])){
            if(ancestors.length){
                parent = nodes[parent].filter(str => {
                    for(let ancestor of ancestors){
                        if(!nodes[str].parents.includes(ancestor)) return false 
                    }
                    return true
                })[0]
            }else console.error("add an ancestor")

        }
        nodes[name] = new Node({
            parents: [...nodes[parent].parents, prevParent],
            properties:{
                ...nodes[parent].properties,
                ...properties
            },
            brothers: [...nodes[parent].children],
            type, subType, variants, conections 
        })
        nodes[parent].children.push(name)
        for(let brother of nodes[name].brothers) {
            if(Array.isArray(nodes[brother])){
                brother = nodes[brother].filter(str => nodes[str].parents.includes(parent))[0]
            }
            nodes[brother].brothers.push(name)
        }
    }  
}


function updateNode(props = {}){
    if(nodes[props.name]){
        let {name, parent, ancestors = [], newParent, newAncestors = [], properties, type, subType, variants, conections} = props
        let realName = name
        let realNewParent = newParent
        
        if(Array.isArray(nodes[name])){
            realName = nodes[name].filter(str => {
                for(let ancestor of [...ancestors, parent]) if(!nodes[str].parents.includes(ancestor)) return false
                return true
            })[0]
        }
        if(!parent) parent = nodes[realName].parents.at(-1)
        let realParent = parent
        if(Array.isArray(nodes[parent])){
            realParent = nodes[parent].filter(str => {
                for(let ancestor of ancestors) {if(!nodes[str].parents.includes(ancestor)) return false}
                return true
            })[0]
        }
        if(Array.isArray(nodes[newParent])){
            realNewParent = nodes[newParent].filter(str => {
                for(let ancestor of newAncestors) {if(!nodes[str].parents.includes(ancestor)) return false}
                return true
            })[0]
        }

        if(properties) nodes[realName].properties = {...nodes[realName].properties, ...properties}
        if(type) nodes[realName].type = type
        if(subType) nodes[realName].subType = subType
        if(variants) nodes[realName].variants = variants
        if(conections) nodes[realName].conections = {...nodes[realName].conections, conections}
        

        if(newParent){

            if(nodes[realName].parents.length > 1) nodes[realName].parents = [...nodes[realNewParent].parents, newParent]
            else nodes[realName].parents.push(newParent)
        
            for(let brother of nodes[realName].brothers){
                if(Array.isArray(nodes[brother])){
                    brother = nodes[brother].filter(str => {
                        if(nodes[str].brothers.includes(name) && nodes[str].parents.includes(parent)) return true
                        else return false
                    })
                }
                let idx = nodes[brother].brothers.indexOf(name)
                nodes[brother].brothers.splice(idx, 1)
            }

            nodes[realName].brothers = [...nodes[realNewParent].children]

            for(let brother of nodes[realName].brothers) {
                if(Array.isArray(nodes[brother])){
                    brother = nodes[brother].filter(str => {
                        if(!nodes[str].parents.includes(newParent)) return false
                        for(let ancestor of newAncestors){
                            if(!nodes[str].parents.includes(ancestor)) return false
                        }
                        return true
                    })
                }
                nodes[brother].brothers.push(name)
            }
      
            let idx = nodes[realParent].children.indexOf(name)
            nodes[realParent].children.splice(idx, 1)
            nodes[realNewParent].children.push(name)
            
        }   
    }else console.error(`"${props.name}" does not exist`)
    
}
function updateBranch(props = {}){

    if(nodes[props.name]){
        const {name, parent, ancestors = [], newParent, newAncestors = [], properties, conections} = props
        let [branch, concurrents] = getBranch(name, parent, ancestors)
        updateNode({name, properties, parent, ancestors, newParent, newAncestors, conections})
        let realNewParent
        let realName = name
        if(Array.isArray(nodes[name])){
            realName = nodes[name].filter(str => {
                for(let ancestor of [...ancestors, parent]) if(!nodes[str].parents.includes(ancestor)) return false
                return true
            })[0]
        }
        if(!parent) parent = nodes[realName].parents.at(-1)
        let realParent = parent
        if(Array.isArray(nodes[parent])){
            realParent = nodes[parent].filter(str => {
                for(let ancestor of ancestors) {if(!nodes[str].parents.includes(ancestor)) return false}
                return true
            })[0]
        }
        if(Array.isArray(nodes[newParent])){
            realNewParent = nodes[newParent].filter(str => {
                for(let ancestor of newAncestors) {if(!nodes[str].parents.includes(ancestor)) return false}
                return true
            })[0]
        }


        for(let node of branch){
            if(properties) nodes[node].properties = {...nodes[node].properties, ...properties}
            if(conections) nodes[node].conections = {...nodes[node].conections, conections}
            if(newParent){
                let idx = nodes[node].parents.indexOf(parent)
                if(idx === 0) nodes[node].parents.splice(1, 0,  newParent)
                else nodes[node].parents.splice(idx, 1, newParent)
            }
        }

    }else console.error(`"${props.name}" does not exist`)
}

function deleteNode(name, parent, ancestors = []){
    if(!parent) parent = nodes[name].parents.at(-1)
    let prevParent = parent

    if(Array.isArray(nodes[parent])){
        if(ancestors.length){
            parent = nodes[parent].filter(str => {
                for(let ancestor of ancestors){
                    if(!nodes[str].parents.includes(ancestor)) return false 
                }
                return true
            })[0]
        }else console.error("add an ancestor")
        
    }
    
    if(nodes[name]){
        let prevName = name
        if(Array.isArray(nodes[name])){
            if(Array.isArray(nodes[prevParent])){
                name = nodes[name].filter(str => {
                    if(!nodes.str.parents.includes(prevParent)) return false
                    for(let ancestor of ancestors){
                        if(!nodes[str].parents.includes(ancestor)) return false 
                    }
                    return true
                })[0]
            }else{
                name = nodes[name].filter(str => nodes[str].parents.includes(prevParent))[0]
            }
            
            let idx = nodes[prevName].indexOf(name)
            nodes[prevName].splice(idx, 1)
        }   
        let brothers = nodes[name].brothers
        delete nodes[name]
        
        
        let idx = nodes[parent].children.indexOf(prevName)

        nodes[parent].children.splice(idx, 1)

        for(let brother of brothers){
            
            if(Array.isArray(nodes[brother])){
                brother = nodes[brother].filter(str => nodes[str].parents.includes(parent))[0]
            }
            let idx = nodes[brother].brothers.indexOf(prevName)
            nodes[brother].brothers.splice(idx, 1)
        }  
    }else console.error(`"${props.name}" does not exist`)
}


function addNodes(arr, props){ 
    for(let node of arr) addNode({name: node, ...props})
}

function getBranch(name, parent, ancestors) {
    let queueNodes = []
    let queueGroups = []
    let queueConcurrent = []
    let realName
    if(Array.isArray(nodes[name])){
        realName = nodes[name].filter(str => {
            if(!nodes[str].parents.includes(parent)) return false
            for(let ancestor of ancestors){
                if(!nodes[str].parents.includes(ancestor)) return false 
            }
            return true
        })[0]
    }

    function browse(name) {
      for (let child of nodes[name].children) {
        if(Array.isArray(nodes[child])){
            queueConcurrent.push(child)
            child = nodes[child].filter(str => {
                let ancestors = nodes[name].parents
                if(!nodes[str].parents.includes(name)) return false
                for(let ancestor of ancestors){
                    if(!nodes[str].parents.includes(ancestor)) return false
                }
                return true
            })[0]
        }

        
        if (nodes[child].type !== 'group') queueNodes.push(child)
        else queueGroups.push(child)
        if (nodes[child].children.length) browse(child)
      }
    }
  
    browse(realName, parent, ancestors)
    return [queueNodes, queueConcurrent, queueGroups]
} 

function deleteBranch(name, parent, ancestors, ignore = false){
    if(nodes[name]){
        let [arr, concurrents] = getBranch(name, parent, ancestors)
        if(!ignore) deleteNode(name, parent, ancestors)
        for(let node of arr) {
            delete nodes[node]
            concurrents = concurrents.filter(str => nodes[str].includes(node))
            if(concurrents.length) {
                let idx = nodes[concurrents].indexOf(node)
                nodes[concurrents].splice(idx,1)
            }
        }
    }else console.error(`"${props.name}" does not exist`)
}
function hash(){
    let letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","s","t","x"]
    let numbers = String(parseInt(Math.random()*10000000000)).slice(0, 8)
    let numbers2 = String(parseInt(Math.random()*10000)).slice(0,4)
    let arr = []
    let code = ""
    for(let i = 0;i<numbers.length;){
      arr.push(numbers.slice(i, i+2))
      i = i + 2
    }
		for(let i = 0; i<arr.length; i++){
      let position = parseInt(arr[i].at(0)) + parseInt(arr[i].at(1))
      code += letters[position] + numbers2.at(i)
    }  
    return code
} 
function getArticle(str){
    
}
export {
    Node,
    addNode,
    updateNode,
    updateBranch,
    deleteNode,
    addNodes,
    getBranch,
    deleteBranch,
    nodes
}