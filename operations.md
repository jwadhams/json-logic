---
layout: default
title: Supported Operations
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Accessing Data](#accessing-data)
  - [`var`](#var)
  - [`missing`](#missing)
- [Logic and Boolean Operations](#logic-and-boolean-operations)
  - [`if`](#if)
  - [`==`](#)
  - [`===`](#)
  - [`!=`](#)
  - [`!==`](#)
  - [`!`](#)
  - [`or`](#or)
  - [`and`](#and)
- [Numeric Operations](#numeric-operations)
  - [`>`, `>=`, `<`, and `<=`](#---and-)
  - [Between](#between)
  - [`max` and `min`](#max-and-min)
  - [Arithmetic, `+` `-` `*` `/`](#arithmetic-----)
  - [`%`](#%25)
- [Array Operations](#array-operations)
  - [`merge`](#merge)
  - [`in`](#in)
- [String Operations](#string-operations)
  - [`in`](#in-1)
  - [`cat`](#cat)
- [Miscellaneous](#miscellaneous)
  - [`log`](#log)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Accessing Data

## `var` 

Retrieve data from the provided data object.

Most JsonLogic rules operate on data supplied at run-time.  Typically this data is an object, in which case the argument to `var` is a property name.

```js
jsonLogic.apply(
	{ "var" : ["a"] }, // Rule
	{ a : 1, b : 2 }   // Data
);
// 1
```

If you like, we support [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) to skip the array around single values :

```js
jsonLogic.apply(
	{ "var" : "a" },
	{ a : 1, b : 2 }
);
// 1
```


You can supply a default, as the second argument, for values that might be missing in the data object.  (Note, the skip-the-array sugar won't work here because you're passing two arguments to `var`):

```js
jsonLogic.apply(
	{ "var" : ["z", 26] }, // Rule
	{ a : 1, b : 2 }   // Data
);
// 26
```

The key passed to var can use dot-notation to get the property of a property (to any depth you need):

```js
jsonLogic.apply(
	{ "var" : "champ.name" }, 
	{
		champ : { name : "Fezzig", height : 223 },
		challenger : { name : "Dread Pirate Roberts", height : 183 }
	}
);
// "Fezzig"
```

You can also use the `var` operator to access an array by numeric index:

```js
jsonLogic.apply(
	{"var" : 1 },
	[ "apple", "banana", "carrot" ]
);
// "banana"
```

Here's a complex rule that mixes literals and data. The pie isn't ready to eat unless it's cooler than 110 degrees, *and* filled with apples.

```js
var rules = { "and" : [
  {"<" : [ { "var" : "temp" }, 110 ]},
  {"==" : [ { "var" : "pie.filling" }, "apple" ] }
] };

var data = { "temp" : 100, "pie" : { "filling" : "apple" } };

jsonLogic.apply(rules, data);
// true
```

## `missing`

Takes an array of data keys to search for (same format as `var`). Returns an array of any keys that are missing from the data object, or an empty array.

```js
jsonLogic.apply(
	{"missing":["a", "b"]},
	{"a":"apple", "c":"carrot"}
);
// [ "b" ]

jsonLogic.apply(
	{"missing":["a", "b"]},
	{"a":"apple", "b":"banana"}
);
// [ ]
```

Note, in JsonLogic, empty arrays are [falsy]({{ site.baseurl }}/truthy.html). So you can use `missing` with `if` like:

```
jsonLogic.apply(
	{"if":[
		{"missing":["a", "b"]},
		"Not enough fruit",
		"OK to proceed"
	]},
	{"a":"apple", "b":"banana"}
);
// "OK to proceed"
```


# Logic and Boolean Operations

## `if`
The `if` statement typically takes 3 arguments: a condition (if), what to do if it's true (then), and what to do if it's false (else), like:

```js
{"if" : [ true, "yes", "no" ]}
// "yes"

{"if" : [ false, "yes", "no" ]}
// "no"
```

If can also take more than 3 arguments, and will pair up arguments like if/then elseif/then elseif/then else. Like:

```js
{"if" : [ 
	{"<": [{"var":"temp"}, 0] }, "freezing", 
	{"<": [{"var":"temp"}, 100] }, "liquid", 
	"gas" 
]}
```

See the [Fizz Buzz implementation]({{site.base_url}}/fizzbuzz.html) for a larger example.

## `==` 
Tests equality, with type coercion. Requires two arguments.

```js
{"==" : [1, 1]}
// true

{"==" : [1, "1"]}
// true

{"==" : [0, false]}
// true
```

## `===` 
Tests strict equality. Requires two arguments.

```js
{"===" : [1, 1]}
// true

{"===" : [1, "1"]}
// false
```

## `!=`
Tests not-equal, with type coercion.

```js
{"!=" : [1, 2]}
// true

{"!=" : [1, "1"]}
// false
```

## `!==`
Tests strict not-equal.

```js
{"!==" : [1, 2]}
// true

{"!==" : [1, "1"]}
// true
```

## `!`
Logical negation ("not"). Takes just one argument.

```js
{"!": [true]}
// false
```

*Note:* unary operators can also take a single, non array argument:

```js
{"!": true}
// false
```


## `or`
`or` can be used for simple boolean tests, with 1 or more arguments.

```js
{"or": [true, false]}
// true
```

At a more sophisticated level, `or` returns the first [truthy]({{ site.baseurl }}/truthy.html) argument, or the last argument. 

```js
{"or": [false, true]}
// true

{"or": [false, "apple"]}
// "apple"

{"or": [false, null, "apple"]}
// "apple"
```

## `and`
`and` can be used for simple boolean tests, with 1 or more arguments.

```js
{"and": [true, true]}
// true

{"and": [true, true, true, false]}
// false


```

At a more sophisticated level, `and` returns the first [falsy]({{ site.baseurl }}/truthy.html) argument, or the last argument.

```js
{"and": [true, "apple", false]}
// false

{"and": [true, "apple", 3.14]}
// 3.14
```

# Numeric Operations

## `>`, `>=`, `<`, and `<=`

Greater than:

```js
{">" : [2, 1]}
// true
```

Greater than or equal to:

```js
{">=" : [1, 1]}
// true
```

Less than:

```js
{"<" : [1, 2]}
// true
```

Less than or equal to:

```js
{"<=" : [1, 1]}
// true
```

## Between

You can use a special case of `<` and `<=` to test that one value is between two others:

Between exclusive:

```js
{"<" : [1, 2, 3]}
// true

{"<" : [1, 1, 3]}
// false, middle can't be equal to left or right

{"<" : [1, 4, 3]}
// false
```

Between inclusive:

```js
{"<=" : [1, 2, 3]}
// true

{"<=" : [1, 1, 3]}
// true

{"<=" : [1, 4, 3]}
// false
```

This is most useful with data:

```js
liquid = jsonLogic.apply(
	{ "<": [0, {"var":"temp"}, 100]}, //Is the temp between 0 and 100 degrees?
	{"temp" : 37}
);
```

## `max` and `min`

Return the maximum or minimum from a list of values.

```js
{"max":[1,2,3]}
// 3

{"min":[1,2,3]}
// 1
```


## Arithmetic, `+` `-` `*` `/`

Addition, subtraction, multiplication, and division.

```js
{"+":[1,1]}
// 2

{"*":[2,3]}
// 6

{"-":[3,2]}
// 1

{"/":[2,4]}
// 0.5
```

Because addition and multiplication are associative, they happily take as many args as you want:

```js
{"+":[1,1,1,1,1]}
// 5

{"*":[2,2,2,2,2]}
// 32
```

Passing just one argument to `-` returns its arithmetic negative (additive inverse).

```js
{"-":[2]}
// -2

{"-":[-2]}
// 2
```

Passing just one argument to `+` casts it to a number.

```js
{"+" : "0"}
// 0
```

## `%`

[Modulo](https://en.wikipedia.org/wiki/Modulo_operation).  Finds the remainder after the first argument is divided by the second argument.

```js
{"%": [101,2]}
// 1
```

This can be paired with a loop in the language that parses JsonLogic to create stripes or other effects.  

In Javascript:

```js
var rule = {"if": [{"%": [{"var":"i"}, 2]}, "odd", "even"]};
for(var i = 1; i <= 4 ; i++){
	console.log(i, jsonLogic.apply(rule, {"i":i}));
}
/* Outputs:
1 "odd"
2 "even"
3 "odd"
4 "even"
*/
```

# Array Operations

## `merge`

Takes one or more arrays, and merges them into one array. If arguments aren't arrays, they get cast to arrays.

```js
{"merge":[ [1,2], [3,4] ]}
// [1,2,3,4]

{"merge":[ 1, 2, [3,4] ]}
// [1,2,3,4]
```

Merge can be especially useful when defining complex `missing` rules, like which fields are required in a document. For example, the this vehicle paperwork always requires the car's VIN, but only needs the APR and term if you're financing.

```js
var missing = {"missing" : 
	{ "merge" : [ 
		"vin", 
		{"if": [{"var":"financing"}, ["apr", "term"], [] ]}
	]} 
};

jsonLogic.apply(rule, {"financing":true});
// ["vin","apr","term"]

jsonLogic.apply(rule, {"financing":false});
// ["vin"]
```

## `in`

If the second argument is an array, tests that the first argument is a member of the array: 

```js
{"in":[ "Ringo", ["John", "Paul", "George", "Ringo"] ]}
// true
```


# String Operations

## `in`

If the second argument is a string, tests that the first argument is a substring: 

```js
{"in":["Spring", "Springfield"]}
// true
```

## `cat`

Concatenate all the supplied arguments. Note that this is not a join or implode operation, there is no "glue" string.

```js
{"cat": ["I love", " pie"]}
// "I love pie"

jsonLogic.apply(
	{"cat": ["I love ", {"var":"filling"} " pie"]}, // rule
	{"filling":"apple", "temp":110}                 // data
);
// "I love apple pie"
```


# Miscellaneous

## `log` 

Logs the first value to console, then passes it through unmodified.

This can be especially helpful when debugging a large rule.

```js
{"log":"apple"}
// Console receives "apple"
// Command returns "apple"
```


