// Generated by CoffeeScript 1.6.3
window.FeedbackView = Backbone.View.extend({
  el: "#content",
  initialize: function() {
    this.title = "Feedback - MyLittleFaceWhen";
    this.description = "Any suggestions or other feedback is more than welcome.";
    return this.template = tpl.get("feedback");
  },
  events: {
    "click #feedbackSubmit": "submit"
  },
  render: function() {
    this.updateMeta(this.title, this.description);
    this.$el.html(Mustache.render(this.template, {
      "message": "Submit feedback"
    }));
    return this;
  },
  submit: function(event) {
    var fb, response;
    event.preventDefault();
    $(event.currentTarget).attr("disabled", "true");
    fb = new Feedback({
      contact: $("#id_contact").val(),
      feedback: $("#id_feedback").val().replace("\n", "\\n")
    });
    response = function(model, response) {
      $(event.currentTarget).removeAttr("disabled");
      $("#dialog form").hide("fast");
      $("#dialog h2").html("Thanks for your feedback!").after($("<h4>").html("You will be redirected to complimentary poni!").css("text-align", "center"));
      return setTimeout('app.random();', 4000);
    };
    fb.save(void 0, {
      success: response,
      error: response
    });
    return void 0;
  }
});
