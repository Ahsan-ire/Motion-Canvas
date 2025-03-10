import {makeScene2D} from '@motion-canvas/2d';
import {createRef, waitFor, all} from '@motion-canvas/core';
import {Rect, Txt} from '@motion-canvas/2d';
import {colors} from '../theme';

// Define a consistent color palette
// const colors = {
//   primary: '#4285F4',
//   secondary: '#DB4437',
//   accent: '#34A853',
//   neutral: '#94a3b8',
//   background: '#1e293b',
//   text: '#ffffff',
//   textSecondary: '#e2e8f0',
//   darkAccent: '#334155',
//   lightAccent: '#475569',
// };

export default makeScene2D(function* (view) {
  // Set background color
  view.fill(colors.background);
  
  // Create references for elements
  const policyBriefRef = createRef<Txt>();
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();
  const mainBoxRef = createRef<Rect>();
  const subtitleBoxRef = createRef<Rect>();

  // Add main title box with subtle animation
  view.add(
    <Rect
      ref={mainBoxRef}
      width={800}
      height={250}
      fill={colors.darkBackground}
      radius={20}
      y={-120}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.2)'}
      shadowBlur={20}
      shadowOffset={[0, 5]}
    />
  );
  
  // Add policy brief text
  view.add(
    <Txt
      ref={policyBriefRef}
      text="POLICY BRIEF"
      fontSize={28}
      fontWeight={600}
      fill={colors.accent}
      y={-200}
      opacity={0}
    />
  );
  
  // Add main title
  view.add(
    <Txt
      ref={titleRef}
      text="Crógacht Agus Ciúnas"
      fontSize={56}
      fontWeight={800}
      fill={colors.text}
      y={-120}
      opacity={0}
    />
  );
  
  // Add subtitle box
  view.add(
    <Rect
      ref={subtitleBoxRef}
      width={900}
      height={160}
      fill={colors.neutral}
      radius={15}
      y={120}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.15)'}
      shadowBlur={15}
      shadowOffset={[0, 3]}
    />
  );
  
  // Add subtitle text
  view.add(
    <Txt
      ref={subtitleRef}
      text="The Bravery of Pregnant Persons in a Legislative Framework
      That Remains Silent on the Issue of Obstetric Violence"
      fontSize={32}
      fontWeight={600}
      fill={colors.text}
      textAlign="center"
      y={120}
      width={860}
      opacity={0}
    />
  );

  // Create animations with better timing and flow
  // Fade in the main box with subtle movement
  yield* all(
    mainBoxRef().opacity(1, 0.8),
    mainBoxRef().position.y(-110, 1.2)
  );
  
  // Fade in the policy brief text with slight movement
  yield* all(
    policyBriefRef().opacity(1, 0.6),
    policyBriefRef().position.y(-190, 0.8)
  );
  
  // Fade in the title with scale animation
  yield* all(
    titleRef().opacity(1, 0.8),
    titleRef().scale(0.9, 0).to(1, 0.7)
  );
  
  // Fade in the subtitle box with movement
  yield* all(
    subtitleBoxRef().opacity(1, 0.7),
    subtitleBoxRef().position.y(130, 1)
  );
  
  // Fade in the subtitle text
  yield* subtitleRef().opacity(1, 0.8);
  
  // Add some animation to the title
  yield* titleRef().scale(1.05, 1.2).to(1, 1);
  
  // Wait before ending
  yield* waitFor(2);
}); 