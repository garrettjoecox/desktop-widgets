
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

    .bar {
      margin: 5px 0;
      min-height: 4px;
      width: 100%;
      transition: all 1000ms ease;
    }

    .section {
      width: 0;
      min-height: 4px;
      background: rgb(0,255,0);
      float: left;
      transition: all 1000ms ease;
    }

    .wired {
      background-color: rgb(0,255,0);
    }

    .active {
      background-color: rgb(255,0,0);
    }

    .inactive {
      background-color: rgb(255,255,0);
    }
  `,
  innerHTML: `
    <span>Memory</span><span id="percent"></span>
    <div class="bar">
      <div class="section active"></div>
      <div class="section inactive"></div>
      <div class="section wired"></div>
    </div>
  `,
  config: {
    refresh: `5s`,
    width: '371px'
  },
  render() {
    this.element.style.width = this.config.width;
    const $percent = this.element.querySelector('#percent');
    const $wired = this.element.querySelector('.wired');
    const $active = this.element.querySelector('.active');
    const $inactive = this.element.querySelector('.inactive');

    function percentage(usedPages, totalBytes, floor) {
      const usedBytes = usedPages * 4096;
      if (floor) return Math.floor((usedBytes / totalBytes * 100).toFixed(1)) + '%';
      else return (usedBytes / totalBytes * 100).toFixed(1) + '%';
    }

    exec(`memory_pressure && sysctl -n hw.memsize`)
      .then(res => {
        res = res.split('\n');
        const totalBytes = res[28];
        const wired = Number(res[16].split(': ')[1]);
        const active = Number(res[12].split(': ')[1]);
        const inactive = Number(res[13].split(': ')[1]);
        const total = wired + active + inactive;

        $wired.style.width = percentage(wired, totalBytes);
        $active.style.width = percentage(active, totalBytes);
        $inactive.style.width = percentage(inactive, totalBytes);
        $percent.innerHTML = percentage(total, totalBytes, true);

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