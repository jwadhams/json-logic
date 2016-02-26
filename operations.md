---
layout: default
title: Supported Operations
---

# {{ page.title }}

## `==` 
Tests equality, with type coercion. Requires two arguments.

```js
{"==" : [1, 1]}
//true

{"==" : [1, "1"]}
//true

{"==" : [0, false]}
//true
```

## `===` 
Tests strict equality. Requires two arguments.

```js
{"===" : [1, 1]}
//true

{"===" : [1, "1"]}
//false
```

## `!=`
Tests not-equal, with type coercion.

```js
{"!=" : [1, 2]}
//true

{"!=" : [1, "1"]}
//false
```

## `!==`
Tests strict not-equal.

```js
{"!==" : [1, 2]}
//true

{"!==" : [1, "1"]}
//true
```

## `>`, `>=`, `<`, and `<=`
Greater than:

```js
{">" : [2, 1]}
//true
```
Greater than or equal to:

```js
{">=" : [1, 1]}
//true
```
Less than:

```js
{"<" : [1, 2]}
//true
```

Less than or equal to:

```js
{"<=" : [1, 1]}
//true
```

## Between

You can use a special case of `<` and `<=` to test that one value is between two others:

Between exclusive:

```js
{"<" : [1, 2, 3]}
//true

{"<" : [1, 1, 3]}
//false, middle can't be equal to left or right

{"<" : [1, 4, 3]}
//false
```

Between inclusive:

```js
{"<=" : [1, 2, 3]}
//true

{"<=" : [1, 1, 3]}
//true

{"<=" : [1, 4, 3]}
//false
```

This is most useful with data:

```js
liquid = jsonLogic.apply(
	{ "<": [0, {"var":"temp"}, 100]}, //Is the temp between 0 and 100 degrees?
	{"temp" : 37}
);
```

## `!`
Logical negation ("not"). Takes just one argument.

```js
{"!": [true]}
//false
```

*Note:* unary operators can also take a single, non array argument:

```js
{"!": true}
//false
```


## `or`
`or` can be used for simple boolean tests, with 1 or more arguments.

```js
{"or": [true, false]}
//true
```

At a more sophisticated level, `or` returns the first <a href="http://www.sitepoint.com/javascript-truthy-falsy/">truthy</a> argument, or the last argument. This makes it ideal for setting defaults, for example for missing data.

```js
{"or": [false, true]}
//true

{"or": [false, "apple"]}
//"apple"

{"or": [false, null, "apple"]}
//"apple"
```




## `and`
`and` can be used for simple boolean tests, with 1 or more arguments.

```js
{"and": [true, true]}
//true
```

At a more sophisticated level, `and` returns the first <a href="http://www.sitepoint.com/javascript-truthy-falsy/">falsy</a> argument, or the last argument.

```js
{"and": [false, true]}
//false

{"and": [true, "apple", false]}
//false

{"and": [true, "apple", 3.14]}
//3.14
```




## `?:`
Acts as a [ternary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) operator, like `a ? b : c;`

Effectively, you can use it as an if statement.

*Note:* that both the `b` and `c` paths are evaluated in their entirety, regardless of the value of `a`. Because there are no state-changing operations in JsonLogic, this is only a performance note.

```js
{"?:" : [true, "apple", "banana"]}
//"apple"

{"?:" : [{"==": [1,1]}, "apple", "banana"]}
//"apple"
```


## `in`
Can test if the first argument is in the second argument, when the second argument is an array:

```js
{"in":[ "Ringo", ["John", "Paul", "George", "Ringo"] ]}
//true
```

Can also test if the first argument is a substring of the second argument:

```js
{"in":["Spring", "Springfield"]}
//true
```

## `max` and `min`

Return the maximum or minimum from a list of values.

```js
{"max":[1,2,3]}
//3

{"min":[1,2,3]}
//1
```


## Arithmetic, `+` `-` `*` `/`

Addition, subtraction, multiplication, and division.

```js
{"+":[1,1]}
//2

{"*":[2,3]}
//6

{"-":[3,2]}
//1

{"/":[2,4]}
//0.5
```

Because addition and multiplication are associative, they happily take as many args as you want:

```js
{"+":[1,1,1,1,1]}
//5

{"*":[2,2,2,2,2]}
//32
```

Passing just one argument to `-` returns its arithmetic negative (additive inverse).

```js
{"-":[2]}
//-2

{"-":[-2]}
//2
```

## `var` 

Retrieve data from the provided data object.

Typically the data is an object in the JSON sense, so in which case the argument to `var` is a property name.

```js
jsonLogic.apply(
	{ "var" : ["a"] }, // Rule
	{ a : 1, b : 2 }   // Data
);
// 1
```

You can supply a default, as the second argument, for values that might be missing in the data object:

```js
jsonLogic.apply(
	{ "var" : ["z", 26] }, // Rule
	{ a : 1, b : 2 }   // Data
);
// 26
```

If you like, we support [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) on unary operators to skip the array around values:

```js
jsonLogic.apply(
	{ "var" : "a" },
	{ a : 1, b : 2 }
);
// 1
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

## `log` 

Logs the first value to console, then passes it through unmodified.

This can be especially helpful when debugging a large rule.

```js
{"log":"apple"}
//Console receives "apple"
//Command returns "apple"
```

## `cat`

Concatenate all the supplied arguments. Note that this is not a join or implode operation, there is no "glue" string.

```js
{"cat": ["I love", " pie"]}
//"I love pie"

jsonLogic.apply(
	{"cat": ["I love ", {"var":"filling"} " pie"]}, // rule
	{"filling":"apple", "temp":110}                 // data
);
//"I love apple pie"
```

## `%`

[Modulo](https://en.wikipedia.org/wiki/Modulo_operation).  Finds the remainder after the first argument is divided by the second argument.

```js
{"%": [101,2]}
//1
```

This can be paired with a loop in the language that parses JsonLogic to create stripes or other effects.  

In Javascript:

```js
var rule = {"?:": [{"%": [{"var":"i"}, 2]}, "odd", "even"]};
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

See the [Fizz Buzz implementation]({{site.base_url}}/fizzbuzz.html) for a totally silly example.


