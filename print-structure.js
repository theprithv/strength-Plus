const fs = require("fs");
const path = require("path");

const IGNORE = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage"
];

function walk(dir, prefix = "") {
  const items = fs.readdirSync(dir);

  items.forEach((item, index) => {
    if (IGNORE.includes(item)) return;

    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const stats = fs.statSync(fullPath);

    console.log(
      prefix + (isLast ? "└── " : "├── ") + item
    );

    if (stats.isDirectory()) {
      walk(
        fullPath,
        prefix + (isLast ? "    " : "│   ")
      );
    }
  });
}

walk(process.cwd());
