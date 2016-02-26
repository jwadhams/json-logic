---
title: Can JsonLogic solve Fizz Buzz?
layout: default
---

# Can JsonLogic solve Fizz Buzz?


Although JsonLogic, itself, doesn't have/need a looping construct, the rule for one integer is:

```json
{
	"if": [
		{"==": [ { "%": [ { "var": "i" }, 15 ] }, 0]},
		"fizzbuzz",

		{"==": [ { "%": [ { "var": "i" }, 3 ] }, 0]},
		"fizz",

		{"==": [ { "%": [ { "var": "i" }, 5 ] }, 0]},
		"buzz",

		{ "var": "i" }
	]
}
```
(14 operators, 190 non-whitespace characters)

Which you'd use like:

```js
for(var i=1; i<=30 ; i++){
	console.log(jsonLogic.apply(fizbuzz_rule, {"i":i}));
}
```

