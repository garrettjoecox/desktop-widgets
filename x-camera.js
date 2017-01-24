
module.exports = {
  style: `
    :host {
    }
  `,
  config: {
  },
  render() {
    this.element.innerHTML = '<video></video>';
    const video = this.element.querySelector('video');

    navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

    navigator.getMedia(
      // constraints
      {video:true, audio:false},

      // success callback
      function (mediaStream) {
        video.src = window.URL.createObjectURL(mediaStream);
        video.play();
      },
      //handle error
      function (error) {
        console.log(error);
      }
    );
  }
};