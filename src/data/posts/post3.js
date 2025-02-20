export default {
    id: 3,
    title: "Functional Programming in Modern JavaScript",
    slug: "functional-programming-modern-javascript",
    author: "Lambda Blog",
    date: "2025-02-20",
    excerpt: "Learn how to apply functional programming concepts in JavaScript, leveraging the power of category theory and lambda calculus in practical applications.",
    content: `
# Functional Programming in Modern JavaScript

Building on our previous discussions of category theory and lambda calculus, let's explore how to apply these concepts in practical JavaScript programming.

## Core Functional Programming Concepts in JavaScript

### 1. Pure Functions

Pure functions are the building blocks of functional programming. They:
- Always produce the same output for the same input
- Have no side effects
- Don't modify external state

\`\`\`javascript
// ❌ Impure function
let total = 0;
const addToTotal = x => {
    total += x;
    return total;
};

// ✅ Pure function
const add = (a, b) => a + b;
\`\`\`

### 2. Immutability

Instead of modifying data, create new copies with changes:

\`\`\`javascript
// ❌ Mutable approach
const addItem = (arr, item) => {
    arr.push(item);
    return arr;
};

// ✅ Immutable approach
const addItem = (arr, item) => [...arr, item];

// Example usage
const numbers = [1, 2, 3];
const newNumbers = addItem(numbers, 4);
console.log(numbers);     // [1, 2, 3]
console.log(newNumbers);  // [1, 2, 3, 4]
\`\`\`

### 3. Higher-Order Functions

Functions that take functions as arguments or return functions:

\`\`\`javascript
const withLogging = fn => (...args) => {
    console.log(\`Calling function with args: \${args}\`);
    const result = fn(...args);
    console.log(\`Result: \${result}\`);
    return result;
};

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
loggedAdd(2, 3);  // Logs the process and returns 5
\`\`\`

## Practical Patterns

### 1. Function Composition

Combining functions to create new functions:

\`\`\`javascript
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const addOne = x => x + 1;
const double = x => x * 2;
const toString = x => x.toString();

const process = pipe(addOne, double, toString);
console.log(process(3));  // "8"
\`\`\`

### 2. Functors in JavaScript

Arrays are the most common functors in JavaScript:

\`\`\`javascript
// Maybe functor implementation
class Maybe {
    constructor(value) {
        this._value = value;
    }

    static of(value) {
        return new Maybe(value);
    }

    map(fn) {
        return this._value == null
            ? Maybe.of(null)
            : Maybe.of(fn(this._value));
    }

    getOrElse(defaultValue) {
        return this._value ?? defaultValue;
    }
}

// Example usage
const safeDivide = (a, b) => Maybe.of(b)
    .map(x => x !== 0 ? a / x : null)
    .getOrElse("Cannot divide by zero");

console.log(safeDivide(10, 2));   // 5
console.log(safeDivide(10, 0));   // "Cannot divide by zero"
\`\`\`

### 3. Monads for Sequential Operations

\`\`\`javascript
class AsyncMonad {
    constructor(value) {
        this._value = Promise.resolve(value);
    }

    static of(value) {
        return new AsyncMonad(value);
    }

    map(fn) {
        return new AsyncMonad(
            this._value.then(fn)
        );
    }

    flatMap(fn) {
        return new AsyncMonad(
            this._value.then(x => fn(x)._value)
        );
    }
}

// Example usage
const getUser = id => AsyncMonad.of(
    fetch(\`/api/users/\${id}\`).then(r => r.json())
);

const getUserPosts = user => AsyncMonad.of(
    fetch(\`/api/posts?userId=\${user.id}\`).then(r => r.json())
);

// Composing async operations
getUser(1)
    .flatMap(getUserPosts)
    .map(posts => posts.length)
    .map(console.log);
\`\`\`

## Advanced Patterns

### 1. Currying and Partial Application

\`\`\`javascript
// Currying utility
const curry = fn => {
    const arity = fn.length;
    return function curried(...args) {
        if (args.length >= arity) return fn(...args);
        return (...more) => curried(...args, ...more);
    };
};

// Example usage
const add = curry((a, b, c) => a + b + c);
const add5 = add(5);
const add5and10 = add5(10);
console.log(add5and10(15));  // 30
\`\`\`

### 2. Lenses for Immutable Updates

\`\`\`javascript
const lens = (getter, setter) => ({
    get: getter,
    set: setter
});

const view = (lens, obj) => lens.get(obj);
const set = (lens, value, obj) => lens.set(value, obj);

// Example: lens for nested object property
const nameLens = lens(
    obj => obj.name,
    (value, obj) => ({...obj, name: value})
);

const user = { name: "John", age: 30 };
const updatedUser = set(nameLens, "Jane", user);
console.log(user);         // { name: "John", age: 30 }
console.log(updatedUser);  // { name: "Jane", age: 30 }
\`\`\`

## Best Practices

1. **Favor Composition Over Inheritance**
   - Use small, composable functions
   - Combine them to build complex behavior

2. **Handle Side Effects at the Edges**
   - Keep core logic pure
   - Push side effects to application boundaries

3. **Use TypeScript for Better Type Safety**
   - Leverage the type system to catch errors
   - Make functional patterns more explicit

4. **Test Pure Functions**
   - Easy to test due to predictability
   - No need to mock external dependencies

## Performance Considerations

1. **Immutability and Memory**
   - Use structural sharing when possible
   - Consider libraries like Immutable.js for large datasets

2. **Function Composition**
   - Avoid creating too many intermediate functions
   - Use composition utilities wisely

## Conclusion

Functional programming in JavaScript combines theoretical concepts with practical patterns to create more maintainable and reliable code. By understanding the foundations from category theory and lambda calculus, we can better appreciate and apply these patterns in our daily work.

## Key Takeaways

1. Pure functions and immutability are fundamental
2. Higher-order functions enable powerful abstractions
3. Functional patterns can coexist with other paradigms
4. Modern JavaScript makes functional programming practical

Remember that functional programming is not all-or-nothing. Start with these patterns and gradually incorporate them into your codebase where they make sense.
`,
    tags: ["functional-programming", "javascript", "programming-patterns", "software-engineering"],
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
};
