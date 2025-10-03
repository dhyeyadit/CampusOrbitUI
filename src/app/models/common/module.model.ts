export interface Module {
  moduleId: string;
  name: string;
  displayName: string;
  cssIcon: string;
  routes: Route[];
}

export interface Route {
  path: string;
  displayName: string;
}