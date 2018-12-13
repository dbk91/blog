---
title: Migrating from Render Props to Hooks
date: '2018-12-08T20:49:22.048Z'
---

One of the promising features of [React Hooks](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html#react-16x-q1-2019-the-one-with-hooks) is the ability to reuse stateful logic without nesting components. Nested components are a side effect of two component-reuse paradigms in React: render props and higher-order components.

In this post, we'll dive into a simple example that implements a countdown timer. Then we'll see how we can migrate from the old render props paradigm to the "Hooks way" of sharing isolated, stateful logic between functional components.

_Note: Some knowledge of these paradigms are recommended before reading this post. If you don't know about them, [check them out](https://reactjs.org/docs/render-props.html) and then come on back!_

If you want to follow along, you can either clone [this repo](https://github.com/dbk91/render-props-to-hooks) or create a new one. I recommend using [create-react-app](https://github.com/facebook/create-react-app) repo for a simple, robust setup. At the time of writing, you'll need to install the latest versions of React and React-DOM.

```
$ yarn create react-app render-props-to-hooks
$ cd render-props-to-hooks
$ yarn add react@next @react-dom@next
```

For simplicity, we'll examine a countdown timer. The component will have the following requirements.

1. The component shall have a prop, `initialSeconds`, that is used to initialize the amount of seconds to countdown from.
2. The component shall, in its internal state, countdown from the initial seconds to zero.
3. The component shall have a prop, `onTimerFinish`, that expects a callback to invoke it when the counter reaches zero.

Ideally, we want our final component to look something like this when we use it in our application.

```jsx
<CountdownTimer
  initialSeconds={10}
  onFinish={() => alert('The timer finished!')}
/>
```

If we wanted to use this component's logic with any presentational component, we would simply add a render prop. It might even look something like this.

```jsx
<CountdownTimer
  initialSeconds={10}
  onFinish={() => alert('The timer finished!')}
  render={({ seconds }) => {
    if (seconds === 0) {
      return <p>Done!</p>
    }

    return <p>Counting down... {seconds}</p>
  }}
/>
```

So let's take a look at the internals of this component.

```jsx
import React, { Component } from 'react'

class CountdownTimer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      seconds: props.initialSeconds,
    }
  }

  timer = null

  componentDidMount() {
    // Initialize timer
    this.timer = setInterval(this.countdown, 1000)
  }

  componentDidUpdate() {
    // Fire callback and cleanup timer if the seconds reaches zero
    if (this.state.seconds === 0) {
      this.cleanup()
      this.props.onTimerFinish()
    }
  }

  componentWillUnmount() {
    // Cleanup the timer with the component
    this.cleanup()
  }

  countdown = () => {
    this.setState(prevState => ({
      seconds: prevState.seconds - 1,
    }))
  }

  cleanup = () => {
    clearInterval(this.timer)
  }

  render() {
    return <div>{this.props.render(this.state)}</div>
  }
}
```

Like many class components, it's a bit verbose. However, if we looks closely at the lifecycle methods, we can break down the logic.

- The `constructor` method initializes the component's internal state.
- The `componentDidMount` method uses the vanilla `setInterval` function to set the timer.
- The `componentDidUpdate` checks if the timer completes any time `seconds` updates.
- Finally, `componentWillUnmount` enforces the components clean up, avoiding any potential memory leaks.

And that's it! The other functions simply encapsulate the logic used in the lifecycle methods.

However, this still poses a problem. What if we had to add a separate feature to our component that requires a state field other than `seconds`? We would have to mix that logic in together with the logic related to the countdown.

_You could argue that you could put that logic in a separate render props component, but then you'll end up with another nested layer in your component tree._

This is where hooks comes to the rescue.

Now let's implement our fancy component using Hooks! We'll name it `useCountdownTimer` to follow the `use`-prefix paradigm and import the `useState` to track our state.

```jsx
import { useState } from 'react'

const useCountdownTimer = initialSeconds => {
  const [seconds, setSeconds] = useState(initialSeconds)

  // ...

  return seconds
}
```

Cool! Now we have a state variable `seconds` and a method to update it. Additionally, we return the remaining seconds so that external components are aware of timer's state. Now we need to add the core logic otherwise our custom hook is not very useful...

Now we'll import the `useEffect` method and implement the same logic that lives in our class component's lifecycle methods.

```jsx
import { useState, useEffect } from 'react'

const useCountdownTimer = (initialSeconds, onTimerFinish) => {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(seconds - 1)
    }, 1000)

    if (seconds === 0) {
      clearInterval(timerId)
      onTimerFinish()
    }

    // Return a cleanup method; functionally equivalent to componentWillUnmount
    return () => {
      clearInterval(timerId)
    }
  })

  return seconds
}
```

Believe it or not, this code block replaces our whole class component and retains the same functionality. The only exception is it doesn't accept another component to render in different contexts, but that's because we actually don't need it to. That's because we can just import our custom hook into any presentational component we want and then use it!

For example...

```jsx
import React from 'react'
import useCountdownTimer from './useCountdownTimer'

const CountdownTimer = () => {
  const seconds = useCountdownTimer(10, () => alert('Way cool!'))

  if (seconds === 0) {
    return <p>Done!</p>
  }

  return (
    <p>
      Counting down in style
      <span role="img" aria-labelledby="so-much-style">
        😎
      </span>...
      {seconds}
    </p>
  )
}

export default CountdownTimer
```

Or you can hook it into another component that shows the timer as a progress bar.

```jsx
import React from 'react'
import useCountdownTimer from './useCountdownTimer'

const initialSeconds = 10

const CountdownTimerProgress = () => {
  const seconds = useCountdownTimer(initialSeconds, () => alert('Way cool!'))

  if (seconds === 0) {
    return <p>Done!</p>
  }

  return (
    <>
      <p>Counting down...</p>
      <progress value={seconds} max={initialSeconds} />
    </>
  )
}
```

When we revisit our issue with mixing logic in our component lifecycles, we see that this is already solved by using Hooks.

If we want to add mostly related logic in the hook itself, it would be separated by the `useEffect` method like so.

```jsx
import { useState, useEffect } from 'react'

const useCountdownTimer = (initialSeconds, onTimerFinish) => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [
    relatedFeatureState,
    setRelatedFeatureState,
  ] = useState(/* initialize */)

  // Mostly-related feature
  useEffect(() => {
    // ...
  })

  useEffect(() => {
    const timerId = setInterval(() => {
      setCount(seconds - 1)
    }, 1000)

    if (seconds === 0) {
      clearInterval(timerId)
      onTimerFinish()
    }

    return () => {
      clearInterval(timerId)
    }
  })

  return seconds
}
```

Or if we have logic that lives in a separate hook, we would just import it in the shared component!

```jsx
const initialSeconds = 10

const CountdownTimerProgress = () => {
  const seconds = useCountdownTimer(initialSeconds, () => alert('Way cool!'))
  // More logic!
  const [secondHookState, setSecondHookState] = useSecondHook()

  if (seconds === 0) {
    return <p>Done!</p>
  }

  return (
    <>
      <p>Counting down...</p>
      <progress value={seconds} max={initialSeconds} />
    </>
  )
}
```

There it is! We migrated our simple component from render props to hooks. More importantly, the flexibility we gain from Hooks really shows that the React team has created something that's definitely here to stay.

# One Final Note...

`useEffect` accepts a second argument that is an array of items. In short, if any items in the array change in value, then the function passed to `useEffect` will be invoked again. If you pass an empty array, it will only be invoked on the component's mount and unmount lifecycles.

In this example, it may be tempting to pass an empty array as the second argument to match our `componentDidMount` and `componentWillUnmount` functionality, like so.

```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    setSeconds(seconds - 1)
  }, 1000)

  if (seconds === 0) {
    clearInterval(timerId)
    onTimerFinish()
  }

  return () => {
    // Called every time when `setCount` is invoked when there is no '[]' present in the second argument
    clearInterval(timerId)
  }
}, [])
```

The issue with this code is that the invocation of `setSeconds` will never update the component, so it will only decrement once on mount and then never decrement after that. Read [here](https://reactjs.org/docs/hooks-effect.html#explanation-why-effects-run-on-each-update) for further explanation.
