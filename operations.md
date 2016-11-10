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
  - [`missing_some`](#missing_some)
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

{% include example.html rule='{ "var" : ["a"] }' data=' { "a":1, "b":2 }' %}

Note, every operation will be demonstrated with a live example box. Feel free to edit the logic and the data and see what happens when you apply your change!  Here's what the example above would look like in JavaScript:

```js
jsonLogic.apply(
  { "var" : ["a"] }, // Logic
  { "a":1, "b":2 }   // Data
);
// 1
```

If you like, we support [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar) to skip the array around single arguments :

{% include example.html rule='{"var":"a"}' data='{"a":1,"b":2}'%}


You can supply a default, as the second argument, for values that might be missing in the data object.  (Note, the skip-the-array sugar won't work here because you're passing two arguments to `var`):

{% include example.html rule='{"var":["z", 26]}' data='{"a":1,"b":2}'%}

The key passed to var can use dot-notation to get the property of a property (to any depth you need):

{% include example.html rule='{"var" : "champ.name"}' data='{
  "champ" : {
    "name" : "Fezzig",
    "height" : 223
  },
  "challenger" : {
    "name" : "Dread Pirate Roberts",
    "height" : 183
  }
}'%}

You can also use the `var` operator to access an array by numeric index:

{% include example.html rule='{"var":1}' data='["zero", "one", "two"]'%}

Here's a complex rule that mixes literals and data. The pie isn't ready to eat unless it's cooler than 110 degrees, *and* filled with apples.

{% include example.html rule='{ "and" : [
  {"<" : [ { "var" : "temp" }, 110 ]},
  {"==" : [ { "var" : "pie.filling" }, "apple" ] }
] }' data='{
  "temp" : 100,
  "pie" : { "filling" : "apple" }
}'%}

## `missing`

Takes an array of data keys to search for (same format as `var`). Returns an array of any keys that are missing from the data object, or an empty array.

{% include example.html rule='{"missing":["a", "b"]}' data='{"a":"apple", "c":"carrot"}'%}
{% include example.html rule='{"missing":["a", "b"]}' data='{"a":"apple", "b":"banana"}'%}

Note, in JsonLogic, empty arrays are [falsy]({{ site.baseurl }}/truthy.html). So you can use `missing` with `if` like:

{% include example.html rule='{"if":[
  {"missing":["a", "b"]},
  "Not enough fruit",
  "OK to proceed"
]}' data='{"a":"apple", "b":"banana"}'%}

## `missing_some`

Takes a minimum number of data keys that are required, and an array of keys to search for (same format as `var` or `missing`).  Returns an empty array if the minimum is met, or an array of the missing keys otherwise.

{% include example.html rule='{"missing_some":[1, ["a", "b", "c"]]}' data='{"a":"apple"}'%}
{% include example.html rule='{"missing_some":[2, ["a", "b", "c"]]}' data='{"a":"apple"}'%}

This is useful if you're using `missing` to track required fields, but occasionally need to require N of M fields.

{% include example.html rule='{"if" :[
    {"merge": [
      {"missing":["first_name", "last_name"]},
      {"missing_some":[1, ["cell_phone", "home_phone"] ]}
    ]},
    "We require first name, last name, and one phone number.",
    "OK to proceed"
  ]}' data='{"first_name":"Bruce", "last_name":"Wayne"}'%}


# Logic and Boolean Operations

## `if`
The `if` statement typically takes 3 arguments: a condition (if), what to do if it's true (then), and what to do if it's false (else), like:

{% include example.html rule='{"if" : [ true, "yes", "no" ]}' %}
{% include example.html rule='{"if" : [ false, "yes", "no" ]}' %}

If can also take more than 3 arguments, and will pair up arguments like if/then elseif/then elseif/then else. Like:

{% include example.html rule='{"if" : [
  {"<": [{"var":"temp"}, 0] }, "freezing",
  {"<": [{"var":"temp"}, 100] }, "liquid",
  "gas"
]}' data='{"temp":55}'%}

See the [Fizz Buzz implementation]({{site.base_url}}/fizzbuzz.html) for a larger example.

## `==`
Tests equality, with type coercion. Requires two arguments.

{% include example.html rule='{"==" : [1, 1]}' %}
{% include example.html rule='{"==" : [1, "1"]}' %}
{% include example.html rule='{"==" : [0, false]}' %}

## `===`
Tests strict equality. Requires two arguments.

{% include example.html rule='{"===" : [1, 1]}' %}
{% include example.html rule='{"===" : [1, "1"]}' %}

## `!=`
Tests not-equal, with type coercion.

{% include example.html rule='{"!=" : [1, 2]}' %}
{% include example.html rule='{"!=" : [1, "1"]}' %}

## `!==`
Tests strict not-equal.

{% include example.html rule='{"!==" : [1, 2]}' %}
{% include example.html rule='{"!==" : [1, "1"]}' %}

## `!`
Logical negation ("not"). Takes just one argument.

{% include example.html rule='{"!": [true]}' %}

*Note:* unary operators can also take a single, non array argument:
{% include example.html rule='{"!": true}' %}

## `or`
`or` can be used for simple boolean tests, with 1 or more arguments.

{% include example.html rule='{"or": [true, false]}' %}

At a more sophisticated level, `or` returns the first [truthy]({{ site.baseurl }}/truthy.html) argument, or the last argument.

{% include example.html rule='{"or":[false, true]}' %}
{% include example.html rule='{"or":[false, "a"]}' %}
{% include example.html rule='{"or":[false, 0, "a"]}' %}

## `and`
`and` can be used for simple boolean tests, with 1 or more arguments.

{% include example.html rule='{"and": [true, true]}' %}
{% include example.html rule='{"and": [true, false]}' %}

At a more sophisticated level, `and` returns the first [falsy]({{ site.baseurl }}/truthy.html) argument, or the last argument.

{% include example.html rule='{"and":[true,"a",3]}' %}
{% include example.html rule='{"and": [true,"",3]}' %}

# Numeric Operations

## `>`, `>=`, `<`, and `<=`

Greater than:

{% include example.html rule='{">" : [2, 1]}' %}

Greater than or equal to:
{% include example.html rule='{">=" : [1, 1]}' %}

Less than:
{% include example.html rule='{"<" : [1, 2]}' %}


Less than or equal to:
{% include example.html rule='{"<=" : [1, 1]}' %}

## Between

You can use a special case of `<` and `<=` to test that one value is between two others:

Between exclusive:

{% include example.html rule='{"<" : [1, 2, 3]}' %}
{% include example.html rule='{"<" : [1, 1, 3]}' %}
{% include example.html rule='{"<" : [1, 4, 3]}' %}

Between inclusive:

{% include example.html rule='{"<=" : [1, 2, 3]}' %}
{% include example.html rule='{"<=" : [1, 1, 3]}' %}
{% include example.html rule='{"<=" : [1, 4, 3]}' %}

This is most useful with data:

{% include example.html rule='{ "<": [0, {"var":"temp"}, 100]}' data='{"temp" : 37}' %}

## `max` and `min`

Return the maximum or minimum from a list of values.
{% include example.html rule='{"max":[1,2,3]}' %}
{% include example.html rule='{"min":[1,2,3]}' %}

## Arithmetic, `+` `-` `*` `/`

Addition, subtraction, multiplication, and division.

{% include example.html rule='{"+":[4,2]}' %}
{% include example.html rule='{"-":[4,2]}' %}
{% include example.html rule='{"*":[4,2]}' %}
{% include example.html rule='{"/":[4,2]}' %}

Because addition and multiplication are associative, they happily take as many args as you want:

{% include example.html rule='{"+":[2,2,2,2,2]}' %}
{% include example.html rule='{"*":[2,2,2,2,2]}' %}

Passing just one argument to `-` returns its arithmetic negative (additive inverse).

{% include example.html rule='{"-": 2 }' %}
{% include example.html rule='{"-": -2 }' %}

Passing just one argument to `+` casts it to a number.

{% include example.html rule='{"+" : "3.14"}' %}

## `%`

[Modulo](https://en.wikipedia.org/wiki/Modulo_operation).  Finds the remainder after the first argument is divided by the second argument.

{% include example.html rule='{"%": [101,2]}' %}

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

{% include example.html rule='{"merge":[ [1,2], [3,4] ]}' %}
{% include example.html rule='{"merge":[ 1, 2, [3,4] ]}' %}

Merge can be especially useful when defining complex `missing` rules, like which fields are required in a document. For example, this vehicle paperwork always requires the car's VIN, but only needs the APR and term if you're financing.

{% include example.html rule='{"missing" :
  { "merge" : [
    "vin",
    {"if": [{"var":"financing"}, ["apr", "term"], [] ]}
  ]}
}' data='{"financing":true}' %}

{% include example.html rule='{"missing" :
  { "merge" : [
    "vin",
    {"if": [{"var":"financing"}, ["apr", "term"], [] ]}
  ]}
}' data='{"financing":false}' %}

## `in`

If the second argument is an array, tests that the first argument is a member of the array:

{% include example.html rule='{"in":[ "Ringo", ["John", "Paul", "George", "Ringo"] ]}' %}


# String Operations

## `in`

If the second argument is a string, tests that the first argument is a substring:

{% include example.html rule='{"in":["Spring", "Springfield"]}' %}

## `cat`

Concatenate all the supplied arguments. Note that this is not a join or implode operation, there is no "glue" string.

{% include example.html rule='{"cat": ["I love", " pie"]}' %}
{% include example.html rule='{"cat": ["I love ", {"var":"filling"}, " pie"]}' data='{"filling":"apple", "temp":110}' %}

# Miscellaneous

## `log`

Logs the first value to console, then passes it through unmodified.

This can be especially helpful when debugging a large rule.

{% include example.html rule='{"log":"apple"}' %}
(Check your developer console!)
