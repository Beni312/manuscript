export class SidebarItemDefinition {
  path: string;
  label: string;
  component: any;
  icon: string;

  constructor(path: string, label: string, component: any, icon: string) {
    this.path = path;
    this.label = label;
    this.component = component;
    this.icon = icon;
  }
}
