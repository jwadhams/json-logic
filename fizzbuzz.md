---
title: Can JsonLogic solve Fizz Buzz?
layout: default
---

# Can JsonLogic solve Fizz Buzz?


Although JsonLogic, itself, doesn't have/need a looping construct, you can use the map function:

```json
{
  "map": [
    { "var": "list" },
    {
      "if": [
        { "==": [{ "%": [{ "var": "" }, 15] }, 0] },
        "fizzbuzz",

        { "==": [{ "%": [{ "var": "" }, 3] }, 0] },
        "fizz",

        { "==": [{ "%": [{ "var": "" }, 5] }, 0] },
        "buzz",

        { "var": "" }
      ]
    }
  ]
}

```

Which you'd use like:

```js
const list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]; 
console.log(jsonLogic.apply(fizbuzz_rule, {"list": list}));
```

