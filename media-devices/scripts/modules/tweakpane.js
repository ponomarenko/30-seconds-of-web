/**
 * https://tweakpane.github.io/docs/
 */
import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js';

/**
 * @typedef { import("./tweakpane").TweakPane } TweakPane
 */

/**
 * @returns {TweakPane}
 */
export function createPane() {
  return new Pane({
    title: 'Config',
    expanded: true,
  });
}
