// Generated by CoffeeScript 1.3.1

window.Face = Backbone.Model.extend({
  urlRoot: "/api/v2/face/",
  getImage: function() {
    var browser_width, image;
    image = void 0;
    browser_width = $(window).width();
    if (browser_width > this.get("width")) {
      image = this.get("image");
    } else if (browser_width > 1050 && this.get("resizes").huge) {
      image = this.get("resizes").huge;
    } else if (browser_width > 700 && this.get("resizes").large) {
      image = this.get("resizes").large;
    } else if (browser_width > 400 && this.get("resizes").medium) {
      image = this.get("resizes").medium;
    } else if (this.get("resizes").small) {
      image = this.get("resizes").small;
    } else {
      image = face.image;
    }
    return image;
  },
  getThumb: function() {
    var thumb;
    if (this.get("thumbnails").gif) {
      thumb = this.get("thumbnails").gif;
    } else if (this.get("thumbnails").png) {
      thumb = this.get("thumbnails").png;
    } else if (this.get("thumbnails").jpg) {
      thumb = this.get("thumbnails").jpg;
    }
    return thumb;
  }
});

window.FaceCollection = Backbone.Collection.extend({
  model: Face,
  url: "/api/v2/face/"
});

window.Feedback = Backbone.Model.extend({
  urlRoot: "/api/v2/feedback/"
});

window.Tag = Backbone.Model.extend({
  urlRoot: "/api/v2/tag/"
});

window.TagCollection = Backbone.Collection.extend({
  model: Tag,
  url: "/api/v2/tag/"
});

window.Advert = Backbone.Model.extend({
  urlRoot: "/api/v2/ad/"
});

window.AdvertCollection = Backbone.Collection.extend({
  model: Tag,
  url: "/api/v2/ad/"
});
