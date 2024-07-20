import { log, select, isCancel } from "@clack/prompts";
import { taskManager } from "../manager/tasks.js";
import { mainMenu } from "./main.js";
import chalk from "chalk";
import { updateTaskMenu } from "./update.js";

export async function listTaskMenu() {
  if (taskManager.tasks.size < 1) {
    log.warn(chalk.yellow("Nenhuma tarefa para ser listada."));
    setTimeout(() => mainMenu(), 1000);
    return;
  }

  const selected = await select({
    message: "Selecione uma tarefa",
    options: [
      ...taskManager.toArray().map(({ name, status }) => ({
        label: `${taskManager.coloStatus(status)} ${chalk.white.underline(
          name
        )}`,
        value: name,
      })),
      { label: "Menu principal", value: "main" },
    ],
  });
  if (isCancel(selected) || selected === "main") {
    mainMenu();
    return;
  }

updateTaskMenu(selected)
}
