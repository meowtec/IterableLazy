# IterableLazy
Iterable lazy evaluation.

```javascript
const array = lazy.infinite()
  .map(x => x * x)
  .filter(x => x % 3 === 0)
  .takeWhile(x => x < 10000)

console.log([...array])
```
