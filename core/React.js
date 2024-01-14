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
  nextWorkOfUnit = {
    dom:container,
    props:{
      children:[el]
    }
  };
  
}
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function initChildren(work){
  // 形成链表结构
  let prevChild = null;
  const children = work.props.children;
  children.forEach((child,index) =>{

    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    }
    
    if (index === 0) {
      work.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }
    prevChild = newWork;
  })
}

function createDom(type){
  return type === TEXT_ELEMENT
  ? document.createTextNode("")
  : document.createElement(type)
}
function updateProps(dom,props){
  Object.keys(props).forEach((key) => {
    if (key === "children") return;
    dom[key] = props[key];
  });
}

function performWorkOfUnit(work) {
  console.log(work);
  if(!work.dom){
    const dom = (work.dom =createDom(work.type))
    console.log('dom', dom);
      
    work.parent.dom.append(dom);

    updateProps(dom,work.props)
  }
  

  initChildren(work)
  

  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }
  return work.parent?.sibling;
}

const React = {
  render,
  createElement,
};

export default React;
