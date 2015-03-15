var TimeAgo = function (date) {

  var now = new Date();
  var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  var interval = Math.floor(seconds / 31536000);
  if (interval == 1) {
      return interval + " year ago";
  }
  if (interval > 1) {
      return interval + " years ago";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval == 1) {
      return interval + " month ago";
  }
  if (interval > 1) {
      return interval + " months ago";
  }

  interval = Math.floor(seconds / 86400);
  if (interval == 1) {
      return "yesterday";
  }
  if (interval > 1) {
      return interval + " days ago";
  }

  interval = Math.floor(seconds / 3600);
  if (interval == 1) {
      return interval + " hour ago";
  }
  if (interval > 1) {
      return interval + " hours ago";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " minutes ago";
  }

  interval = Math.floor(seconds);

  return interval + " seconds ago";
}

module.exports = TimeAgo;