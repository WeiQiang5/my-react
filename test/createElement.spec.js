import React from "../core/React";
import { it, expect, describe } from "vitest";
import { TEXT_ELEMENT } from "../core/constant";

describe("createElement", () => {
  it("should return vdom for element", () => {
    const el = React.createElement("div", null, "hello,react");

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello,react",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)

    
  });
});
