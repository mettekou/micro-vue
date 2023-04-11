function h(tag, props, children) {
  return { tag: tag, props: props, children: children, element: undefined };
}

function mount(vnode, container) {
  var element = document.createElement(vnode.tag);

  if (vnode.props) {
    for (var key in vnode.props) {
      var value = vnode.props[key];
      if (key.startsWith("on")) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  if (vnode.children) {
    if (typeof vnode.children === "string") {
      element.textContent = vnode.children;
    } else {
      vnode.children.forEach(function (child) {
        mount(child, element);
      });
    }
  }
  vnode.element = element;
  container.appendChild(element);
}

function patch(vnode1, vnode2) {
  var element = vnode2.element || vnode1.element;
  if (vnode1.tag === vnode2.tag) {
    vnode2.element = element;
    var oldProps = vnode1.props || {};
    var newProps = vnode2.props || {};

    for (var key in newProps) {
      var oldValue = oldProps[key];
      var newValue = newProps[key];
      if (newValue !== oldValue) {
        element.setAttribute(key, newValue);
      }
    }
    for (var key in oldProps) {
      if (!(key in newProps)) {
        element.removeAttribute(key);
      }
    }
    var oldChildren = vnode1.children;
    var newChildren = vnode2.children;
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          element.textContent = newChildren;
        }
      } else {
        element.textContent = newChildren;
      }
    } else {
      if (typeof oldChildren === "string") {
        element.innerHTML = "";
        newChildren.forEach(function (child) {
          mount(child, element);
        });
      } else {
        var minimumLength = Math.min(oldChildren.length, newChildren.length);
        for (var index = 0; index < minimumLength; ++index) {
          patch(oldChildren[index], newChildren[index]);
        }
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach(function (child) {
            mount(child, element);
          });
        } else if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildren.length).forEach(function (child) {
            element.removeChild(child.element);
          });
        }
      }
    }
  } else {
  }
}

function mountApp(component, container) {
  var isMounted = false;
  var previousVdom;
  watchEffect(function () {
    if (!isMounted) {
      previousVdom = component.render();
      mount(previousVdom, container);
      isMounted = true;
    } else {
      var newVdom = component.render();
      patch(previousVdom, newVdom);
      previousVdom = newVdom;
    }
  });
}
