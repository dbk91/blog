---
title: Dealing with CORS in Application Development
date: '2019-01-20T17:36:20.713Z'
---

I maintain a web app which was originally written in PHP using the [CodeIgniter](https://codeigniter.com) framework. Over the course of developing and maintaining this application, I gained a fantastic understanding of the MVC architecture and how to structure what some may consider a fairly complex application. However, as I learned more about how to use React as the "View" portion of a web app, I decided it was about time to gut out a lot of the pesky and bug-laden HTML templates from the server and turn them into smaller and more easily maintanable API endpoints that deliver data as JSON to my React app. To keep costs minimal and improve content delivery, I also decided it was probably a good idea to keep the React app hosted on [Netlify](https://netlify.com) under a different subdomain from the CodeIgniter app itself.

Everything was going so smoothly until the network errors started rolling in.

The network errors I'm referring to come from the browser's implementation of CORS. Basically, if you have a script that makes XMLHTTPRequests or Fetch requests from one domain to another domain that varies in either hostname, port, or protocol (i.e from `https://frontend.myapp.com` to `https://api.myapp.com`), there are certain restrictions modern browsers make to protect users. In order for the browser to correctly access resources from the other origin, it needs to adhere to a set of rules enforced by the server through HTTP headers.

If you are the maintainer of the server and have access to add or configure these headers, then keep reading! Otherwise, you might need to consult the maintainer and return once you know you can update them.

_This blog post deals with a very specific challenge CORS presents to web applications developers. I realize that there may be plenty of examples that may vary or require much more scrutiny, especially if you have a web service that must be accessible to many different scripts across several domains._

If all you need a quick and concise list of things to bypass CORS issues in your web application, [check out the last section in this post.](#tldr)

Now, I'll briefly describe the headers you'll need to avoid these network issues and implement them securely into your app.

### Access-Control-Allow-Origin

This header specifies what origin is allowed to request the resource. So if we want to allow our `https://frontend.myapp.com` to access resources from `https://api.myapp.com`, then we simply add this header on the origin server.

```
Access-Control-Allow-Origin: https://frontend.myapp.com
```

If you search for this online, you'll find that most people provide a quick and easy answer as follows...

```
Access-Control-Allow-Origin: *
```

This answer certainly does work, however, I strongly advise you understand the implications of this. Yes, as you might have guessed, the asteriks does imply that _any_ domain can reach this. There's nothing inherently wrong with that and it might be easier to do this if you plan to keep adding different front-end services that hit the same API, but let's make sure that we understand how this works with the next header we'll cover.

### Access-Control-Allow-Credentials

Okay, so you have the domain calling to some endpoint. Now the user needs to request some sensitive data. Hopefully, you have some authentication on the endpoint in place, so they'll have to login before making the request. Not a problem! Let's login and, try the frontend and... uh oh. More network errors.

The issue here is that the server is not allowing the browser to send up the authentication cookies or headers, whichever are required on the server. In addition, the HTTP client has to opt-in, as well. This is where libraries like Axios use the `withCredentials` configuration flag. If it's set to `true`, it will include credentials such as cookies as long as the server accepts them, as well. Opting in on both client and server is for the benefit of the user's security. To see why this might be a security risk, let's consider the following example with the header from our previous example.

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Receiving these headers indicates that it is both okay for a script from any domain to hit the endpoint and for authentication cookies to be sent up. So this means that if the user is logged in to your service with a cookie and they get a script from a malicious domain, that domain can request resources from your API and steal user data. That's why it might be a good idea to be as explicit as possible to list only the domains you want your scripts to request.

Keep in mind that this kind of vulnerability can be prevented by protecting against Cross-site request forgery. Although browser's can protect users credentials from being sent to the server, you should consider implementing protection against cross-site request forgery regardless if the endpoint is called with the same-origin or from a different one.

### Access-Control-Allow-Methods

By default the `GET`, `HEAD`, and `POST` methods trigger "simple" requests, or requests that don't require a pre-flight request. However, your API may use more HTTP methods than just those. The only requirement is a comma-separated list of methods which you allow. Again, follow the philosphy of only allowing the ones you use.

So, now our headers look something like this.

```
Access-Control-Allow-Origin: https://frontend.myapp.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

So now our server is in pretty good shape. But is there anything our client needs to do when making these requests? You bet.

### The Pre-Flight Request

One detail that tripped me up a bit was the pre-flight request. When using any of the "simple" methods we mentioned earlier, the browser doesn't have to check what methods are allowed. But, when there's a method like a `PUT` or `DELETE`, the browser sends what's called a pre-flight request.

To follow along, open up the network console in your browser and watch the requests as they are invoked. You'll see that the browser sends a request with an HTTP method of `OPTIONS`. This is because the browser wants to see what methods are allowed _before_ it sends the actual request.

If you do what I did and forget to set up an endpoint on the server for it, you'll likely get a big fat `404` error response and the request will bail. To remediate this issue, simply add an endpoint with some sort of success response and the headers we've talked about so far. An [Express](https://expressjs.com/) server in Node.js would look something like this.

```js
// The PUT endpoint
app.put('/the/api/resource', (req, res) => {
  const data = updateTheResource(req.body.data)
  res.status(200).send(data)
})

// The pre-flight request handler endpoint
app.options('/the/api/resource', (req, res) => {
  res.status(204).send()
})
```

I don't know if it's best practice or not to do it this way, but I figure since all we care about are the headers, there is no need to send content (hence, the `204` status).

That's it! You can finally use methods other than `GET`, `HEAD`, and `POST` from your front-end to the API service. Happy hacking!

## <a id="tldr">tl;dr</a>

1. Make sure you have return the following headers from your server to the client app.
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Credentials` (if there's authentication)
   - `Access-Control-Allow-Methods`
2. If using methods other than `GET`, `POST`, and `PUT`, make sure you have an endpoint to handle the `OPTIONS` pre-flight request automatically sent by the browser.
