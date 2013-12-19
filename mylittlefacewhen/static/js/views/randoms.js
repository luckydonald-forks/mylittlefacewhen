// Generated by CoffeeScript 1.6.3
window.RandomsView = Backbone.View.extend({
  el: "#content",
  initialize: function() {
    var _this = this;
    this.title = "Random images - MyLittleFaceWhen";
    this.description = "Endless list of random pony-related reaction images. Goes on-and-on-and-on-and...";
    this.template = tpl.get("randoms");
    this.loading = false;
    $(window).on("resize.randoms", function(event) {
      if (atBottom(500)) {
        return _this.loadMore();
      }
    });
    return $(window).on("scroll.randoms", function(event) {
      if (atBottom(500)) {
        return _this.loadMore();
      }
    });
  },
  beforeClose: function() {
    $(window).off("resize.randoms");
    return $(window).off("scroll.randoms");
  },
  render: function() {
    this.updateMeta(this.title, this.description);
    this.$el.html(Mustache.render(this.template, {
      static_prefix: static_prefix
    }));
    this.loadMore();
    return this;
  },
  loadMore: function() {
    var collection,
      _this = this;
    if (!this.loading) {
      this.loading = true;
      $("#loader").show();
      collection = new FaceCollection();
      return collection.fetch({
        data: {
          order_by: "random",
          limit: 3,
          accepted: true,
          removed: false
        },
        success: function(data) {
          _.each(collection.models, function(model) {
            if (!app.randFaceList.get(model.id)) {
              app.randFaceList.add(model);
            }
            return $("#randoms").append(new RandomsImage({
              model: model
            }).render().el);
          });
          $("#loader").hide();
          return setTimeout(function() {
            _this.loading = false;
            if (data.length > 0) {
              if (atBottom(500) && app.currentPage === _this) {
                return _this.loadMore();
              }
            } else {
              return $("#loadMore").hide();
            }
          }, 1000);
        },
        error: function() {
          $("#loader").hide();
          return this.loading = false;
        }
      });
    }
  }
});

window.RandomsImage = Backbone.View.extend({
  tagName: "div",
  className: "listimage",
  initialize: function() {
    return this.template = tpl.get("randomsImage");
  },
  render: function() {
    var image, model, to_template;
    model = this.model.toJSON();
    image = app.getImageService() + this.model.getImage(640);
    to_template = {
      model: model,
      image: image,
      static_prefix: static_prefix
    };
    this.$el.html(Mustache.render(this.template, to_template));
    $(this.el.firstChild).on("click", this.navigateAnchor);
    $(this.el.firstChild.firstChild).load(function() {
      return $(this).removeClass('fixedHeight');
    });
    return this;
  }
});
