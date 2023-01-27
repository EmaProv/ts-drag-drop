import { Component } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
import { DragTarget } from "../models/drag-drop.js";
import { projState } from "../state/proj-state.js";
import { Project, ProjStatus } from "../models/project.js";
import { ProjectItem } from "./project-item.js";

/* ProjList Class */
export class PorjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProj: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProj = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();

      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projState.moveProject(
      prjId,
      this.type === "active" ? ProjStatus.Active : ProjStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projState.addListener((projects: Project[]) => {
      const relevantProject = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjStatus.Active;
        }
        return prj.status === ProjStatus.Finished;
      });

      this.assignedProj = relevantProject;
      this.renderProj();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderProj() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    listEl.innerHTML = "";

    for (const porjItem of this.assignedProj) {
      new ProjectItem(this.element.querySelector("ul")!.id, porjItem);
    }
  }
}
