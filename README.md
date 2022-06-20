https://github.com/nestjs/nest/issues/9810

### Current behavior

I have a `@Sse` handler which optionally throws an `UnauthorizedException`, and
when it does it, the exception gets serialized and sent to the client as
a server-sent event; however, shouldn't Nest simply close the connection and
send the serialized exception within the body of the response? Otherwise I am
afraid there migth be the risk of un-authorized requests consuming server
resources.

### Steps to reproduce

1. `npm ci`
2. `npm run start:dev`
3. `curl -v http://127.0.0.1:3000/sse`

### Expected behavior

I would expect the server to close the connection with a 401 status code:

```
*   Trying 127.0.0.1:3000...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /sse HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.68.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 401 Unauthorized
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 43
< ETag: W/"2b-hGShxOkieaAVDloBubJVM+h58D8"
< Date: Mon, 20 Jun 2022 04:58:18 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host 127.0.0.1 left intact
{"statusCode":401,"message":"Unauthorized"}
```

What happens instead, the exception gets serialized as server-sent event, and the connection left open:

```
*   Trying 127.0.0.1:3000...
* TCP_NODELAY set
* Connected to 127.0.0.1 (127.0.0.1) port 3000 (#0)
> GET /sse HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/7.68.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< x-powered-by: Express
< Content-Type: text/event-stream
< Connection: keep-alive
< Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0, no-transform
< Pragma: no-cache
< Expire: 0
< X-Accel-Buffering: no
< Date: Mon, 20 Jun 2022 04:59:18 GMT
< Transfer-Encoding: chunked
<

event: error
id: 1
data: Unauthorized

* Connection #0 to host 127.0.0.1 left intact
```

