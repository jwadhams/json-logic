---
layout: default
title: Truthy and Falsy
---

# {{ page.title }}

Because JsonLogic rules need to return the same results when executed by different languages, it carries its own specification on what is truthy and what is falsy.

For example, in PHP, empty arrays are falsy, but in JavaScript arrays are always truthy.  It turns out having a dead simple way to differentiate an empty array from a non-empty one is really really useful with the `missing` operation, so JsonLogic agrees with PHP&mdash;in that case.

Here's a quick list, backed up by the shared unit tests, of what values should be treated as true and false, especially by the logic operators and the `if` statement.

| Value  | Comment | As boolean |
:--- | :--- | :---
 `0` | | `false` 
 `1`, `-1`, etc | any non-zero number | `true` 
 `[]` | empty array | `false` 
 `[1,2]` | any non-empty array | `true` 
 `{}` | empty object | `false` 
 `{"foo": "bar"}` | any non-empty object | `true` 
 `""` | empty string | `false` 
 `"anything"` | any non-empty string | `true`
 `"0"` | string zero | `true`
 `null` | | `false`

## Testing

Every JsonLogic interpreter exposes a method `truthy` that tells you whether the supplied arg is truthy or falsy within JsonLogic (overriding that language's conventions when necessary).

In PHP: 

```php
(bool) "0"
// false

JWadhams\JsonLogic::truthy( "0" );
// true
```

In JavaScript: 

```js
!! []
// true

jsonLogic.truthy( [] );
// false
```

