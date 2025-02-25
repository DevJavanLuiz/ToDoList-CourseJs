import { isCancel, log, select, text } from "@clack/prompts";
import chalk from "chalk";
import { mainMenu } from "./main.js";
import { listTaskMenu } from "./list.js";
import { taskManager } from "../manager/tasks.js";

export async function updateTaskMenu(taskName) {
  const task = taskManager.tasks.get(taskName);
  const formatedDate = new Date(task.createdAt).toLocaleString();
  const status = taskManager.colorStatus(task.status);

  log.info(
    [
      `Tarefa: ${task.name}`,
      `Status: ${status}`,
      `Data de criação: ${chalk.bgGray(formatedDate)}`,
    ].join("\n")
  );

  const selected = await select({
    message: "Selecione o que deseja fazer",
    options: [
      { label: "Alterar nome", value: "name" },
      { label: "Alterar status", value: "status" },
      { label: "Deletar", value: "delete" },
      { label: "Voltar", value: "back" },
    ],
  });

  if (isCancel(selected)) {
    listTaskMenu();
  }

  switch (selected) {
    case "delete": {
      taskManager.tasks.delete(taskName);
      log.success(chalk.green("Mensagem deletada com sucesso!"));
      taskManager.save();
      setTimeout(() => {
        mainMenu();
      }, 1000);
      return;
    }

    case "back": {
      listTaskMenu();
      return;
    }

    case "name": {
      const newTaskName = await text({
        message: "Digite o novo nome da tarefa",
        validate(input) {
          if (taskManager.tasks.has(input)) {
            return "Já existe uma tarefa com este nome";
          }
        },
      });

      if (isCancel(newTaskName)) {
        updateTaskMenu(oldTaskName);
        return;
      }
      const oldTaskName = task.name;

      taskManager.tasks.delete(oldTaskName);

      const updatedTask = { ...task, name: newTaskName };
      taskManager.tasks.set(newTaskName, updatedTask);
      taskManager.save();
      updateTaskMenu(newTaskName);
      return
    }
    case "status": {
      const taskStatus = ["Em andamento", "Concluída", "Cancelada"];
      const options = taskStatus
        .filter((status) => status !== task.status)
        .map((status) => ({ label: status, value: status }));

      const status = await select({
        message: "Selecione o novo status da tarefa",
        options,
      });
      if (isCancel(status)) {
        updateTaskMenu(taskName);
        return;
      }

      taskManager.tasks.set(taskName, { ...task, status });
      taskManager.save();
      updateTaskMenu(taskName);
      return;
    }
  }
}
