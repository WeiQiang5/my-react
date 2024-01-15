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
      children: children.map((child) =>{
        const isTextNode = ["string","number"].includes(typeof child)
        return isTextNode ? createTextNode(child) : child
      }
        
      ),
    },
  };
}

export function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // 记录根节点
  root = nextWorkOfUnit;
}
let nextWorkOfUnit = null,
  root = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && root) {
    commitRoot();
    root = null;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(root.child);
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent
  while(!fiberParent.dom){
    fiberParent = fiberParent.parent
  }

  if(fiber.dom){
    fiberParent.dom.append(fiber.dom);
  }

  
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function initChildren(fiber,children) {
  // 形成链表结构
  let prevChild = null;
  
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function createDom(type) {
  return type === TEXT_ELEMENT
    ? document.createTextNode("")
    : document.createElement(type);
}
function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key === "children") return;
    dom[key] = props[key];
  });
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type));
      console.log("dom", dom);

      // fiber.parent.dom.append(dom);

      updateProps(dom, fiber.props);
    }
  }
  const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children
  initChildren(fiber,children);

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while(nextFiber){
    if(nextFiber.sibling){
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent
  }
}

const React = {
  render,
  createElement,
};

export default React;
