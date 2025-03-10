import {Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {colors} from '../theme';

export default makeScene2D(function* (view) {
  // Create your animations here
  view.fill(colors.background);

  const circle = createRef<Circle>();

  view.add(<Circle ref={circle} size={320} fill={colors.primary} />);

  yield* circle().scale(2, 2).to(1, 2);
});
