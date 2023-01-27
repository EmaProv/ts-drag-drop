import { Project, ProjStatus } from "../models/project.js";

/* Peoject State Management */
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, desc: string, numberOfPeople: number) {
    const newProj = new Project(
      Math.random().toString(),
      title,
      desc,
      numberOfPeople,
      ProjStatus.Active
    );

    this.projects.push(newProj);
    this.updListeners();
  }

  moveProject(id: string, newStatus: ProjStatus) {
    const project = this.projects.find((prj) => prj.id === id);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updListeners();
    }
  }

  private updListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const projState = ProjectState.getInstance();
