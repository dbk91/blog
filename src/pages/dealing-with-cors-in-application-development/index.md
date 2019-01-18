---
title: Dealing with CORS in Application Development
date: '2019-01-18T13:27:44.576Z'
---

## tl;dr

1. Make sure you have return the following headers from your server to the client app.
    - `Access-Control-Allow-Origin`
    - `Access-Control-Allow-Credentials` (if there's authentication)
    - `Access-Control-Allow-Methods`
2. If using methods other than `GET`, `POST`, and `PUT`, make sure you have an endpoint to handle the `OPTIONS` pre-flight request automatically sent by the browser.

There's a web app that I maintain which was originally written in PHP using the [CodeIgniter](https://codeigniter.com) framework. I learned a lot about MVC architecture and how to structure basic
web apps in the process of writing it. However, as I learned more about how to use React as the "View" portion of a web app, I decided it was about time to gut out a lot of the pesky and bug-laden HTML templates that rendered with data from the server to smaller and more easily maintanable API endpoints that delivers the data as JSON to my React app. To keep costs minimal and improve content delivery, I also decided it was probably a good idea to keep the React app hosted on [Netlify](https://netlify.com) under a different subdomain from the CodeIgniter app itself.

Everything was going so smoothly until the network errors started rolling in.

These network errors come from the browser's implementation of CORS. Basically, if you have a script that makes XMLHTTPRequests or Fetch requests from one domain to another domain that varies in either domain, port, or protocol (i.e from `https://frontend.myapp.com` to `https://api.myapp.com`), there are certain restrictions modern browsers make to protect users. In order for the browser to correctly access resources from the other origin, it needs to adhere to a set of rules enforced by the server through HTTP headers. If you are the maintainer of the server and have access to add or configure these headers, then keep reading! Otherwise, you might need to consult the maintainer and return once you know you can update them.

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

This answer certainly does work, however, I strongly advise you understand the implications of this. Yes, as you might have guessed, the asteriks does imply that *any* domain can reach this. There's nothing inherently wrong with that and it might be easier to do this if you plan to keep adding different front-end services that hit the same API, but let's make sure that we understand how this works with the next header we'll cover.

### Access-Control-Allow-Credentials

Okay, so you have the domain calling to some endpoint. Now the user needs to request some sensitive data. Hopefully, you have some authentication on the endpoint in place, so they'll have to login before making the request. Not a problem! Let's login and, try the frontend and... uh oh. More network errors.

So, what's happening is that the server is not allowing the browser to send up the authentication cookies or headers, whichever are in place. This is for the benefit of the user's security. To see why this might be a security risk, let's consider the following example with the header from our previous example.

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Receiving these headers indicates that it is both okay for a script from any domain to hit the endpoint and for authentication cookies to be sent up. So this means that if the user is logged in to your service with a cookie and they get a script from a malicious domain, that domain can request resources from your API and steal user data. That's why it might be a good idea to be as explicit as possible to list only the domains you want your scripts to request.

Keep in mind that this vulnerability is essentially Cross-site request forgery. However, do not rely exclusively on CORS to protect your endpoints. If you use cookies, definitely enforce XSRF protection where you can.

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

To follow along, open up the network console in your browser and watch the requests as they are invoked. You'll see that the browser sends a request with an HTTP method of `OPTIONS`. This is because the browser wants to see what methods are allowed *before* it sends the actual request.

If you do what I did and forget to set up an endpoint on the server for it, you'll likely get a big fat `404` error response and the request will bail. To remediate this issue, simply add an endpoint with some sort of success response and the headers we've talked about so far. An [Express](https://expressjs.com/) server in Node.js would look something like this.

```js
// The PUT endpoint
app.put('/the/api/resource', (req, res) => {
  const data = updateTheResource(req.body.data);
  res.status(200).send(data);
});

// The pre-flight request handler endpoint
app.options('/the/api/resource', (req, res) => {
  res.status(204).send();
});
```

I don't know if it's best practice or not to do it this way, but I figure since all we care about are the headers, there is no need to send content (hence, the `204` status).

That's it! You can finally use methods other than `GET`, `HEAD`, and `POST` from your front-end to the API service. Happy hacking!