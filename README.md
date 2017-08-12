
# API Standards

* [Guidelines](#guidelines)
* [Pragmatic REST](#pragmatic-rest)
* [RESTful URLs](#restful-urls)
* [HTTP Verbs](#http-verbs)
* [Responses](#responses)
* [Error handling](#error-handling)
* [Versions](#versions)
* [Record limits](#record-limits)
* [Request & Response Examples](#request--response-examples)
* [Mock Responses](#mock-responses)
* [JSONP](#jsonp)

## Guidelines

This document provides guidelines and examples for White House Web APIs, encouraging consistency, maintainability, and best practices across applications. White House APIs aim to balance a truly RESTful API interface with a positive developer experience (DX).

This document borrows heavily from:
* [Designing HTTP Interfaces and RESTful Web Services](https://www.youtube.com/watch?v=zEyg0TnieLg)
* [API Facade Pattern](http://apigee.com/about/resources/ebooks/api-fa%C3%A7ade-pattern), by Brian Mulloy, Apigee
* [Web API Design](http://pages.apigee.com/web-api-design-ebook.html), by Brian Mulloy, Apigee
* [Fielding's Dissertation on REST](http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)

## Pragmatic REST

These guidelines aim to support a truly RESTful API. Here are a few exceptions:
* Put the version number of the API in the URL (see examples below). Don’t accept any requests that do not specify a version number.
* Allow users to request formats like JSON or XML like this:
    * http://example.gov/api/v1/magazines.json
    * http://example.gov/api/v1/magazines.xml

## RESTful URLs

### General guidelines for RESTful URLs
* A URL identifies a resource.
* URLs should include nouns, not verbs.
* Use plural nouns only for consistency (no singular nouns).
* Use HTTP verbs (GET, POST, PUT, DELETE) to operate on the collections and elements.
* You shouldn’t need to go deeper than resource/identifier/resource.
* Put the version number at the base of your URL, for example http://example.com/v1/path/to/resource.
* URL v. header:
    * If it changes the logic you write to handle the response, put it in the URL.
    * If it doesn’t change the logic for each response, like OAuth info, put it in the header.
* Specify optional fields in a comma separated list.
* Formats should be in the form of api/v2/resource/{id}.json

### Good URL examples
* List of magazines:
    * GET http://www.example.gov/api/v1/magazines.json
* Filtering is a query:
    * GET http://www.example.gov/api/v1/magazines.json?year=2011&sort=desc
    * GET http://www.example.gov/api/v1/magazines.json?topic=economy&year=2011
* A single magazine in JSON format:
    * GET http://www.example.gov/api/v1/magazines/1234.json
* All articles in (or belonging to) this magazine:
    * GET http://www.example.gov/api/v1/magazines/1234/articles.json
* All articles in this magazine in XML format:
    * GET http://example.gov/api/v1/magazines/1234/articles.xml
* Specify optional fields in a comma separated list:
    * GET http://www.example.gov/api/v1/magazines/1234.json?fields=title,subtitle,date
* Add a new article to a particular magazine:
    * POST http://example.gov/api/v1/magazines/1234/articles

### Bad URL examples
* Non-plural noun:
    * http://www.example.gov/magazine
    * http://www.example.gov/magazine/1234
    * http://www.example.gov/publisher/magazine/1234
* Verb in URL:
    * http://www.example.gov/magazine/1234/create
* Filter outside of query string
    * http://www.example.gov/magazines/2011/desc

## HTTP Verbs

HTTP verbs, or methods, should be used in compliance with their definitions under the [HTTP/1.1](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html) standard.
The action taken on the representation will be contextual to the media type being worked on and its current state. Here's an example of how HTTP verbs map to create, read, update, delete operations in a particular context:

| HTTP METHOD | POST            | GET       | PUT         | DELETE |
| ----------- | --------------- | --------- | ----------- | ------ |
| CRUD OP     | CREATE          | READ      | UPDATE      | DELETE |
| /dogs       | Create new dogs | List dogs | Bulk update | Delete all dogs |
| /dogs/1234  | Error           | Show Bo   | If exists, update Bo; If not, error | Delete Bo |

(Example from Web API Design, by Brian Mulloy, Apigee.)


## Responses

* No values in keys
* No internal-specific names (e.g. "node" and "taxonomy term")
* Metadata should only contain direct properties of the response set, not properties of the members of the response set

### Good examples

No values in keys:

    "tags": [
      {"id": "125", "name": "Environment"},
      {"id": "834", "name": "Water Quality"}
    ],


### Bad examples

Values in keys:

    "tags": [
      {"125": "Environment"},
      {"834": "Water Quality"}
    ],


## Error handling

Error responses should include a common HTTP status code, message for the developer, message for the end-user (when appropriate), internal error code (corresponding to some specific internally determined ID), links where developers can find more info. For example:

    {
      "status" : 400,
      "developerMessage" : "Verbose, plain language description of the problem. Provide developers
       suggestions about how to solve their problems here",
      "userMessage" : "This is a message that can be passed along to end-users, if needed.",
      "errorCode" : "444444",
      "moreInfo" : "http://www.example.gov/developer/path/to/help/for/444444,
       http://drupal.org/node/444444",
    }

Use three simple, common response codes indicating (1) success, (2) failure due to client-side problem, (3) failure due to server-side problem:
* 200 - OK
* 400 - Bad Request
* 500 - Internal Server Error


## Versions

* Never release an API without a version number.
* Versions should be integers, not decimal numbers, prefixed with ‘v’. For example:
    * Good: v1, v2, v3
    * Bad: v-1.1, v1.2, 1.3
* Maintain APIs at least one version back.


## Record limits

* If no limit is specified, return results with a default limit.
* To get records 51 through 75 do this:
    * http://example.gov/magazines?limit=25&offset=50
    * offset=50 means, ‘skip the first 50 records’
    * limit=25 means, ‘return a maximum of 25 records’

Information about record limits and total available count should also be included in the response. Example:

    {
        "metadata": {
            "resultset": {
                "count": 227,
                "offset": 25,
                "limit": 25
            }
        },
        "results": []
    }

## Request & Response Examples

### API Resources

  - [GET /magazines](#get-magazines)
  - [GET /magazines/[id]](#get-magazinesid)
  - [POST /magazines/[id]/articles](#post-magazinesidarticles)

### GET /magazines

Example: http://example.gov/api/v1/magazines.json

Response body:

    {
        "metadata": {
            "resultset": {
                "count": 123,
                "offset": 0,
                "limit": 10
            }
        },
        "results": [
            {
                "id": "1234",
                "type": "magazine",
                "title": "Public Water Systems",
                "tags": [
                    {"id": "125", "name": "Environment"},
                    {"id": "834", "name": "Water Quality"}
                ],
                "created": "1231621302"
            },
            {
                "id": 2351,
                "type": "magazine",
                "title": "Public Schools",
                "tags": [
                    {"id": "125", "name": "Elementary"},
                    {"id": "834", "name": "Charter Schools"}
                ],
                "created": "126251302"
            }
            {
                "id": 2351,
                "type": "magazine",
                "title": "Public Schools",
                "tags": [
                    {"id": "125", "name": "Pre-school"},
                ],
                "created": "126251302"
            }
        ]
    }

### GET /magazines/[id]

Example: http://example.gov/api/v1/magazines/[id].json

Response body:

    {
        "id": "1234",
        "type": "magazine",
        "title": "Public Water Systems",
        "tags": [
            {"id": "125", "name": "Environment"},
            {"id": "834", "name": "Water Quality"}
        ],
        "created": "1231621302"
    }



### POST /magazines/[id]/articles

Example: Create – POST  http://example.gov/api/v1/magazines/[id]/articles

Request body:

    [
        {
            "title": "Raising Revenue",
            "author_first_name": "Jane",
            "author_last_name": "Smith",
            "author_email": "jane.smith@example.gov",
            "year": "2012",
            "month": "August",
            "day": "18",
            "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ante ut augue scelerisque ornare. Aliquam tempus rhoncus quam vel luctus. Sed scelerisque fermentum fringilla. Suspendisse tincidunt nisl a metus feugiat vitae vestibulum enim vulputate. Quisque vehicula dictum elit, vitae cursus libero auctor sed. Vestibulum fermentum elementum nunc. Proin aliquam erat in turpis vehicula sit amet tristique lorem blandit. Nam augue est, bibendum et ultrices non, interdum in est. Quisque gravida orci lobortis... "
        }
    ]


## Mock Responses
It is suggested that each resource accept a 'mock' parameter on the testing server. Passing this parameter should return a mock data response (bypassing the backend).

Implementing this feature early in development ensures that the API will exhibit consistent behavior, supporting a test driven development methodology.

Note: If the mock parameter is included in a request to the production environment, an error should be raised.


## JSONP

JSONP is easiest explained with an example. Here's one from [StackOverflow](http://stackoverflow.com/questions/2067472/what-is-jsonp-all-about?answertab=votes#tab-top):

> Say you're on domain abc.com, and you want to make a request to domain xyz.com. To do so, you need to cross domain boundaries, a no-no in most of browserland.

> The one item that bypasses this limitation is `<script>` tags. When you use a script tag, the domain limitation is ignored, but under normal circumstances, you can't really DO anything with the results, the script just gets evaluated.

> Enter JSONP. When you make your request to a server that is JSONP enabled, you pass a special parameter that tells the server a little bit about your page. That way, the server is able to nicely wrap up its response in a way that your page can handle.

> For example, say the server expects a parameter called "callback" to enable its JSONP capabilities. Then your request would look like:

>         http://www.xyz.com/sample.aspx?callback=mycallback

> Without JSONP, this might return some basic javascript object, like so:

>         { foo: 'bar' }

> However, with JSONP, when the server receives the "callback" parameter, it wraps up the result a little differently, returning something like this:

>         mycallback({ foo: 'bar' });

> As you can see, it will now invoke the method you specified. So, in your page, you define the callback function:

>         mycallback = function(data){
>             alert(data.foo);
>         };

http://stackoverflow.com/questions/2067472/what-is-jsonp-all-about?answertab=votes#tab-top


-------------------------------------------------------------------------------------------------------------

# API Design 
1. Build the API with consumers in mind--as a product in its own right.
    * Not for a specific UI.
    * Embrace flexibility / tunability of each endpoint (see #5, 6 & 7).
    * Eat your own dogfood, even if you have to mockup an example UI.

-----------------------------------------

1. Use the Collection Metaphor.
    * Two URLs (endpoints) per resource:
        * The resource collection (e.g. /orders)
        * Individual resource within the collection (e.g. /orders/{orderId}).
    * Use plural forms (‘orders’ instead of ‘order’).
    * Alternate resource names with IDs as URL nodes (e.g. /orders/{orderId}/items/{itemId})
    * Keep URLs as short as possible. Preferably, no more-than three nodes per URL.

1. Use nouns as resource names (e.g. don’t use verbs in URLs).

1. Make resource representations meaningful.
    * “No Naked IDs!” No plain IDs embedded in responses. Use links and reference objects.
    * Design resource representations. Don’t simply represent database tables.
    * Merge representations. Don’t expose relationship tables as two IDs.

1. Support filtering, sorting, and pagination on collections.

1. Support link expansion of relationships. Allow clients to expand the data contained in the response by including additional representations instead of, or in addition to, links.

1. Support field projections on resources. Allow clients to reduce the number of fields that come back in the response.

1. Use the HTTP method names to mean something:
    * POST - create and other non-idempotent operations.
    * PUT - update.
    * GET - read a resource or collection.
    * DELETE - remove a resource or collection.

1. Use HTTP status codes to be meaningful.
    * 200 - Success.
    * 201 - Created. Returned on successful creation of a new resource. Include a 'Location' header with a link to the newly-created resource.
    * 400 - Bad request. Data issues such as invalid JSON, etc.
    * 404 - Not found. Resource not found on GET.
    * 409 - Conflict. Duplicate data or invalid data state would occur.

1. Use ISO 8601 timepoint formats for dates in representations.

1. Consider connectedness by utilizing a linking strategy. Some popular examples are:
    * [HAL](http://stateless.co/hal_specification.html)
    * [Siren](https://github.com/kevinswiber/siren)
    * [JSON-LD](http://json-ld.org/)
    * [Collection+JSON](http://amundsen.com/media-types/collection/)

1. Use [OAuth2](http://oauth.net/2/) to secure your API.
    * Use a Bearer token for authentication.
    * Require HTTPS / TLS / SSL to access your APIs. OAuth2 Bearer tokens demand it. Unencrypted communication over HTTP allows for simple eavesdroppping and impersonation.

1. Use Content-Type negotiation to describe incoming request payloads.

    For example, let's say you're doing ratings, including a thumbs-up/thumbs-down and five-star rating. You have one route to create a rating: **POST /ratings**

    How do you distinguish the incoming data to the service so it can determine which rating type it is: thumbs-up or five star?

    The temptation is to create one route for each rating type: **POST /ratings/five_star** and **POST /ratings/thumbs_up**

    However, by using Content-Type negotiation we can use our same **POST /ratings** route for both types. By setting the *Content-Type* header on the request to something like **Content-Type: application/vnd.company.rating.thumbsup** or **Content-Type: application/vnd.company.rating.fivestar** the server can determine how to process the incoming rating data.

1. Evolution over versioning. However, if versioning, use the Accept header instead of versioning in the URL.
    * Versioning via the URL signifies a 'platform' version and the entire platform must be versioned at the same time to enable the linking strategy.
    * Versioning via the Accept header is versioning the resource.
    * Additions to a JSON response do not require versioning. However, additions to a JSON request body that are 'required' are troublesome--and may require versioning.
    * Hypermedia linking and versioning is troublesome no matter what--minimize it.
    * Note that a version in the URL, while discouraged, can be used as a 'platform' version. It should appear as the first node in the path and not version individual endpoints differently (e.g. api.example.com/v1/...).

1. Consider Cache-ability. At a minimum, use the following response headers:
    * ETag - An arbitrary string for the version of a representation. Make sure to include the media type in the hash value, because that makes a different representation. (ex: ETag: "686897696a7c876b7e")
    * Date - Date and time the response was returned (in RFC1123 format). (ex: Date: Sun, 06 Nov 1994 08:49:37 GMT)
    * Cache-Control - The maximum number of seconds (max age) a response can be cached. However, if caching is not supported for the response, then no-cache is the value. (ex: Cache-Control: 360 or Cache-Control: no-cache)
    * Expires - If max age is given, contains the timestamp (in RFC1123 format) for when the response expires, which is the value of Date (e.g. now) plus max age. If caching is not supported for the response, this header is not present. (ex: Expires: Sun, 06 Nov 1994 08:49:37 GMT)
    * Pragma - When Cache-Control is 'no-cache' this header is also set to 'no-cache'. Otherwise, it is not present. (ex: Pragma: no-cache)
    * Last-Modified - The timestamp that the resource itself was modified last (in RFC1123 format). (ex: Last-Modified: Sun, 06 Nov 1994 08:49:37 GMT)

1. Ensure that your GET, PUT, and DELETE operations are all [idempotent](http://www.restapitutorial.com/lessons/idempotency.html).  There should be no adverse side affects from operations.




----------------------------------------------


mation that can be named can be a resource: a document or image, a temporal service (e.g. “today’s weather in Los Angeles”),
 a collection of other resources, a non-virtual object (e.g. a person), and so on. 
 In other words, any concept that might be the target of an author’s hypertext reference must fit within the definition of a resource.
 A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.
    Roy Fielding’s dissertation

http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm#sec_5_2_1_1

resource can be a singleton or a collection
resource may contain sub-collection resources
-------------------------------------------------------------------------------------------------------------------------------
http://www.restapitutorial.com/lessons/restfulresourcenaming.html

  Resources are within your system, name them as nouns as opposed to verbs or actions.
  RESTful URI should refer to a resource that is a thing instead of referring to an action.
  RESTful APIs are written for consumers. The name and structure of URIs should convey meaning to those consumers.
  
  URL is not self- descriptive as the URI hierarchy is the same for all requests.
  
  There are good arguments on both sides, but the commonly-accepted practice is to always use plurals in node names to keep your API URIs consistent across all HTTP methods. 
  The reasoning is based on the concept that customers are a collection within the service suite and the ID (e.g. 33245) refers to one of those customers in the collection.

You ask if there is a case where pluralization doesn't make sense. Well, yes, in fact there is. When there isn't a collection concept in play. In other words, it's acceptable to use a singularized resource name when there can only be one of the resource—it's a singleton resource. For example, if there was a single, overarching configuration resource, you might use a singularized noun to represent that:


A resource may “contain” sub-collection resources also. For example, sub-collection resource “accounts” of a particular “customer” 
can be identified using the URN “/customers/{customerId}/accounts” (in a banking domain). Similarly, a singleton resource “account” inside the sub-collection resource
 “accounts” can be identified as follows: “customers/{customerId}/accounts/{accountId}”.

https://blog.philipphauer.de/restful-api-design-best-practices/

GET|PUT|DELETE http://www.example.com/configuration


Twitter: https://dev.twitter.com/docs/api
Facebook: http://developers.facebook.com/docs/reference/api/
LinkedIn: https://developer.linkedin.com/apis

https://developers.google.com/+/web/api/rest/latest/activities/list

http://restfulapi.net/resource-naming/

https://www.thoughtworks.com/insights/blog/rest-api-design-resource-modeling


-------------------------------------------------------------------
