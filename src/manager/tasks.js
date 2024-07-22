import { existsSync, readFileSync, stat, writeFileSync } from "node:fs";
import path, { parse } from "node:path";
import chalk from "chalk";

const filePath = path.join("./tasks.json");

if (!existsSync(filePath)) {
  writeFileSync(filePath, JSON.stringify([]), "utf8");
}

const data = readFileSync(filePath, { encoding: "utf-8" });
const parsed = JSON.parse(data);

const tasks = new Map(parsed.map((task) => [task.name, task]));

export const taskManager = {
  tasks,
  toArray() {
    return Array.from(tasks.values());
  },
  save() {
    const data = this.toArray();
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  },
  create(task) {
    tasks.set(task.name, task);
    this.save();
  },
  colorStatus(status) {
    switch (status) {
      case "Em andamento": {
        return chalk.bgHex("#FFA500")(` ${status} `);
      }
      case "Concluída": {
        return chalk.bgHex("#84e67f")(` ${status} `);
      }
      case "Cancelada": {
        return chalk.bgRed(` ${status} `);
      }
      default: {
        return chalk.bgWhite(` ${status} `);
      }
    }
  },
};
