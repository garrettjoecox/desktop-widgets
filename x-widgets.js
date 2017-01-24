
const config = require('./config');
const parse = require('parse-duration');

config.forEach(o => {
  try { require.resolve(o.widget); } catch(e) { console.error(e); return; }
  const widget = require(o.widget);
  const container = document.createElement('div');
  const shadow = container.createShadowRoot();
  const position = document.createElement('style');
  const style = document.createElement('style');
  const element = document.createElement('div');

  shadow.appendChild(position);
  shadow.appendChild(style);
  shadow.appendChild(element);
  position.innerHTML = o.position;
  style.innerHTML = widget.style;
  element.innerHTML = widget.innerHTML;
  document.body.appendChild(container);

  const context = {
    element: element,
    config: Object.assign(widget.config, o.config),
    get style() { return style.innerHTML; },
    set style(v) { style.innerHTML = v; }
  };

  widget.render.call(context);

  if (context.config.refresh) {
    let time;
    if (typeof context.config.refresh === 'number') {
      time = context.config.refresh;
    } else {
      try {
        time = parse(context.config.refresh);
      } catch(e) {}
    }
    if (time) setInterval(() => widget.render.call(context), time);
  }
});