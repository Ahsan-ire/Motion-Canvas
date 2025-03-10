import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
// Import your custom scenes here
import customScene from './scenes/customScene?scene';
import legislativeGap from './scenes/legislativeGap?scene';
import costBenefit from './scenes/costBenefit?scene';
import interventionRates from './scenes/interventionRates?scene';
// import anotherScene from './scenes/anotherScene?scene';

export default makeProject({
  scenes: [
    example,
    // Add your custom scenes here
    customScene,
    legislativeGap,
    costBenefit,
    interventionRates,
    // anotherScene,
  ],
});
