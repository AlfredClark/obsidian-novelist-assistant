import { ObsidianPlugin } from "./types";
import { Command, Modal } from "obsidian";

export async function removeCommands(plugin: ObsidianPlugin) {
  plugin.commandsIds.forEach((id: string) => {
    plugin.removeCommand(id);
  });
  plugin.commandsIds = [];
}

export async function registerCommands(plugin: ObsidianPlugin) {
  const commands: Command[] = [
    {
      id: "open-modal-simple",
      name: "Open modal (simple)",
      callback: () => {
        new Modal(plugin.app).setTitle("Open modal").setContent("Open modal (simple)").open();
      },
    },
  ];
  plugin.commandsIds = [];
  commands.forEach((command) => {
    plugin.commandsIds.push(plugin.addCommand(command).id);
  });
}
