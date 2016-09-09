'use strict'

const IteratorSymbol = Symbol.iterator
const NextSymbol = Symbol('next')
const ParentSymbol = Symbol('parent')

const createIterable = (next) => ({
  [IteratorSymbol]() {
    return {
      next: next()
    }
  }
})

const infinite = createIterable(() => {
  let index = 0
  return () => ({
    done: false,
    value: index++
  })
})

class Lazy {
  constructor(parent, next) {
    this[ParentSymbol] = parent
    this[NextSymbol] = next
  }

  [IteratorSymbol]() {
    const iter = this[ParentSymbol][IteratorSymbol]()

    return this[NextSymbol]
      ? { next: this[NextSymbol](iter) }
      : iter
  }

  filter(predicate) {
    return new Lazy(this, iter => () => {
      let next
      do {
        next = iter.next()
      } while(
        !next.done && !predicate(next.value)
      )

      return next
    })
  }

  map(predicate) {
    return new Lazy(this, iter => () => {
      const next = iter.next()

      return next.done
        ? next
        : {
          value: predicate(next.value),
          done: false
        }
    })
  }

  takeWhile(predicate) {
    return new Lazy(this, iter => () => {
      const next = iter.next()

      return next.done || !predicate(next.value)
        ? { done: true }
        : next
    })
  }

  reduce(predicate, initialValue) {
    let result = initialValue
    for (let item of this) {
      result = predicate(result, item)
    }
    return result
  }

  count() {
    return this.reduce(count => count + 1, 0)
  }
}

const lazy = (...args) => new Lazy(...args)
lazy.infinite = () => new Lazy(infinite)

module.exports = lazy
