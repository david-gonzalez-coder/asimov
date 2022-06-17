import {
    Node,
    addNode,
    updateNode,
    updateBranch,
    deleteNode,
    addNodes,
    getBranch,
    deleteBranch
} from "./graphHandlers.js"
import {nodes} from  "./graphHandlers.js"




// addNodes(["and", ",","?", "is", "are", "am"], {type: "language operator"})

addNodes(["nouns", "pronouns"])
addNode({name: "singular", parent: "nouns"})
addNode({name: "plural", parent: "nouns"})
addNode({name: "singular", parent: "pronouns"})
addNode({name: "plural", parent: "pronouns"})
addNode({name: "hola", parent: "singular", ancestors: ["nouns"]})

updateBranch({name: "plural", parent: "nouns", newParent: "singular", newAncestors: ["pronouns"]})
console.log(nodes)

export default nodes




// addNodes([
//     "numbers", "letters", "nouns", "pronouns", "verbs", 
//     "adjectives", "adverbs", "exclamations", "conjunctions", 
//     "prepositions", "determinants", "suffixes"],
//     {type: "group"}
// )
// addNodes(["0","1","2","3","4","5","6","7","8","9"], {type: "number", parent: "numbers"})
// addNodes(["vowels", "consonants"], {type: "group", parent: "letters"})
// addNodes(["a","e","i","o","u"], {type: "letter", subType: "vowel", parent: "vowels"})
// addNodes(
//     ["b","d","f","g","h","k","l","j","m","n","p","r","s","t","v","w","z"],
//     {type: "letter", subType: "consonat", parent: "consonants"}
// )
// addNodes(
//     ["concrete", "abstract", "proper", "common", "collective", "countable", "uncountable"],
//     {type: "group", parent: "nouns" }
// )