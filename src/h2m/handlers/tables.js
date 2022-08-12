import { h, html } from "../h.js";

export const tables = [
  [{ is: "caption" }, (node, t) => t(node)],

  [
    {
      is: "table",
      canHave: ["style", "dir", "lang"],
      canHaveClass: [
        "standard-table",
        "fullwidth-table",
        "full-width-table",
        "properties",
        "nostripe",
      ],
    },
    (node, t) => {
      const children = node.children
        .flatMap((node) =>
          node.type == "element" &&
          typeof node.tagName == "string" &&
          ["thead", "tbody", "tfoot"].includes(node.tagName)
            ? node.children
            : node
        )
        .filter((node) => node.tagName == "tr")
        .flatMap((node, i) => t([node], { rowIndex: i }));

      if (children.some((c) => c.type === "html")) {
        return html(node);
      }

      return h("table", children);
    },
  ],

  [
    { is: "tr", canHave: ["id", "scope", "style", "dir", "lang"] },
    (node, t) => {
      const children = t(node.children);
      return children.some((c) => c.type === "html")
        ? html(node)
        : h("tableRow", children);
    },
  ],

  [
    {
      is: ["th", "td"],
      canHave: ["id", "scope", "style", "dir", "lang", "rowSpan", "colSpan"],
      canHaveClass: ["header"],
    },
    (node, t) => {
      const { colSpan, rowSpan } = node.properties;
      if (colSpan > 1 || rowSpan > 1) {
        return html(node);
      }
      return h("tableCell", t(node, { shouldWrap: true }));
    },
  ],
];
