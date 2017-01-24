const request = require('request');

module.exports = {
  style: `
    :host {
      color: rgba(255,255,255,0.8);
      font-family: Helvetica Neue;
      font-weight: 200;
      font-size: 2rem;
    }
  `,
  config: {
    refresh: `10m`,
    city: 'OklahomaCity',
    units: 'imperial'
  },
  render() {
    this.element.innerHTML = 70 + '&#8457';
    // request(`http://api.openweathermap.org/data/2.5/weather?q=${this.config.city}&APPID=ff0917003975255ce7f8c8c867bfed51&units=${this.config.units}`, (err, res, body) => {
      // if (!err && body) {
        // body = JSON.parse(body);
        // this.element.innerHTML = Math.floor(body.main.temp) + '&#8457';
      // }
    // });
  }
};