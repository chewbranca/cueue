 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/cueue'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/css/*", to:'../*'}
    , {from:"/js/*", to:'../*'}
    , {from:"/img/*", to:'../*'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {},

ddoc.views.jobs = {
  map : function(doc) {
    if (doc.type === 'job') {
      emit([doc.status, doc.queue], doc);
    }
  }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
};

ddoc.filters = {};

ddoc.filters.by_type = function(doc, req) {
  if (doc.type && req.query && doc.type === req.query.type) {
    return true;
  } else {
    return false;
  }
};

ddoc.updates = {
  enqueue : function(doc, req) {
    if (!doc) {
      var data = {
        _id : req.uuid,
        params : req.form,
        created : new Date(),
        updated : new Date(),
        queue : req.form.queue || 'default',
        type : 'job',
        status : 'unprocessed'
      };
      var resp = {
        "headers" : {
          "Content-Type" : "application/json"
        },
        "body" : JSON.stringify({job_id: data["_id"], success: "Added job successfully!"})
      };
      return [data, resp];
    }
  },

  accept : function(doc, req) {
    if (doc) {
      doc.status = "processing";
      doc.updated = new Date();
      doc.worker_uid = req.form.worker_uid || null;
      var resp = {
        "headers" : {
          "Content-Type" : "application/json"
        },
        "body" : JSON.stringify({job_id: doc["_id"], success: "Accepted job successfully!"})
      };
      return [doc, resp];
    }
  },

  complete : function(doc, req) {
    if (doc && req.form.output) {
      doc.status = "processed";
      doc.updated = new Date();
      doc.output = JSON.parse(req.form.output);
      var resp = {
        "headers" : {
          "Content-Type" : "application/json"
        },
        "body" : JSON.stringify({job_id: doc["_id"], success: "Completed job successfully!"})
      };
      return [doc, resp];
    }
  },

  error : function(doc, req) {
    if (doc && req.form.error) {
      doc.status = "error";
      doc.updated = new Date();
      doc.error = req.form.error;
      var resp = {
        "headers" : {
          "Content-Type" : "application/json"
        },
        "body" : JSON.stringify({job_id: doc["_id"], success: "Errored out job successfully."})
      };
      return [doc, resp];
    }
  }
};


couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
