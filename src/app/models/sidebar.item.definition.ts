export class SidebarItemDefinition {
  path: string;
  label: string;
  component: any;

  constructor(path: string, label: string, component: any) {
    this.path = path;
    this.label = label;
    this.component = component;
  }
}
