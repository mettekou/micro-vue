var activeEffect;
var targetMap = new WeakMap();

function Dep(value) {
  this.effects = new Set();
  this.value = value;
}

Dep.prototype = Object.assign({}, Object.prototype);

Dep.prototype.depend = function () {
  if (activeEffect) {
    this.effects.add(activeEffect);
  }
};

Dep.prototype.notify = function () {
  this.effects.forEach(function (effect) {
    effect();
  });
};

function getDep(target, key) {
  var depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  var dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

var reactiveHandlers = {
  get(target, key, receiver) {
    var dep = getDep(target, key);
    dep.depend();
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    var dep = getDep(target, key);
    var result = Reflect.set(target, key, value, receiver);
    dep.notify();
    return result;
  },
};

function reactive(raw) {
  return new Proxy(raw, reactiveHandlers);
}

function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = undefined;
}
