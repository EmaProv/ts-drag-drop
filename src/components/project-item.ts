import { Component } from "./base-component.js";
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import { autobind } from "../decorators/autobind.js";

/* ProjItem Class */
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private proj: Project;

  get persons() {
    if (this.proj.people === 1) {
      return "1 person";
    } else {
      return `${this.proj.people} persons`;
    }
  }

  constructor(hostId: string, proj: Project) {
    super("single-project", hostId, false, proj.id);
    this.proj = proj;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData("text/plain", this.proj.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent): void {
    console.log("DRAG END");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.proj.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.proj.desc;
  }
}
