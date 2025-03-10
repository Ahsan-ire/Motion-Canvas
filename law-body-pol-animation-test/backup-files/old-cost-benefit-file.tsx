import {makeScene2D} from '@motion-canvas/2d';
import {Rect, Txt, Line, Circle} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {all, waitFor, sequence} from '@motion-canvas/core';
import {easeInOutCubic, easeInOutQuad, easeOutBack} from '@motion-canvas/core';

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
      text="Cost-Benefit Analysis"
      y={-280}
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
      y={-230}
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
  
  // Create cost comparison section
  const costTitle = createRef<Txt>();
  const costTitleBg = createRef<Rect>();
  
  view.add(
    <Rect
      ref={costTitleBg}
      width={300}
      height={50}
      fill={colors.darkAccent}
      radius={25}
      y={-150}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt
      ref={costTitle}
      text="Cost Comparison"
      y={-150}
      opacity={0}
      fontSize={30}
      fontWeight={600}
      fill={colors.text}
      textAlign="center"
    />
  );
  
  yield* all(
    costTitleBg().opacity(1, 0.8),
    costTitle().opacity(1, 0.8)
  );
  
  // Create bars for cost comparison
  const mluBar = createRef<Rect>();
  const cluBar = createRef<Rect>();
  const mluLabel = createRef<Txt>();
  const cluLabel = createRef<Txt>();
  const mluCost = createRef<Txt>();
  const cluCost = createRef<Txt>();
  
  // Scale factor for better visualization
  const scaleFactor = 0.2;
  const mluHeight = 1018.47 * scaleFactor;
  const cluHeight = 1762.12 * scaleFactor;
  
  // Add background containers for better visual separation
  const mluContainer = createRef<Rect>();
  const cluContainer = createRef<Rect>();
  
  view.add(
    <Rect
      ref={mluContainer}
      width={180}
      height={250}
      fill={`rgba(66, 133, 244, 0.1)`}
      stroke={colors.primary}
      lineWidth={2}
      radius={10}
      x={-200}
      y={-50}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Rect
      ref={cluContainer}
      width={180}
      height={250}
      fill={`rgba(219, 68, 55, 0.1)`}
      stroke={colors.secondary}
      lineWidth={2}
      radius={10}
      x={200}
      y={-50}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  // Fade in containers with subtle animation
  yield* all(
    mluContainer().opacity(1, 0.8),
    cluContainer().opacity(1, 0.8),
    mluContainer().scale(0.95, 0).to(1, 0.5, easeOutBack),
    cluContainer().scale(0.95, 0).to(1, 0.5, easeOutBack)
  );
  
  // Add cost bars
  view.add(
    <Rect
      ref={mluBar}
      width={120}
      height={0}
      fill={colors.primary}
      x={-200}
      y={-50}
      radius={5}
    />
  );
  
  view.add(
    <Rect
      ref={cluBar}
      width={120}
      height={0}
      fill={colors.secondary}
      x={200}
      y={-50}
      radius={5}
    />
  );
  
  // Add labels
  view.add(
    <Txt
      ref={mluLabel}
      text="Midwife-Led Care"
      x={-200}
      y={50}
      opacity={0}
      fontSize={24}
      fontWeight={600}
      fill={colors.primary}
      textAlign="center"
    />
  );
  
  view.add(
    <Txt
      ref={cluLabel}
      text="Consultant-Led Care"
      x={200}
      y={50}
      opacity={0}
      fontSize={24}
      fontWeight={600}
      fill={colors.secondary}
      textAlign="center"
    />
  );
  
  // Add cost labels
  view.add(
    <Txt
      ref={mluCost}
      text="€1,018.47"
      x={-200}
      y={-50 - mluHeight/2 - 30}
      opacity={0}
      fontSize={28}
      fontWeight={700}
      fill={colors.primary}
      textAlign="center"
    />
  );
  
  view.add(
    <Txt
      ref={cluCost}
      text="€1,762.12"
      x={200}
      y={-50 - cluHeight/2 - 30}
      opacity={0}
      fontSize={28}
      fontWeight={700}
      fill={colors.secondary}
      textAlign="center"
    />
  );
  
  // Animate labels appearing
  yield* all(
    mluLabel().opacity(1, 0.5),
    cluLabel().opacity(1, 0.5)
  );
  
  // Animate bars growing
  yield* all(
    mluBar().height(mluHeight, 1.5, easeInOutQuad),
    mluBar().position.y(-50 - mluHeight/2, 1.5, easeInOutQuad),
    cluBar().height(cluHeight, 1.5, easeInOutQuad),
    cluBar().position.y(-50 - cluHeight/2, 1.5, easeInOutQuad)
  );
  
  // Show costs
  yield* all(
    mluCost().opacity(1, 0.5),
    cluCost().opacity(1, 0.5)
  );
  
  // Create cost difference visualization
  const diffRect = createRef<Rect>();
  const diffLabel = createRef<Txt>();
  const diffArrow = createRef<Line>();
  const diffArrow2 = createRef<Line>();
  
  const yMlu = -50 - mluHeight;
  const yClu = -50 - cluHeight;
  const diffY = (yMlu + yClu) / 2 - 40;
  
  // Add difference box
  view.add(
    <Rect
      ref={diffRect}
      width={220}
      height={50}
      fill={`rgba(52, 168, 83, 0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={0}
      y={diffY}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  // Add difference label
  view.add(
    <Txt
      ref={diffLabel}
      text="€743.65 Difference"
      x={0}
      y={diffY}
      opacity={0}
      fontSize={26}
      fontWeight={700}
      fill={colors.accent}
      textAlign="center"
    />
  );
  
  // Add arrows connecting difference to bars
  view.add(
    <Line
      ref={diffArrow}
      points={[
        [-110, diffY], // Left side of diff rectangle
        [-110, diffY + 20], // Down a bit
        [-200, yMlu - 10] // To top of MLU bar
      ]}
      stroke={colors.accent}
      lineWidth={3}
      endArrow={true}
      arrowSize={12}
      opacity={0}
    />
  );
  
  view.add(
    <Line
      ref={diffArrow2}
      points={[
        [110, diffY], // Right side of diff rectangle
        [110, diffY + 20], // Down a bit
        [200, yClu - 10] // To top of CLU bar
      ]}
      stroke={colors.accent}
      lineWidth={3}
      endArrow={true}
      arrowSize={12}
      opacity={0}
    />
  );
  
  yield* waitFor(0.5);
  yield* diffRect().opacity(1, 0.8);
  yield* diffLabel().opacity(1, 0.8);
  yield* all(
    diffArrow().opacity(1, 0.8),
    diffArrow2().opacity(1, 0.8)
  );
  
  // Create net benefit section
  const netBenefitTitle = createRef<Txt>();
  const netBenefitTitleBg = createRef<Rect>();
  
  view.add(
    <Rect
      ref={netBenefitTitleBg}
      width={350}
      height={50}
      fill={colors.darkAccent}
      radius={25}
      y={150}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt
      ref={netBenefitTitle}
      text="Net Benefit Comparison"
      y={150}
      opacity={0}
      fontSize={30}
      fontWeight={600}
      fill={colors.text}
      textAlign="center"
    />
  );
  
  yield* waitFor(0.5);
  yield* all(
    netBenefitTitleBg().opacity(1, 0.8),
    netBenefitTitle().opacity(1, 0.8)
  );
  
  // Add background containers for net benefit
  const mluNetBenefitContainer = createRef<Rect>();
  const cluNetBenefitContainer = createRef<Rect>();
  
  view.add(
    <Rect
      ref={mluNetBenefitContainer}
      width={180}
      height={250}
      fill={`rgba(52, 168, 83, 0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={-200}
      y={250}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Rect
      ref={cluNetBenefitContainer}
      width={180}
      height={250}
      fill={`rgba(251, 188, 5, 0.1)`}
      stroke={colors.warning}
      lineWidth={2}
      radius={10}
      x={200}
      y={250}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  // Fade in net benefit containers
  yield* all(
    mluNetBenefitContainer().opacity(1, 0.8),
    cluNetBenefitContainer().opacity(1, 0.8),
    mluNetBenefitContainer().scale(0.95, 0).to(1, 0.5, easeOutBack),
    cluNetBenefitContainer().scale(0.95, 0).to(1, 0.5, easeOutBack)
  );
  
  // Create net benefit bars
  const mluNetBenefitBar = createRef<Rect>();
  const cluNetBenefitBar = createRef<Rect>();
  const mluNetBenefitLabel = createRef<Txt>();
  const cluNetBenefitLabel = createRef<Txt>();
  
  // Scale for better visualization
  const nbScaleFactor = 0.1;
  const mluNetBenefitHeight = 1491.22 * nbScaleFactor;
  const cluNetBenefitHeight = 123.23 * nbScaleFactor;
  
  view.add(
    <Rect
      ref={mluNetBenefitBar}
      width={120}
      height={0}
      fill={colors.accent}
      x={-200}
      y={250}
      radius={5}
    />
  );
  
  view.add(
    <Rect
      ref={cluNetBenefitBar}
      width={120}
      height={0}
      fill={colors.warning}
      x={200}
      y={250}
      radius={5}
    />
  );
  
  // Add net benefit labels
  view.add(
    <Txt
      ref={mluNetBenefitLabel}
      text="€1,491.22"
      x={-200}
      y={250 - mluNetBenefitHeight/2 - 30}
      opacity={0}
      fontSize={28}
      fontWeight={700}
      fill={colors.accent}
      textAlign="center"
    />
  );
  
  view.add(
    <Txt
      ref={cluNetBenefitLabel}
      text="€123.23"
      x={200}
      y={250 - cluNetBenefitHeight/2 - 30}
      opacity={0}
      fontSize={28}
      fontWeight={700}
      fill={colors.warning}
      textAlign="center"
    />
  );
  
  // Add care type labels for net benefit
  view.add(
    <Txt
      text="Midwife-Led Care"
      x={-200}
      y={350}
      opacity={1}
      fontSize={24}
      fontWeight={600}
      fill={colors.accent}
      textAlign="center"
    />
  );
  
  view.add(
    <Txt
      text="Consultant-Led Care"
      x={200}
      y={350}
      opacity={1}
      fontSize={24}
      fontWeight={600}
      fill={colors.warning}
      textAlign="center"
    />
  );
  
  // Animate net benefit bars
  yield* all(
    mluNetBenefitBar().height(mluNetBenefitHeight, 1.5, easeInOutCubic),
    mluNetBenefitBar().position.y(250 - mluNetBenefitHeight/2, 1.5, easeInOutCubic),
    cluNetBenefitBar().height(cluNetBenefitHeight, 1.5, easeInOutCubic),
    cluNetBenefitBar().position.y(250 - cluNetBenefitHeight/2, 1.5, easeInOutCubic)
  );
  
  yield* all(
    mluNetBenefitLabel().opacity(1, 0.5),
    cluNetBenefitLabel().opacity(1, 0.5)
  );
  
  // Create comparison arrow for net benefit
  const netBenefitDiff = createRef<Line>();
  const netBenefitDiffLabel = createRef<Txt>();
  const netBenefitDiffBg = createRef<Rect>();
  
  view.add(
    <Rect
      ref={netBenefitDiffBg}
      width={220}
      height={50}
      fill={`rgba(52, 168, 83, 0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={0}
      y={250}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.2)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt
      ref={netBenefitDiffLabel}
      text="12× Higher Benefit"
      x={0}
      y={250}
      opacity={0}
      fontSize={26}
      fontWeight={700}
      fill={colors.accent}
      textAlign="center"
    />
  );
  
  view.add(
    <Line
      ref={netBenefitDiff}
      points={[[-120, 250], [120, 250]]}
      stroke={colors.accent}
      lineWidth={3}
      startArrow={true}
      endArrow={true}
      arrowSize={12}
      opacity={0}
    />
  );
  
  yield* waitFor(0.5);
  yield* netBenefitDiffBg().opacity(1, 0.8);
  yield* netBenefitDiffLabel().opacity(1, 0.8);
  yield* netBenefitDiff().opacity(1, 0.8);
  
  // Final conclusion
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
      y={450}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.3)'}
      shadowBlur={15}
      shadowOffset={[0, 3]}
    />
  );
  
  view.add(
    <Txt
      ref={conclusion}
      text="Midwife-led care delivers 12× higher net benefit while costing 42% less than consultant-led care"
      y={450}
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
    conclusion().opacity(1, 1)
  );
  
  yield* waitFor(2);
}); 