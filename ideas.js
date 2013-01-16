Problems = new Meteor.Collection("problems")



if (Meteor.isClient) {

  Meteor.subscribe("problems");

  Template.problems_list.problems =  function() {
    if(Meteor.userId()) {
      return Problems.find({}, {sort: {votes: -1, name: 1}});  
    } else {
      return 
    }
  }

  Template.new_problem.events({
    'click #add-idea' : function(e) {
      var problem = $('#problem-name').val();
      var solution = $('#solution').val();
      Problems.insert({name: problem, owner: this.userId,  solution: [solution], votes: 0});
      $('#problem-name').val('');
      $('#solution').val('');
      $('.add-problem').hide('fast');
      return false;
    }
  });

  Template.header.events({
    'click #add-problem-btn' : function(e) {
      $('.add-problem').show('fast', function() {
        $('#problem-name').focus();
      });
      return false;
    }
  })

  Template.problem_info.events({
    'keydown .new-comment' : function(e) {
      if (e.keyCode == 13){
        var id = ($(e.target).parent().parent().parent().attr('id'))
        var contents = $(e.target).val()
        if(contents.trim() != "") {
          Problems.update(id, {$push: {solution: contents}});
          $('#' + id).find('.add-new-comment').hide();
        }
      }
    },
    'click .adder' : function(e) {
      var self = $(e.target);
      if (e.target.tagName == 'I')
        self = $(self).parent();
      
      var parent = $(self).parent().parent();
      $(parent).find('.add-new-comment').show();
      $(self).hide();
      $(parent).find('.add-new-comment input').focus();
    },
    'click .remove-problem': function(e) {
      if(confirm('Remove entry?')) {
        var self = $(e.target);
        if (e.target.tagName == 'I')
          self = $(self).parent();

        var id = $(self).parent().parent().attr('id');
        Problems.remove(id); 
      }
      return false;
    }
  })

  Template.problems_list.events({
    'click button' : function (e) {
      var parent = $(e.target).parent().parent().parent();
      if(e.target.tagName == 'I') {
        parent = parent.parent();
      }

      var id = parent.attr('id');

      if($(e.target).parent().hasClass('vote-up'))
        Problems.update(id, {$inc: {votes: 1}});
      else
        Problems.update(id, {$inc: {votes: -1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


  var is_allowed = function(userId) {
    var allowed = ['allagappan@gmail.com', 'rajagopal.n@gmail.com', 'alagu@markupwand.com', 'raj@markupwand.com','surenspost@gmail.com', 'suren@markupwand.com'];
    var user = Meteor.users.findOne(userId);
    debugger;
    if (user) {
      var email = user['services']['google']['email'];
      
      if (allowed.indexOf(email) == -1)
        return false;
      else
        return true; 
    } else {
      return false;
    }
  };

  Meteor.publish("problems", function () {
    if(is_allowed(this.userId)) {
      return Problems.find({}, {sort: {votes: -1, name: 1}});
    }
    else {
      return Problems.find({name: '6a204bd89f3c8348afd5c77c717a097a' });
    }
  });



  Problems.allow({
    insert: function(userId) {
      return is_allowed(userId);
    },
    remove: function(userId) {
      return true;
    }
  });


}
