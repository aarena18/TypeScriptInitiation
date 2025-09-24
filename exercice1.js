// to see the console.logs, type :
// npx tsc exercice1.tsx --target es2020
// node exercice1.js
////
//1. Addition simple
function add(x, y) {
    return x + y;
}
let resultOne = add(2, 6);
console.log(resultOne);
////
//2. Paramètre optionnel
function greet(n) {
    if (n === undefined)
        return "hello Guest !";
    return "hello " + n + " !";
}
let resultTwoF = greet();
let resultTwoS = greet("Ambre");
console.log(resultTwoF);
console.log(resultTwoS);
////
//3. Fonction fléchée typée
const multiply = (a, b) => a * b;
let resultThree = multiply(5, 5);
console.log(resultThree);
////
//4. Callback avec map
let numbers = [1, 2, 3];
numbers = numbers.map((n) => n * 2);
console.log(numbers);
////
//5. Fonction générique identité
function identity(arr) {
    return arr;
}
let userName = identity(["ambre", "paul"]);
let age = identity([22, 30]);
console.log(userName);
console.log(age);
////
// 6. Premier élément d’un tableau
function first(arr) {
    return arr[0];
}
let userNameFirst = first(["pierre", "jacques"]);
let ageFirst = first([12, 90]);
console.log(userNameFirst);
console.log(ageFirst);
////
// 7. Union et narrowing
function printId(id) {
    if (typeof id === "number") {
        console.log("ID: " + id);
    }
    else {
        console.log("User: " + id);
    }
}
let userIdOne = 1234353;
let userIdTwo = "alright";
console.log(userIdOne);
console.log(userIdTwo);
////
// 8. Paramètre par défaut + retour typé
function pow(base, exponent = 2) {
    return base ** exponent;
}
;
let testOne = pow(4, 4);
console.log(testOne);
////
// 9. Fonction générique avec contrainte
// Écrire une fonction getLength<T extends { length: number }>(arg: T): number
// qui renvoie la propriété .length de l’argument.
// La tester avec un string et un tableau.
function getLenght(arg) {
    return arg.length;
}
let lenghtFirst = getLenght(["pierre", "jacques"]);
let lenghtSec = getLenght([12, 90, 3]);
console.log(lenghtFirst);
console.log(lenghtSec);
////
// 10. Fonction qui combine plusieurs génériques
// Écrire une fonction merge<T, U>(a: T, b: U): T & U qui fusionne deux objets en un
// seul.
// La tester avec { name: "Alice" } et { age: 25 }.
