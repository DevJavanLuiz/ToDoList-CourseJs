import { isCancel, outro, select } from "@clack/prompts";
import chalk from "chalk";
import { createTaskMenu } from "./create.js";
import { listTaskMenu} from "./list.js";

export async function mainMenu() {
  const opiton = await select({
    message: "Escolha o que deseja fazer",
    options: [
      { label: "Criar nova tarefa", value: "create" },
      { label: "Listar tarefas", value: "list" },
      { label: "Sair", value: "end" },
    ],
  });
  if (isCancel(opiton)) return;

  switch (opiton) {
    case "create": {
      createTaskMenu();
      return;
    }
    case "list": {
      listTaskMenu();
      return;
    }
    default: {
      outro(chalk.red("Fim do programa!"));
    }
  }
}
 