
module.exports = {
  style: `
    :host {
      font-family: Helvetica Neue;
      font-weight: 100;
      color: rgba(255,255,255,0.8);
    }

    #percent {
      float: right;
    }

    #bar {
      margin: 5px 0;
      min-height: 4px;
      background: rgb(0,255,0);
      width: 100%;
      transition: all 1000ms ease;
    }
  `,
  innerHTML: `
    <span>Battery</span><span id="percent"></span>
    <div id="bar"></div>
  `,
  config: {
    refresh: `2m`,
    width: '371px'
  },
  render() {
    this.element.style.width = this.config.width;
    const $bar = this.element.querySelector('#bar');
    const $percent = this.element.querySelector('#percent');
    exec(`pmset -g batt | grep "%" | awk 'BEGINN { FS = ";" };{ print $3,$2 }' | sed -e 's/-I/I/' -e 's/-0//' -e 's/;//' -e 's/;//'`)
      .then(res => {
        res = res.split(' ');
        const percent = Number(res[1].slice(0, -2));
        const state = res[0];
        const hue = ((percent * 0.01) * 120).toString(10);

        $bar.style.width = percent + '%';
        $bar.style.background = `hsl(${hue},100%,50%)`;
        $percent.innerHTML = percent + '%';
      })
      .catch(e => console.log(e));
  }
};

function exec(...args) {
  return new Promise((resolve, reject) => {
    require('child_process').exec(...args, (err, stdout, stderr) => {
      if (err) reject(err);
      else if (stderr) reject(stderr);
      else resolve(stdout);
    });
  });
}