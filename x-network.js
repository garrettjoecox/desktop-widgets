
module.exports = {
  style: `
    :host {
      color: rgba(255,255,255,0.8);
      font-family: Helvetica Neue;
    }
    table {
      border-collapse: collapse;
      table-layout: fixed;
    }
    table:after {
      content: 'network throughput';
      position: absolute;
      left: 0;
      top: -14px;
      font-size: 10px;
    }
    td {
      border: 1px solid rgba(255,255,255,0.5);
      font-size: 24px;
      font-weight: 100;
      width: 182px;
      max-width: 182px;
      height: 48px;
      overflow: hidden;
      text-shadow: 0 0 1px rgba(#000, 0.5);
    }
    .wrapper {
      padding: 4px 6px 4px 6px;
      position: relative;
    }
    .label {
      position: absolute;
      top: 1px;
      right: 8px;
      font-size: 10px;
      font-weight: normal;
    }
    .col1 {
      background: rgba(#f00, 0.4);
    }
    .col2 {
      background: rgba(#0ff, 0.4);
    }
    .hidden {
      display: none;
    }
  `,
  config: {
    refresh: `5s`
  },
  render() {
    this.element.innerHTML = `
      <table>
        <tr>
          <td class='col1'><div class='wrapper'>0.0 B/s<div class='label'>IN</div></div></td>
          <td class='col2'><div class='wrapper'>0.0 B/s<div class='label'>OUT</div></div></td>
        </tr>
      </table>
    `;
    const inTd = this.element.querySelector('.col1');
    const outTd = this.element.querySelector('.col2');
    exec(`sar -n DEV 1 1 | grep en0 | tail -n1 | awk '{print $4,$6}'`)
      .then(s => {
        const result = s.split(' ');
        inTd.innerHTML = calcBytes(result[0], 'IN');
        outTd.innerHTML = calcBytes(result[1], 'OUT');
      })
      .catch(e => console.log(e));
  }
};

function calcBytes(bytes, type) {
  bytes = Number(bytes);
  let units = ['B'];
  let u = 0;
  let thresh = 1000;

  if (bytes < thresh) {
    units = ['B'];
    u = 0;
  } else {
    units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    u = -1;
    while (true) {
      bytes /= thresh;
      ++u;
      if (bytes <= thresh) break;
    }
  }

  return `
    <div class="wrapper">
      ${bytes.toFixed(1)} ${units[u]}/s
      <div class="label">${type}</div>
    </div>
  `;
}

function exec(...args) {
  return new Promise((resolve, reject) => {
    require('child_process').exec(...args, (err, stdout, stderr) => {
      if (err) reject(err);
      else if (stderr) reject(stderr);
      else resolve(stdout);
    });
  });
}