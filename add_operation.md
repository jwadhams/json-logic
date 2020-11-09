---
title: Adding Operators
layout: default
---

# Adding Operations (and outside libraries!)

<div style="border:1px solid #440000; background:#FFbbbb;padding:10px;margin-bottom:1em;">
This functionality exists in the JavaScript implementation, v1.0.9+.  It is not yet implemented in PHP.
</div>

What if you need to use a serious, existing, battle-hardened library inside your JsonLogic rules?

You can import that library into JsonLogic's list of operators!

Note: JsonLogic can't know what's going on inside your custom operations. Maybe they have side effects? Maybe they update global state?  Those things are OK, but inside your custom operations, I can't guarantee Virtue #3 "Rules have no write access to anything."  Obviously.

OK, here are some examples:

## Adding one new operator

If you have a function you want to expose as a JsonLogic operation, you can use:

```js
var plus = function(a,b){ return a+b; };
jsonLogic.add_operation("plus", plus);

jsonLogic.apply({"plus":[23, 19]}); //Returns 42
```

You don't have to create your own functions, you can use libraries and built-ins:

```js
jsonLogic.add_operation("sqrt", Math.sqrt);

// you even get the unary syntactic sugar if you like!
jsonLogic.apply({"sqrt":1764}); //Returns 42
```

## Adding a whole library

You can also import a whole library, and use its methods with dot-notation:

```js
jsonLogic.add_operation("Math", Math);
//Note the empty array for no arguments
jsonLogic.apply({"Math.random":[]}); //Returns a float between 0 and 1
jsonLogic.apply({"Math.abs":-42}); //Returns 42
jsonLogic.apply({"Math.ceil":41.001}); //Returns 42
jsonLogic.apply({"Math.log":1739274941520497700}); //Returns 42
```

## Calling methods on objects

The ability to call an arbitrary method on an object led to a [prototype pollution advisory](https://www.npmjs.com/advisories/1542) and has been removed as of json-logic-js 2.0.0. I'd strongly recommend you convert object-oriented method calls into small simple functions like Math.abs above, when importing them into JsonLogic.

## Limitations

You can't use a custom operation to introduce a new control structure. The built-in control structures, `if`, `and`, and `or` only execute the code paths you'd expect. For example:

```json
{ "if" : [
  {"is_meatloaf" : {"var":"user"}},
  {"for_love" : "anything"},
  {"that" : []}
]}
```

This code will always execute the custom `is_meatloaf` operation. If that return value is truthy, it'll execute `for_love`, and it won't do `that`. Duh, right?

*Every* other operator *including* custom operators, performs depth-first recursion.

Lets say you're a fan of [Perl's `unless`](http://www.perltutorial.org/perl-unless/), and you write:

```js
var unless = function(condition, consequent){
  if(!condition){ return consequent; }
};
jsonLogic.add_operation("unless", unless});

//Nothing will work unless you do --Maya Angelou
jsonLogic({"unless" : [
  {"is_working" : {"var":"user"}},
  {"will_work" : "nothing"}
]});
```

You're going to find that `is_working` is called first, but `will_work` gets called regardless of `is_working`'s output and *before* `unless` has a chance to do anything.

If you want to introduce a new control structure, you need to patch the implementation, or open a Pull request.
