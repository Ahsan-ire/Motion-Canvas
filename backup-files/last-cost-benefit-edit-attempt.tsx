import { makeScene2D } from '@motion-canvas/2d';
import { Rect, Txt, Line } from '@motion-canvas/2d';
import { createRef, createSignal } from '@motion-canvas/core';
import { all, waitFor, sequence } from '@motion-canvas/core';
import { easeInOutCubic, easeOutQuad, easeOutBack } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set background color to dark navy blue
  view.fill('#1e293b');

  // Data constants
  const MLU_COST = 1018.47;
  const CLU_COST = 1762.12;
  const MLU_BENEFIT = 1491.22;
  const CLU_BENEFIT = 123.23;
  const COST_DIFF = 743.65;

  // Colors
  const MLU_COLOR = '#4285F4'; // Blue
  const CLU_COLOR = '#EA4335'; // Red
  const MLU_BENEFIT_COLOR = '#34A853'; // Green
  const CLU_BENEFIT_COLOR = '#FBBC05'; // Yellow
  const TEXT_COLOR = '#FFFFFF';
  const ACCENT_COLOR = '#34A853'; // Green for highlights
  const CONTAINER_BG = 'rgba(255,255,255,0.05)';
  const CONTAINER_BORDER = 'rgba(255,255,255,0.1)';

  // Layout measurements
  const BAR_WIDTH = 100;
  const BAR_SPACING = 220; // Space between MLU and CLU bars within a section
  const SECTION_SPACING = 580; // Space between cost and benefit sections
  
  // Container dimensions
  const CONTAINER_WIDTH = 400;
  const CONTAINER_HEIGHT = 500;
  const CONTAINER_Y = 20; // Vertical center position
  
  // Bar bottom position (from where bars will grow upward)
  const BAR_BOTTOM_Y = CONTAINER_Y + CONTAINER_HEIGHT/2 - 80; // 80px from bottom of container for labels
  
  // Scaling for bar heights (making them visually appropriate)
  const COST_SCALE = 0.15;
  const BENEFIT_SCALE = 0.15;
  
  // Calculate max heights
  const MAX_COST_HEIGHT = CLU_COST * COST_SCALE;
  const MAX_BENEFIT_HEIGHT = MLU_BENEFIT * BENEFIT_SCALE;
  
  // Calculate bar heights
  const mluCostHeight = createSignal(0);
  const cluCostHeight = createSignal(0);
  const mluBenefitHeight = createSignal(0);
  const cluBenefitHeight = createSignal(0);
  
  // Calculate positions
  const COST_X = -SECTION_SPACING/2; // Left side
  const BENEFIT_X = SECTION_SPACING/2; // Right side
  
  // References for all elements
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();
  
  const costContainerRef = createRef<Rect>();
  const benefitContainerRef = createRef<Rect>();
  
  const costTitleBoxRef = createRef<Rect>();
  const costTitleRef = createRef<Txt>();
  
  const mluCostLabelRef = createRef<Txt>();
  const cluCostLabelRef = createRef<Txt>();
  
  const mluCostBarRef = createRef<Rect>();
  const cluCostBarRef = createRef<Rect>();
  
  const costDiffBoxRef = createRef<Rect>();
  const costDiffTextRef = createRef<Txt>();
  const costDiffLineRef = createRef<Line>();
  
  const benefitTitleBoxRef = createRef<Rect>();
  const benefitTitleRef = createRef<Txt>();
  
  const mluBenefitLabelRef = createRef<Txt>();
  const cluBenefitLabelRef = createRef<Txt>();
  
  const mluBenefitBarRef = createRef<Rect>();
  const cluBenefitBarRef = createRef<Rect>();
  
  const mluLabelRef = createRef<Txt>();
  const cluLabelRef = createRef<Txt>();
  const mluLabel2Ref = createRef<Txt>();
  const cluLabel2Ref = createRef<Txt>();
  
  const benefitDiffBoxRef = createRef<Rect>();
  const benefitDiffTextRef = createRef<Txt>();
  const benefitDiffLineRef = createRef<Line>();
  
  const conclusionBoxRef = createRef<Rect>();
  const conclusionTextRef = createRef<Txt>();

  // Add all elements to the scene
  view.add(
    <>
      {/* Title and subtitle */}
      <Txt
        ref={titleRef}
        text="Cost-Benefit Analysis"
        y={-340}
        opacity={0}
        fontSize={48}
        fontWeight={700}
        fill={TEXT_COLOR}
        textAlign="center"
      />
      
      <Txt
        ref={subtitleRef}
        text="Midwife-Led vs Consultant-Led Care"
        y={-290}
        opacity={0}
        fontSize={30}
        fontWeight={500}
        fill={TEXT_COLOR}
        textAlign="center"
      />
      
      {/* Containers for both sections */}
      <Rect
        ref={costContainerRef}
        width={CONTAINER_WIDTH}
        height={CONTAINER_HEIGHT}
        fill={CONTAINER_BG}
        stroke={CONTAINER_BORDER}
        lineWidth={1}
        radius={20}
        x={COST_X}
        y={CONTAINER_Y}
        opacity={0}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={20}
        shadowOffset={[0, 5]}
      />
      
      <Rect
        ref={benefitContainerRef}
        width={CONTAINER_WIDTH}
        height={CONTAINER_HEIGHT}
        fill={CONTAINER_BG}
        stroke={CONTAINER_BORDER}
        lineWidth={1}
        radius={20}
        x={BENEFIT_X}
        y={CONTAINER_Y}
        opacity={0}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={20}
        shadowOffset={[0, 5]}
      />
      
      {/* Cost section title */}
      <Rect
        ref={costTitleBoxRef}
        width={300}
        height={50}
        fill={'rgba(255,255,255,0.1)'}
        radius={25}
        x={COST_X}
        y={CONTAINER_Y - CONTAINER_HEIGHT/2 + 40}
        opacity={0}
      >
        <Txt
          ref={costTitleRef}
          text="Cost Comparison"
          fontSize={28}
          fontWeight={600}
          fill={TEXT_COLOR}
          textAlign="center"
        />
      </Rect>
      
      {/* Cost bars with bottom alignment */}
      <Rect
        ref={mluCostBarRef}
        width={BAR_WIDTH}
        height={() => mluCostHeight()}
        fill={MLU_COLOR}
        radius={[4, 4, 0, 0]}
        x={COST_X - BAR_SPACING/2}
        y={() => BAR_BOTTOM_Y - mluCostHeight()/2}
        origin={[0, 1]}
        opacity={0}
      />
      
      <Rect
        ref={cluCostBarRef}
        width={BAR_WIDTH}
        height={() => cluCostHeight()}
        fill={CLU_COLOR}
        radius={[4, 4, 0, 0]}
        x={COST_X + BAR_SPACING/2}
        y={BAR_BOTTOM_Y}
        origin={[0, 1]}
        opacity={0}
      />
      
      {/* Cost bar labels */}
      <Txt
        ref={mluCostLabelRef}
        text={`€${MLU_COST.toFixed(2)}`}
        x={COST_X - BAR_SPACING/2}
        y={() => BAR_BOTTOM_Y - mluCostHeight() - 25}
        opacity={0}
        fontSize={24}
        fontWeight={700}
        fill={MLU_COLOR}
        textAlign="center"
      />
      
      <Txt
        ref={cluCostLabelRef}
        text={`€${CLU_COST.toFixed(2)}`}
        x={COST_X + BAR_SPACING/2}
        y={() => BAR_BOTTOM_Y - cluCostHeight() - 25}
        opacity={0}
        fontSize={24}
        fontWeight={700}
        fill={CLU_COLOR}
        textAlign="center"
      />
      
      {/* Cost type labels */}
      <Txt
        ref={mluLabelRef}
        text="Midwife-Led Care"
        x={COST_X - BAR_SPACING/2}
        y={BAR_BOTTOM_Y + 30}
        opacity={0}
        fontSize={20}
        fontWeight={600}
        fill={MLU_COLOR}
        textAlign="center"
      />
      
      <Txt
        ref={cluLabelRef}
        text="Consultant-Led Care"
        x={COST_X + BAR_SPACING/2}
        y={BAR_BOTTOM_Y + 30}
        opacity={0}
        fontSize={20}
        fontWeight={600}
        fill={CLU_COLOR}
        textAlign="center"
      />
      
      {/* Cost difference */}
      <Rect
        ref={costDiffBoxRef}
        width={280}
        height={40}
        fill={'rgba(52, 168, 83, 0.2)'}
        stroke={ACCENT_COLOR}
        lineWidth={2}
        radius={20}
        x={COST_X}
        y={BAR_BOTTOM_Y - MAX_COST_HEIGHT - 80}
        opacity={0}
      >
        <Txt
          ref={costDiffTextRef}
          text={`€${COST_DIFF.toFixed(2)} Difference`}
          fontSize={20}
          fontWeight={600}
          fill={ACCENT_COLOR}
          textAlign="center"
        />
      </Rect>
      
      <Line
        ref={costDiffLineRef}
        points={[
          [COST_X - BAR_SPACING/2 + BAR_WIDTH/2, BAR_BOTTOM_Y - MLU_COST * COST_SCALE],
          [COST_X + BAR_SPACING/2 - BAR_WIDTH/2, BAR_BOTTOM_Y - CLU_COST * COST_SCALE]
        ]}
        stroke={ACCENT_COLOR}
        lineWidth={3}
        lineDash={[8, 4]}
        opacity={0}
      />
      
      {/* Benefit section title */}
      <Rect
        ref={benefitTitleBoxRef}
        width={300}
        height={50}
        fill={'rgba(255,255,255,0.1)'}
        radius={25}
        x={BENEFIT_X}
        y={CONTAINER_Y - CONTAINER_HEIGHT/2 + 40}
        opacity={0}
      >
        <Txt
          ref={benefitTitleRef}
          text="Net Benefit Comparison"
          fontSize={28}
          fontWeight={600}
          fill={TEXT_COLOR}
          textAlign="center"
        />
      </Rect>
      
      {/* Benefit bars with bottom alignment */}
      <Rect
        ref={mluBenefitBarRef}
        width={BAR_WIDTH}
        height={() => mluBenefitHeight()}
        fill={MLU_BENEFIT_COLOR}
        radius={[4, 4, 0, 0]}
        x={BENEFIT_X - BAR_SPACING/2}
        y={BAR_BOTTOM_Y}
        origin={[0, 1]}
        opacity={0}
      />
      
      <Rect
        ref={cluBenefitBarRef}
        width={BAR_WIDTH}
        height={() => cluBenefitHeight()}
        fill={CLU_BENEFIT_COLOR}
        radius={[4, 4, 0, 0]}
        x={BENEFIT_X + BAR_SPACING/2}
        y={BAR_BOTTOM_Y}
        origin={[0, 1]}
        opacity={0}
      />
      
      {/* Benefit bar labels */}
      <Txt
        ref={mluBenefitLabelRef}
        text={`€${MLU_BENEFIT.toFixed(2)}`}
        x={BENEFIT_X - BAR_SPACING/2}
        y={() => BAR_BOTTOM_Y - mluBenefitHeight() - 25}
        opacity={0}
        fontSize={24}
        fontWeight={700}
        fill={MLU_BENEFIT_COLOR}
        textAlign="center"
      />
      
      <Txt
        ref={cluBenefitLabelRef}
        text={`€${CLU_BENEFIT.toFixed(2)}`}
        x={BENEFIT_X + BAR_SPACING/2}
        y={() => BAR_BOTTOM_Y - cluBenefitHeight() - 25}
        opacity={0}
        fontSize={24}
        fontWeight={700}
        fill={CLU_BENEFIT_COLOR}
        textAlign="center"
      />
      
      {/* Benefit type labels */}
      <Txt
        ref={mluLabel2Ref}
        text="Midwife-Led Care"
        x={BENEFIT_X - BAR_SPACING/2}
        y={BAR_BOTTOM_Y + 30}
        opacity={0}
        fontSize={20}
        fontWeight={600}
        fill={MLU_BENEFIT_COLOR}
        textAlign="center"
      />
      
      <Txt
        ref={cluLabel2Ref}
        text="Consultant-Led Care"
        x={BENEFIT_X + BAR_SPACING/2}
        y={BAR_BOTTOM_Y + 30}
        opacity={0}
        fontSize={20}
        fontWeight={600}
        fill={CLU_BENEFIT_COLOR}
        textAlign="center"
      />
      
      {/* Benefit difference */}
      <Rect
        ref={benefitDiffBoxRef}
        width={280}
        height={40}
        fill={'rgba(52, 168, 83, 0.2)'}
        stroke={ACCENT_COLOR}
        lineWidth={2}
        radius={20}
        x={BENEFIT_X}
        y={BAR_BOTTOM_Y - MAX_BENEFIT_HEIGHT - 80}
        opacity={0}
      >
        <Txt
          ref={benefitDiffTextRef}
          text="12× Higher Benefit"
          fontSize={20}
          fontWeight={600}
          fill={ACCENT_COLOR}
          textAlign="center"
        />
      </Rect>
      
      <Line
        ref={benefitDiffLineRef}
        points={[
          [BENEFIT_X - BAR_SPACING/2 + BAR_WIDTH/2, BAR_BOTTOM_Y - MLU_BENEFIT * BENEFIT_SCALE],
          [BENEFIT_X + BAR_SPACING/2 - BAR_WIDTH/2, BAR_BOTTOM_Y - CLU_BENEFIT * BENEFIT_SCALE]
        ]}
        stroke={ACCENT_COLOR}
        lineWidth={3}
        lineDash={[8, 4]}
        opacity={0}
      />
      
      {/* Final conclusion */}
      <Rect
        ref={conclusionBoxRef}
        width={880}
        height={70}
        fill={'rgba(52, 168, 83, 0.2)'}
        stroke={ACCENT_COLOR}
        lineWidth={3}
        radius={35}
        y={CONTAINER_Y + CONTAINER_HEIGHT/2 + 100}
        opacity={0}
        shadowColor="rgba(0,0,0,0.3)"
        shadowBlur={20}
        shadowOffset={[0, 5]}
      >
        <Txt
          ref={conclusionTextRef}
          text="Midwife-led care delivers 12× higher net benefit while costing 42% less than consultant-led care"
          fontSize={24}
          fontWeight={700}
          fill={TEXT_COLOR}
          textAlign="center"
          width={840}
        />
      </Rect>
    </>
  );
  
  // Animation sequence
  yield* sequence(0.2,
    // Title animation
    all(
      titleRef().opacity(1, 0.8, easeOutQuad),
      subtitleRef().opacity(1, 0.8, easeOutQuad),
    ),
    
    waitFor(0.5),
    
    // Containers fade in
    all(
      costContainerRef().opacity(1, 0.8, easeOutQuad),
      benefitContainerRef().opacity(1, 0.8, easeOutQuad),
      costContainerRef().scale(0.95, 0).to(1, 0.8, easeOutBack),
      benefitContainerRef().scale(0.95, 0).to(1, 0.8, easeOutBack),
    ),
    
    // Both section titles together
    all(
      costTitleBoxRef().opacity(1, 0.6, easeOutQuad),
      benefitTitleBoxRef().opacity(1, 0.6, easeOutQuad),
    ),
    
    waitFor(0.4),
    
    // Show care type labels first (below bars)
    all(
      mluLabelRef().opacity(1, 0.5, easeOutQuad),
      cluLabelRef().opacity(1, 0.5, easeOutQuad),
      mluLabel2Ref().opacity(1, 0.5, easeOutQuad),
      cluLabel2Ref().opacity(1, 0.5, easeOutQuad),
    ),
    
    // All bars together
    all(
      mluCostBarRef().opacity(1, 0.5),
      cluCostBarRef().opacity(1, 0.5),
      mluBenefitBarRef().opacity(1, 0.5),
      cluBenefitBarRef().opacity(1, 0.5),
    ),
    
    // Grow all bars simultaneously
    all(
      mluCostHeight(MLU_COST * COST_SCALE, 1.2, easeInOutCubic),
      cluCostHeight(CLU_COST * COST_SCALE, 1.2, easeInOutCubic),
      mluBenefitHeight(MLU_BENEFIT * BENEFIT_SCALE, 1.2, easeInOutCubic),
      cluBenefitHeight(CLU_BENEFIT * BENEFIT_SCALE, 1.2, easeInOutCubic),
    ),
    
    // Show all value labels after bars grow
    all(
      mluCostLabelRef().opacity(1, 0.5, easeOutQuad),
      cluCostLabelRef().opacity(1, 0.5, easeOutQuad),
      mluBenefitLabelRef().opacity(1, 0.5, easeOutQuad),
      cluBenefitLabelRef().opacity(1, 0.5, easeOutQuad),
    ),
    
    waitFor(0.5),
    
    // Show comparisons
    all(
      costDiffLineRef().opacity(1, 0.6, easeOutQuad),
      costDiffBoxRef().opacity(1, 0.6, easeOutQuad),
      benefitDiffLineRef().opacity(1, 0.6, easeOutQuad),
      benefitDiffBoxRef().opacity(1, 0.6, easeOutQuad),
    ),
    
    waitFor(0.8),
    
    // Conclusion with more dramatic animation
    all(
      conclusionBoxRef().opacity(1, 1, easeOutBack),
      conclusionBoxRef().scale(0.9, 0).to(1, 1, easeOutBack),
    ),
    
    waitFor(2)
  );
});