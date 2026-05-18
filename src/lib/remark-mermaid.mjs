const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
};

function escapeHtml(value) {
  return value.replace(/[&<>]/g, (char) => htmlEscapes[char]);
}

function walk(node) {
  if (!node || typeof node !== "object") return;

  if (node.type === "code" && node.lang === "mermaid") {
    node.type = "html";
    node.value = `<pre class="mermaid">${escapeHtml(node.value)}</pre>`;
    delete node.lang;
    delete node.meta;
    return;
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child);
  }
}

export function remarkMermaid() {
  return (tree) => walk(tree);
}
