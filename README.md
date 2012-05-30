# Cueue - Couchdb qUEUE

Cueue is a generic job queue built on top of CouchDB and CouchApps
with the goal of being universally accessible and self contained.

# Install

First install [node.couchapp.js](https://github.com/mikeal/node.couchapp.js)

Then push Cueue into your CouchDB instance:

    couchapp push app.js http://localhost:5984/cueue


# Create a new job

    curl -X POST http://localhost:5984/cueue/_design/cueue/_update/enqueue -d "foo=bar"

# Accept a job for work

    curl -X POST http://localhost:5984/cueue/_design/cueue/_update/accept/7c4fccc88ea21b5a156f0d34fa046ea6 -d "worker_uid=1234asdf"

# Throw an error

    curl -X POST http://localhost:5984/cueue/_design/cueue/_update/error/7c4fccc88ea21b5a156f0d34fa02e5c3 -d "error=Does not compute"

# Finish processing a job

    curl -X POST http://localhost:5984/cueue/_design/cueue/_update/complete/7c4fccc88ea21b5a156f0d34fa02e5c3 -d 'output={"some":"json blob","answer":42}'

# View in the browser

    open http://localhost:5984/cueue/_design/cueue/_rewrite
  
Simple web interface, lots to do on it, but gives you an idea of the
state of the Cueue. Follows the changes feed for new jobs and will
update automatically.

## TODO

 * Switch to use header User-Agent for worker_uid
 * Provide example workers
 * Setup FSM for state transitions and validations
 * Lots more

## License

Apache v2.0
