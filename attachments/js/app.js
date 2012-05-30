$(function() {
  var Job = Backbone.Model.extend({
  });

  var Jobs = Backbone.couch.Collection.extend({
    change_feed : true,
    _db : Backbone.couch.db("cueue"),
    model : Job,
    changes : false,

    couch : function() {
      return {
        view : "cueue/jobs",
        include_docs : true,
        filter : {
          filter : "cueue/by_type",
          type : "job"
        }
      }
    }
  });

  var JobsList = Backbone.View.extend({
    el : $("#primary-container .jobs-table"),

    template : _.template($("#jobs-table").html()),

    initialize : function() {
      _.bindAll(this, "render", "newJob");
      this.collection.bind("reset", this.render);
      this.collection.fetch();
      this.collection.bind("add", this.newJob);
    },

    newJob : function(job) {
      this.render();
    },

    render : function() {
      $(this.el).html(this.template({jobs : this.collection}));
      return this;
    }
  });

  var Cueue = Backbone.Router.extend({
    routes : {
      "" : "list_jobs"
    },

    list_jobs : function() {
      var jobs = new Jobs();
      var jobsList = new JobsList({
        collection : jobs
      });
    }
  });

  var cueue = new Cueue();
  Backbone.history.start();

});
