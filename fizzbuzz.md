---
title: Can JsonLogic solve Fizz Buzz?
layout: default
---

# Can JsonLogic solve Fizz Buzz?


Although JsonLogic, itself, doesn't have/need a looping construct, the rule for one integer is:

```json
{
    "or": [
        { "?:": [
			{"==": [ { "%": [ { "var": "i" }, 15 ] }, 0]},
			"fizzbuzz",
			false
		] },
        { "?:": [
			{"==": [ { "%": [ { "var": "i" }, 3 ] }, 0]},
			"fizz",
			false
		] },
        { "?:": [
			{"==": [ { "%": [ { "var": "i" }, 5 ] }, 0]},
			"buzz",
			false
		] },
        { "var": "i" }
    ]
}
```
(14 operators, 190 non-whitespace characters)

Which you'd use like:

```js
for(var i=1; i<=30 ; i++){
	console.log(jsonLogic(fizbuzz_rule, {"i":i}));
}
```

<div style="height:300px;"></div>

## Increasingly code-golf-ish solutions:
The solution above is pretty clear to read, and just 14 JsonLogic operations in 190 non-whitespace characters. Here are some even shorter solutions with the same results for positive integers.

### Nesting conditions (effectively `else if`)

13 operators, 163 non-whitespace characters

```json
{ "?:": [
	{"==": [ { "%": [ { "var": "i" }, 15 ] }, 0]},
	"fizzbuzz",
	{ "?:": [
		{"==": [ { "%": [ { "var": "i" }, 3 ] }, 0]},
		"fizz",
        { "?:": [
			{"==": [ { "%": [ { "var": "i" }, 5 ] }, 0]},
			"buzz",
			{ "var": "i" }
		] }
	] }
] }
```


### Using the "falsy"-ness of 0 and reversing the logic

10 operators, 130 non-whitespace characters

```json
{ "?:": [
	{ "%": [ { "var": "i" }, 15 ] },
	{ "?:": [
		{ "%": [ { "var": "i" }, 3 ] },
		{ "?:": [
			{ "%": [ { "var": "i" }, 5 ] },
			{"var":"i"},
			"buzz"
		]},
		"fizz"
	]},
	"fizzbuzz"
]}
```
