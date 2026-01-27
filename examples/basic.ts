import { microAlgos } from "../src/amount"

const fee = microAlgos(1_000)
console.log(`Fee: ${fee.toString()} µAlgos`)
