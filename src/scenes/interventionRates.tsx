import {makeScene2D} from '@motion-canvas/2d';
import {Rect, Txt, Line, Circle} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {all, waitFor, sequence} from '@motion-canvas/core';
import {easeInOutCubic, easeOutBack} from '@motion-canvas/core';

// Define a consistent color palette
const colors = {
  primary: '#4285F4',
  secondary: '#DB4437',
  accent: '#34A853',
  neutral: '#94a3b8',
  background: '#1e293b',
  text: '#ffffff',
  textSecondary: '#e2e8f0',
  darkAccent: '#334155',
  lightAccent: '#475569',
  success: '#4CAF50',
  warning: '#FBBC05',
  error: '#F44336',
};

export default makeScene2D(function* (view) {
  // Set background color
  view.fill(colors.background);
  
  // Create title and subtitle
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  
  view.add(
    <Txt
      ref={title}
      text="Intervention Rates"
      y={-380}
      opacity={0}
      fontSize={44}
      fontWeight={700}
      fill={colors.text}
      textAlign="center"
    />
  );
  
  view.add(
    <Txt
      ref={subtitle}
      text="Midwife-Led vs Consultant-Led Care"
      y={-330}
      opacity={0}
      fontSize={32}
      fontWeight={600}
      fill={colors.neutral}
      textAlign="center"
    />
  );
  
  // Fade in title and subtitle
  yield* all(
    title().opacity(1, 0.8),
    subtitle().opacity(1, 0.8)
  );
  
  // Create intervention categories and data
  const categories = [
    "Continuous Electronic Fetal Monitoring",
    "Labor Augmentation",
    "Cesarean Section",
    "Episiotomy"
  ];
  
  const mluRates = [36.1, 39.6, 14.8, 11.4]; // percentages
  const cluRates = [56.7, 56.9, 15.2, 12.3]; // percentages
  
  // Create refs for elements
  const categoryRefs = categories.map(() => createRef<Txt>());
  const mluBarRefs = mluRates.map(() => createRef<Rect>());
  const cluBarRefs = cluRates.map(() => createRef<Rect>());
  const mluLabelRefs = mluRates.map(() => createRef<Txt>());
  const cluLabelRefs = cluRates.map(() => createRef<Txt>());
  
  // Position variables
  const startY = -120;
  const barSpacing = 120; // Increased spacing between bars
  
  // Add category background boxes with alternating colors
  categories.forEach((category, i) => {
    view.add(
      <Rect
        width={1000}
        height={80}
        fill={i % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.1)'}
        radius={5}
        y={startY + i * barSpacing}
        opacity={0.8}
      />
    );
  });
  
  // Add category labels
  categories.forEach((category, i) => {
    view.add(
      <Txt
        ref={categoryRefs[i]}
        text={category}
        x={-350} // Moved further left for more space
        y={startY + i * barSpacing}
        opacity={0}
        fontSize={20} // Larger font for better legibility
        width={250} // Fixed width for better alignment
        fontWeight={600}
        fill={colors.text}
        textAlign="right"
      />
    );
  });
  
  // Animate category labels
  for (let i = 0; i < categories.length; i++) {
    yield* categoryRefs[i]().opacity(1, 0.3);
    yield* waitFor(0.1);
  }
  
  // Add MLU and CLU labels at top
  const mluHeaderLabel = createRef<Txt>();
  const cluHeaderLabel = createRef<Txt>();
  const mluHeaderBg = createRef<Rect>();
  const cluHeaderBg = createRef<Rect>();
  
  // Add header backgrounds
  view.add(
    <Rect
      ref={mluHeaderBg}
      width={180}
      height={50}
      fill={`rgba(66, 133, 244, 0.1)`}
      stroke={colors.primary}
      lineWidth={2}
      radius={10}
      x={-100}
      y={startY - 70}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Rect
      ref={cluHeaderBg}
      width={180}
      height={50}
      fill={`rgba(219, 68, 55, 0.1)`}
      stroke={colors.secondary}
      lineWidth={2}
      radius={10}
      x={100}
      y={startY - 70}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  // Add header labels
  view.add(
    <Txt
      ref={mluHeaderLabel}
      text="Midwife-Led Care"
      x={-100}
      y={startY - 70}
      opacity={0}
      fontSize={20}
      fontWeight={700}
      fill={colors.primary}
      textAlign="center"
    />
  );
  
  view.add(
    <Txt
      ref={cluHeaderLabel}
      text="Consultant-Led Care"
      x={100}
      y={startY - 70}
      opacity={0}
      fontSize={20}
      fontWeight={700}
      fill={colors.secondary}
      textAlign="center"
    />
  );
  
  // Fade in headers with animation
  yield* all(
    mluHeaderBg().opacity(1, 0.5),
    cluHeaderBg().opacity(1, 0.5),
    mluHeaderBg().scale(0.95, 0).to(1, 0.5, easeOutBack),
    cluHeaderBg().scale(0.95, 0).to(1, 0.5, easeOutBack)
  );
  
  yield* all(
    mluHeaderLabel().opacity(1, 0.5),
    cluHeaderLabel().opacity(1, 0.5)
  );
  
  // Add and animate bars
  for (let i = 0; i < categories.length; i++) {
    const mluBarWidth = mluRates[i] * 2.5; // Scale for better visualization
    const cluBarWidth = cluRates[i] * 2.5;
    
    // Add bar backgrounds
    view.add(
      <Rect
        height={30}
        width={150}
        fill={`rgba(66, 133, 244, 0.2)`}
        x={-100}
        y={startY + i * barSpacing}
        radius={4}
        opacity={0.8}
      />
    );
    
    view.add(
      <Rect
        height={30}
        width={150}
        fill={`rgba(219, 68, 55, 0.2)`}
        x={100}
        y={startY + i * barSpacing}
        radius={4}
        opacity={0.8}
      />
    );
    
    // Add actual bars
    view.add(
      <Rect
        ref={mluBarRefs[i]}
        height={30}
        width={0}
        fill={colors.primary}
        x={-100 - 75 + mluBarWidth/2} // Centered alignment
        y={startY + i * barSpacing}
        radius={4}
      />
    );
    
    view.add(
      <Rect
        ref={cluBarRefs[i]}
        height={30}
        width={0}
        fill={colors.secondary}
        x={100 - 75 + cluBarWidth/2} // Centered alignment
        y={startY + i * barSpacing}
        radius={4}
      />
    );
    
    // Add percentage labels
    view.add(
      <Txt
        ref={mluLabelRefs[i]}
        text={`${mluRates[i]}%`}
        x={-100 + 90} // Fixed position
        y={startY + i * barSpacing}
        opacity={0}
        fontSize={20}
        fontWeight={700}
        fill={colors.primary}
      />
    );
    
    view.add(
      <Txt
        ref={cluLabelRefs[i]}
        text={`${cluRates[i]}%`}
        x={100 + 90} // Fixed position
        y={startY + i * barSpacing}
        opacity={0}
        fontSize={20}
        fontWeight={700}
        fill={colors.secondary}
      />
    );
    
    // Animate the pair of bars
    yield* all(
      mluBarRefs[i]().width(mluBarWidth, 0.8, easeInOutCubic),
      cluBarRefs[i]().width(cluBarWidth, 0.8, easeInOutCubic)
    );
    
    yield* all(
      mluLabelRefs[i]().opacity(1, 0.3),
      cluLabelRefs[i]().opacity(1, 0.3)
    );
    
    yield* waitFor(0.2);
  }
  
  // Add difference highlights for significant differences
  const diffBox1 = createRef<Rect>();
  const diffBox2 = createRef<Rect>();
  const diffLabel1 = createRef<Txt>();
  const diffLabel2 = createRef<Txt>();
  
  // EFM difference
  view.add(
    <Rect
      ref={diffBox1}
      width={200}
      height={40}
      fill={`rgba(52, 168, 83, 0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={0}
      y={startY - 30}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt
      ref={diffLabel1}
      text="20.6% difference"
      x={0}
      y={startY - 30}
      opacity={0}
      fontSize={18}
      fontWeight={700}
      fill={colors.accent}
      textAlign="center"
    />
  );
  
  // Augmentation difference
  view.add(
    <Rect
      ref={diffBox2}
      width={200}
      height={40}
      fill={`rgba(52, 168, 83, 0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={0}
      y={startY + barSpacing - 30}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt
      ref={diffLabel2}
      text="17.3% difference"
      x={0}
      y={startY + barSpacing - 30}
      opacity={0}
      fontSize={18}
      fontWeight={700}
      fill={colors.accent}
      textAlign="center"
    />
  );
  
  // Animate difference indicators
  yield* waitFor(0.5);
  
  yield* all(
    diffBox1().opacity(1, 0.5),
    diffBox1().scale(0.9, 0).to(1, 0.5, easeOutBack),
    diffLabel1().opacity(1, 0.5)
  );
  
  yield* waitFor(0.3);
  
  yield* all(
    diffBox2().opacity(1, 0.5),
    diffBox2().scale(0.9, 0).to(1, 0.5, easeOutBack),
    diffLabel2().opacity(1, 0.5)
  );
  
  // Add conclusion
  const conclusionBox = createRef<Rect>();
  const conclusion = createRef<Txt>();
  
  view.add(
    <Rect
      ref={conclusionBox}
      width={900}
      height={100}
      fill={`rgba(52, 168, 83, 0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={15}
      y={350}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.3)'}
      shadowBlur={15}
      shadowOffset={[0, 3]}
    />
  );
  
  view.add(
    <Txt
      ref={conclusion}
      text="Midwife-led care significantly reduces unnecessary interventions while maintaining comparable safety outcomes"
      y={350}
      opacity={0}
      fontSize={26}
      fontWeight={600}
      fill={colors.text}
      textAlign="center"
      width={850}
    />
  );
  
  yield* waitFor(0.5);
  yield* all(
    conclusionBox().opacity(1, 0.8),
    conclusionBox().scale(0.95, 0).to(1, 0.5, easeOutBack),
    conclusion().opacity(1, 1)
  );
  
  yield* waitFor(2);
}); 