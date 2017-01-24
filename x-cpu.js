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
      width: 0;
      transition: all 1000ms ease;
    }
  `,
  innerHTML: `
    <span>CPU</span><span id="percent"></span>
    <div id="bar"></div>
  `,
  config: {
    refresh: `2s`,
    width: '371px'
  },
  render() {
    this.element.style.width = this.config.width;
    const $bar = this.element.querySelector('#bar');
    const $percent = this.element.querySelector('#percent');
    exec(`ps aux  | awk 'BEGIN { sum = 0 }  { sum += $3 }; END { print sum }' && sysctl hw.ncpu | awk '{print $2}'`)
      .then(res => {
        res = res.split('\n');
        const percent = parseInt(res[0]/res[1]);
        const hue = (((100 - percent) * 0.01) * 120).toString(10);

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