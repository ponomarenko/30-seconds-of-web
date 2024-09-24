export interface TweakPaneParams {
  debug: boolean;
  grayscale: boolean;
  zoom: { min: number, max: number, step: number, value: number };
  circleSize: number;
  theme: string;
  video: MediaTrackConstraints;
  output: { type: string, quality: number };
}
