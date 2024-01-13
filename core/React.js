import { TEXT_ELEMENT } from "./constant.js";

// 创建文本节点
export function createTextNode(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
}

export function render(el, container) {
  const dom =
    el.type === TEXT_ELEMENT
      ? document.createTextNode("")
      : document.createElement(el.type);

  Object.keys(el.props).forEach((key) => {
    if (key === "children") return;
    dom[key] = el.props[key];
  });


  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });

  container.append(dom);
}

const React = {
  render,
  createElement,
};

export default React;
