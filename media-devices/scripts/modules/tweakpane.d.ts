export interface TweakPane {
  refresh: () => void;
  addBinding: (...params) => any;
  addBlade: (...params) => any;
  addFolder: (...params) => any;
  addButton: (...params) => any;
  on: (...params) => void;
}
