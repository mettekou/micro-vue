function App() {
  this.data = reactive({ count: 0 });
}

App.prototype = Object.assign({}, Object.prototype);

App.prototype.render = function () {
  var self = this;
  return h("div", undefined, [
    h(
      "button",
      {
        onClick: function onClick() {
          ++self.data.count;
        },
      },
      "+"
    ),
    h("span", undefined, String(this.data.count)),
    h(
      "button",
      {
        onClick: function onClick() {
          --self.data.count;
        },
      },
      "-"
    ),
  ]);
};

mountApp(new App(), document.getElementById("app"));
