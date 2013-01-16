Problems = new Meteor.Collection("problems-list")

if (Meteor.isClient) {

  Template.problems_list.problems =  function() {
    return Problems.find({}, {sort: {votes: -1, name: 1}})
  }

  Template.new_problem.events({
    'click #add-idea' : function(e) {
      var problem = $('#problem-name').val();
      var solution = $('#solution').val();
      Problems.insert({name: problem, solution: [solution], votes: 0});
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
}
