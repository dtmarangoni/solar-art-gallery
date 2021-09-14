# Backend REST API Documentation

This document gives an overview of each backend REST API endpoints.

## Endpoints

For guidance, please refer to each of the REST API endpoints.

-   Get Public Albums

```yaml
summary: returns a collection of all public albums with optional pagination
method: GET
path: /album/public
queryParameters:
  limit: string
    description: The response page size limit
    required: false
  nextKey: string
    description: The next item key to start the new page from
    required: false
```

-   Get Public Album

```yaml
summary: returns a public album
method: POST
path: /album/public
body:
  content: 'application/json'
    albumId: string
      description: the album ID
      required: true
```

-   Get User's Albums

```yaml
summary: returns a collection of user's albums with optional pagination
method: GET
path: /album/my
queryParameters:
  limit: string
    description: The response page size limit
    required: false
  nextKey: string
    description: The next item key to start the new page from
    required: false
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Get User Album

```yaml
summary: returns an user album
method: POST
path: /album/my
body:
  content: 'application/json'
    albumId: string
      description: the album ID
      required: true
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Add a New Album

```yaml
summary: add a new user album
method: PUT
path: /album/my
body:
  content: 'application/json'
    visibility: string
      description: public or private visibility
      required: true
    title: string
      description: The album title
      required: true
    description: string
      description: The album description
      required: true
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Edit an Album

```yaml
summary: edit an user album
method: PATCH
path: /album/my
body:
  content: 'application/json'
    albumId: string
      description: the album ID
      required: true
    visibility: string
      description: public or private visibility
      required: false
    title: string
      description: The album title
      required: false
    description: string
      description: The album description
      required: false
    genUploadUrl: boolean
        description: A flag indicating if new pre-signed download and upload urls for album cover images should be generated
        required: false
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Delete an Album

```yaml
summary: delete an user album
method: DELETE
path: /album/my
body:
  content: 'application/json'
    albumId: string
      description: the album ID
      required: true
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Get Public Album's Arts

```yaml
summary: returns a collection of a public album's arts with optional pagination
method: POST
path: /art/public
queryParameters:
  limit: string
    description: The response page size limit
    required: false
  nextKey: string
    description: The next item key to start the new page from
    required: false
body:
  content: 'application/json'
    albumId: string
      description: the album ID
      required: true
```

-   Get User Album's Arts

```yaml
summary: returns a collection of an user album's arts with optional pagination
method: POST
path: /art/my
queryParameters:
  limit: string
    description: The response page size limit
    required: false
  nextKey: string
    description: The next item key to start the new page from
    required: false
body:
  content: 'application/json'
    albumId: string
      description: the album ID
      required: true
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Add and/or update arts

```yaml
summary: add and/or update multiple arts to an user album
method: PUT
path: /art/my
body:
  content: 'application/json'
    type: array
      albumId: string
        description: the album ID
        required: true
      artId: string
        description: The art ID. Required only for update action
        required: false
      title: string
        description: The art title. Required only for add action
        required: false
      description: string
        description: The art description. Required only for add action
        required: false
      genUploadUrl: boolean
        description: A flag indicating if new pre-signed download and upload urls for arts images should be generated
        required: false
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Delete arts

```yaml
summary: delete multiple arts from an user album
method: DELETE
path: /art/my
body:
  content: 'application/json'
    type: array
      albumId: string
        description: the album ID
        required: true
      artId: string
        description: the art ID
        required: true
security:
  header:
    Bearer Token: User credentials bearer token
```

-   Add or edit an user

```yaml
summary: add or edit an user
method: PUT
path: /user
security:
    header:
        Bearer Token: User credentials bearer token
```
