---
title: How to Identify If You Need Redux
---

The opening line of [Dan Abromov's post](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) best describes the issues I've run into with Redux in my day-to-day work.

> People often choose Redux before they need it.
> - Dan Abromov

Yup. I did exactly this when I began learning React. The first few courses I went through were projects in React and Redux. While these courses were informative and well constructed, the projects made in the courses relied so heavily on the usage of Redux, even though the emphasis was on learning React.

Fortunately, I didn't really have a problem differentiated what each project's role was in the application. This was largely because the instructors would point out that Redux is not necessary to build a web application with React. However, they equally toted the benefits gained from using Redux. (see Dan Abromov's concise list of benefits).

Trust me, I really wish I could justify using Redux everywhere. Describing your whole UI in plain objects and functions is such a concise way to describe state and state transitions.

At the end of the day, sometimes the application will never be large enough to use Redux. I also don't think that pre-emptively choosing Redux in order to scale an application is the right move, either. Rather than simply reiterating an opinion many React developers share, I want to help React developers identify the need for Redux by describing specific situations that tend to be red flags.

Each time I started a React application and started using Redux, I would always have this satisfaction as soon as I got one core feature of the application working properly. As I tested it, I was satisfied knowing that the state would always be explicit and bug free. Then I would add more features and find myself scouring the web for more techniques on how to maintain Redux boilerplate. Not long after, I found myself reading over the [Reducing Boilerplate](https://redux.js.org/recipes/reducing-boilerplate) section over and over again. A million `yarn install`s later, I would have my whole app restructured with the reduced boilerplate. Yet, I still had this nagging feeling like I was still doing something incorrectly.

Familiar? Then yeah, this post is for you. After running through all of the clever techniques of reducing boilerplate, I went back to the basics. Eventually, I found what I consider to be [one of the most crucial parts of Redux's documentation.](https://redux.js.org/recipes/structuring-reducers/basic-reducer-structure#basic-state-shape) What I think is particularly important is how a typical state should look like.

```
{
    domainData1 : {},
    domainData2 : {},
    appState1 : {},
    appState2 : {},
    ui : {
        uiState1 : {},
        uiState2 : {},
    }
}
```

This bit is what you want to think of every time you begin adding state to a component.
