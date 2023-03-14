let context = ""
let cache = {}

const OPTIONSYES = {
    "updating first parent": updateFirstParent,
    "updating last parent": updateLastParent,
    
}

const OPTIONSNO = {
    "updating first parent": () =>{
        let {newParent, name} = cache
        printLeft(`${nodes[name].parents[2]} is a type of ${newParent}?`)
        context = "updating last parent"
    },
    "updating last parent": () =>{
        // let {newParent, name} = cache
        // printLeft(`what type of think is ${newParent}?`)
        // context = "updating intermediate parent"
    }
}

let contectors = [","]


function conversation(entry) {
    entry = entry.trim()
    //question
    if(entry === "yes") OPTIONSYES[context]() 
    else if(entry === "no") OPTIONSNO[context]()
    else if (entry.includes('?')) {
      if(entry.includes('what is the relationship between')) whatRelation(entry)  
      else if (entry.startsWith('what is')) whatIs(entry)
      else if(entry.startsWith('what')) whatProperty(entry)
      else if (entry.match(/is\s(an|a).*\?/g)) isProperty(entry)
    }
    //affirmation
    else  {
      //an apple is a fruit, red in color, spherical in shape, sweet in smell
      let sentences = entry.split(',')
      let firstSentence = sentences.shift()

      if(context === "adjective"){
        let [name, parent] = firstSentence
          .split(' ')
          .filter((str) => str !== 'an' && str !== 'a' && str !== 'is')
        
        if(!nodes[parent]) addNode(parent, "adjective")
        addNode(name, parent, {property: parent})
        nodes[cache.name].properties[parent] = name

      }else{
        if(firstSentence.match(/^(an|a)\s\w+\sis\s\w+$/g)){
          let [name, adjective] = firstSentence
          .split(' ')
          .filter((str) => str !== 'an' && str !== 'a' && str !== 'is')
          
          //node
          if(!nodes[name]) addNode(name, "noun")
  
          if(nodes[adjective]){
            if(nodes[adjective].type = "adjective" && nodes[adjective].parents.length > 2){ //root -> adjective -> parent -> this
              let prop = nodes[adjective].properties.property
              nodes[name].properties[prop] = adjective 
            }
          }else{
            printLeft(`what is ${adjective}`)
            cache.name = name
            context = "adjective"
          }
          
        }else{
          let [name, parent] = firstSentence
            .split(' ')
            .filter((str) => str !== 'an' && str !== 'a' && str !== 'is')

          creatingNode(name, parent, sentences)
        }
      }

      
      



 
    }
  }

  function creatingNode(name, parent, sentences){
    
    //adjectives
    if(nodes[parent]?.type === "adjective" && parent != "adjective"){
      addNode(name, parent, {property: parent})
    }else{
      //adding new properties
      let properties = {}

      if (sentences.length) {
        for (let sentence of sentences) {
          if(sentence.match(/\w+\sin\s\w/g)){
            let [value, prop] = sentence.trim().split(' in ')
            addNode(prop, "adjective")
            addNode(value, prop, {property: prop})
            properties[prop] = value
          }
        }
      }
      if(!nodes[name] && !nodes[parent]){
        addNode(parent, "noun", {}) //adding parent
        addNode(name, parent, properties) //adding node
      }
      else if(!nodes[name] && nodes[parent]){
        addNode(name, parent, properties)
      }
      else if(nodes[name] && !nodes[parent]){
        updateParent(name, parent, "noun")
      }else if(nodes[name] && nodes[parent]){
        if(!nodes[name].parents.includes(parent)){
          updateParent(name, parent, "noun")
        }
      }
    }
  }

  // a tree is a tree


// let context = ""
// let cache = {}



// function conversation(entry){
//   let subject = null
//   let parent = null
//   let typeSentence = "afirmative"

//   let sentences = entry
//     .trim()
//     .replaceAll(/[\.\?\!]/g, str => str + "@$@")
//     .split(/@\$@/g)
//     .map(str => str.trim())
//     .filter(str => str != "")

//   for(let sentence of sentences){
//     if(sentence.endsWith("?")) {
//       typeSentence = "question"
//       sentence = sentence.slice(0,-1)
//     }

//     let subSentences = sentence.split(",").map(str => str.trim())
    
//     if(typeSentence === "afirmative"){
//       for(let subSentence of subSentences){
//         let words = subSentence.split(/\s+/g)

//         if(words[0] === "a" || words[0] === "an") words.shift() 
//         if(words[1] === "is"){ subject = words[0] }
//         if(words[2] === "a" || words[2] === "an") parent = words[3]

//         words.forEach((word, idx) => {
//           console.log(word)
//         });
//       }
//     }else if(typeSentence === "question"){
//       for(let subSentence of subSentences){
//         // console.log(subSentence)
//       }
//     }
    





//   }
// }