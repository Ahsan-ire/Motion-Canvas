import {makeProject} from '@motion-canvas/core';

// Import your custom scenes here
import customScene from './scenes/customScene?scene';
import legislativeGap from './scenes/legislativeGap?scene';
import costBenefit from './scenes/costBenefit?scene';
import interventionRates from './scenes/interventionRates?scene';
// import anotherScene from './scenes/anotherScene?scene';

// Create project with scenes as separate entities
export default makeProject({
  name: 'Main Project',
  scenes: [
    customScene,
    legislativeGap,
    costBenefit,
    interventionRates,
  ],
});
