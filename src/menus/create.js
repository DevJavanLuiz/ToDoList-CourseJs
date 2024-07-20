import { isCancel, log, text } from "@clack/prompts";
import { taskManager } from "../manager/tasks.js";
import { mainMenu } from "./main.js";
import chalk from "chalk";

export async function createTaskMenu() {
  let name;

  do {
    name = await text({
      message: "Digite o nome da tarefa",
    });
    if (taskManager.tasks.has(name)) {
      log.error(chalk.red("Já existe uma tarefa com esse nome!"));
    }   
  } while (taskManager.tasks.has(name));

  if (isCancel(name)) {
    mainMenu();
    return;
  }

  const task = {
    name,
    status: "Em andamento",
    createdAt: new Date().toISOString() 
  }

  taskManager.create(task);

  log.success(chalk.green("Tarefa criada com sucesso!"));

  setTimeout(()=> mainMenu(), 1000);
}
