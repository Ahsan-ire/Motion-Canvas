import { makeScene2D } from '@motion-canvas/2d';
import { Rect, Txt, Line, Node } from '@motion-canvas/2d';
import { createRef, createSignal, Signal } from '@motion-canvas/core';
import { all, waitFor, sequence, loop } from '@motion-canvas/core';
import { easeInOutCubic, easeOutQuad, easeOutBack, easeOutElastic } from '@motion-canvas/core';
import { NodeProps } from '@motion-canvas/2d/lib/components';
import { colors } from '../theme';

// Define TypeScript interfaces for data structures
interface HealthcareData {
  cost: number;
  benefit: number;
  costColor: string;
  benefitColor: string;
  name: string;
}

// Bar component with label
interface BarWithLabel {
  bar: Node;
  label: Node;
  valueLabel: Node;
  refs: {
    bar: ReturnType<typeof createRef<Rect>>;
    label: ReturnType<typeof createRef<Txt>>;
    valueLabel: ReturnType<typeof createRef<Txt>>;
  };
}

export default makeScene2D(function* (view) {
  // Set background color to light theme
  view.fill(colors.background);

  // ===== CONFIGURATION =====
  
  // Scaling factor for responsive design
  const SCALE = 1;
  
  // Healthcare data
  const DATA: Record<string, HealthcareData> = {
    mlu: {
      cost: 1018.47,
      benefit: 1491.22,
      costColor: colors.primary, // Red
      benefitColor: colors.accent, // Brown
      name: 'Midwife-Led Care'
    },
    clu: {
      cost: 1762.12,
      benefit: 123.23,
      costColor: colors.secondary, // Salmon
      benefitColor: colors.accent, // Brown
      name: 'Consultant-Led Care'
    }
  };
  
  // Calculated differences
  const COST_DIFF = DATA.clu.cost - DATA.mlu.cost;
  const BENEFIT_FACTOR = Math.round(DATA.mlu.benefit / DATA.clu.benefit);
  
  // Color constants
  const COLORS = {
    text: colors.text, // Brown text
    accent: colors.accent, // Brown for highlights
    containerBg: 'rgba(112,82,82,0.05)', // Light brown background
    containerBorder: 'rgba(112,82,82,0.1)', // Light brown border
    shadow: 'rgba(112,82,82,0.2)', // Brown shadow
    comparisonBg: 'rgba(112,82,82,0.1)' // Light brown comparison background
  };
  
  // Layout measurements
  const LAYOUT = {
    barWidth: 100 * SCALE,
    barSpacing: 220 * SCALE, // Space between MLU and CLU bars within a section
    sectionSpacing: 580 * SCALE, // Space between cost and benefit sections
    containerWidth: 420 * SCALE,
    containerHeight: 640 * SCALE,
    containerY: 20 * SCALE, // Vertical center position
    titleY: -400 * SCALE,
    subtitleY: -350 * SCALE,
    conclusionY: 0, // Will be calculated later
    titleFontSize: 48 * SCALE,
    subtitleFontSize: 30 * SCALE,
    sectionTitleFontSize: 28 * SCALE,
    valueLabelFontSize: 24 * SCALE,
    nameLabelFontSize: 20 * SCALE,
    conclusionFontSize: 24 * SCALE
  };
  
  // Bar bottom position (from where bars will grow upward)
  const BAR_BOTTOM_Y = LAYOUT.containerY + LAYOUT.containerHeight/2 - 170 * SCALE;
  LAYOUT.conclusionY = LAYOUT.containerY + LAYOUT.containerHeight/2 + 140 * SCALE;
  
  // Animation timing constants
  const TIMING = {
    initialDelay: 0.5,
    titleFadeDuration: 1.2,
    containerFadeDuration: 1.2,
    titleWait: 1.0,
    sectionWait: 0.8,
    barGrowDuration: 2.0,
    staggerDelay: 0.3,
    comparisonWait: 1.0,
    conclusionWait: 1.2,
    conclusionDuration: 1.5,
    finalWait: 3.0
  };
  
  // Scaling for bar heights (making them visually appropriate)
  const COST_SCALE = 0.15;
  const BENEFIT_SCALE = 0.15;
  
  // Calculate max heights
  const MAX_COST_HEIGHT = DATA.clu.cost * COST_SCALE;
  const MAX_BENEFIT_HEIGHT = DATA.mlu.benefit * BENEFIT_SCALE;
  
  // Calculate positions
  const COST_X = -LAYOUT.sectionSpacing/2; // Left side
  const BENEFIT_X = LAYOUT.sectionSpacing/2; // Right side
  
  // ===== SIGNAL CREATION =====
  
  // Calculate bar heights
  const mluCostHeight = createSignal(0);
  const cluCostHeight = createSignal(0);
  const mluBenefitHeight = createSignal(0);
  const cluBenefitHeight = createSignal(0);
  
  // ===== COMPONENT CREATION FUNCTIONS =====
  
  // Create a bar with labels
  function createBarWithLabel(
    x: number,
    y: number,
    heightSignal: Signal<number, number>,
    color: string,
    value: number,
    label: string,
    valueFormat: (n: number) => string = (n) => `€${n.toFixed(2)}`
  ): BarWithLabel {
    const barRef = createRef<Rect>();
    const labelRef = createRef<Txt>();
    const valueLabelRef = createRef<Txt>();
    
    return {
      bar: (
        <Rect
        ref={barRef}
        width={LAYOUT.barWidth}
        height={() => heightSignal()}
        fill={color}
        radius={[4, 4, 0, 0]}
        x={x}
        y={BAR_BOTTOM_Y}
        position={[0.5, 1]}
        opacity={0}
      />
      ),
      label: (
        <Txt
          ref={labelRef}
          text={label}
          x={x}
          y={y + 200 * SCALE}
          opacity={0}
          fontSize={LAYOUT.nameLabelFontSize}
          fontWeight={600}
          fill={color}
          textAlign="center"
        />
      ),
      valueLabel: (
        <Txt
         ref={valueLabelRef}
  text={valueFormat(value)}
  x={x}
  y={() => BAR_BOTTOM_Y - heightSignal() - 15}  // Position relative to BAR_BOTTOM_Y
  opacity={0}
  fontSize={LAYOUT.valueLabelFontSize}
  fontWeight={700}
  fill={color}
  textAlign="center" 
        />
      ),
      refs: {
        bar: barRef,
        label: labelRef,
        valueLabel: valueLabelRef
      }
    };
  }
  
  // Create a section container with title
  function createSectionContainer(x: number, y: number, title: string) {
    const containerRef = createRef<Rect>();
    const titleBoxRef = createRef<Rect>();
    const titleRef = createRef<Txt>();
    
    return {
      container: (
        <Rect
          ref={containerRef}
          width={LAYOUT.containerWidth}
          height={LAYOUT.containerHeight}
          fill={COLORS.containerBg}
          stroke={COLORS.containerBorder}
          lineWidth={1}
          radius={20}
          x={x}
          y={y}
          opacity={0}
          shadowColor={COLORS.shadow}
          shadowBlur={20}
          shadowOffset={[0, 5]}
        />
      ),
      titleBox: (
        <Rect
          ref={titleBoxRef}
          width={300 * SCALE}
          height={50 * SCALE}
          fill={'rgba(255,255,255,0.1)'}
          radius={25}
          x={x}
          y={y - LAYOUT.containerHeight/2 + 40 * SCALE}
          opacity={0}
        >
          <Txt
            ref={titleRef}
            text={title}
            fontSize={LAYOUT.sectionTitleFontSize}
            fontWeight={600}
            fill={COLORS.text}
            textAlign="center"
          />
        </Rect>
      ),
      refs: {
        container: containerRef,
        titleBox: titleBoxRef,
        title: titleRef
      }
    };
  }
  
  // Create a comparison element (line + label box)
  function createComparison(
    x: number, 
    y: number, 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number, 
    text: string
  ) {
    const boxRef = createRef<Rect>();
    const textRef = createRef<Txt>();
    const lineRef = createRef<Line>();
    
    return {
      box: (
        <Rect
          ref={boxRef}
          width={280 * SCALE}
          height={40 * SCALE}
          fill={COLORS.comparisonBg}
          stroke={COLORS.accent}
          lineWidth={2}
          radius={20}
          x={x}
          y={y}
          opacity={0}
        >
          <Txt
            ref={textRef}
            text={text}
            fontSize={LAYOUT.nameLabelFontSize}
            fontWeight={600}
            fill={COLORS.accent}
            textAlign="center"
          />
        </Rect>
      ),
      line: (
        <Line
          ref={lineRef}
          points={[[startX, startY], [endX, endY]]}
          stroke={COLORS.accent}
          lineWidth={3}
          lineDash={[8, 4]}
          opacity={0}
        />
      ),
      refs: {
        box: boxRef,
        text: textRef,
        line: lineRef
      }
    };
  }
  
  // ===== ELEMENT REFERENCES =====
  
  // Reference creation
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();
  const conclusionBoxRef = createRef<Rect>();
  const conclusionTextRef = createRef<Txt>();
  
  // ===== CREATING COMPONENTS =====
  
  // Create section containers
  const costSection = createSectionContainer(COST_X, LAYOUT.containerY, "Cost Comparison");
  const benefitSection = createSectionContainer(BENEFIT_X, LAYOUT.containerY, "Net Benefit Comparison");
  
  // Create bars with labels
  const mluCostBar = createBarWithLabel(
    COST_X - LAYOUT.barSpacing/2,
    BAR_BOTTOM_Y, 
    mluCostHeight, 
    DATA.mlu.costColor, 
    DATA.mlu.cost, 
    DATA.mlu.name
  );
  
  const cluCostBar = createBarWithLabel(
    COST_X + LAYOUT.barSpacing/2, 
    BAR_BOTTOM_Y, 
    cluCostHeight, 
    DATA.clu.costColor, 
    DATA.clu.cost, 
    DATA.clu.name
  );
  
  const mluBenefitBar = createBarWithLabel(
    BENEFIT_X - LAYOUT.barSpacing/2, 
    BAR_BOTTOM_Y, 
    mluBenefitHeight, 
    DATA.mlu.benefitColor, 
    DATA.mlu.benefit, 
    DATA.mlu.name
  );
  
  const cluBenefitBar = createBarWithLabel(
    BENEFIT_X + LAYOUT.barSpacing/2, 
    BAR_BOTTOM_Y, 
    cluBenefitHeight, 
    DATA.clu.benefitColor, 
    DATA.clu.benefit, 
    DATA.clu.name
  );
  
  // Create comparisons
  const costComparison = createComparison(
    COST_X,
    BAR_BOTTOM_Y - MAX_COST_HEIGHT - 100 * SCALE,
    COST_X - LAYOUT.barSpacing/2 + LAYOUT.barWidth/2,
    BAR_BOTTOM_Y - DATA.mlu.cost * COST_SCALE,
    COST_X + LAYOUT.barSpacing/2 - LAYOUT.barWidth/2,
    BAR_BOTTOM_Y - DATA.clu.cost * COST_SCALE,
    `€${COST_DIFF.toFixed(2)} Difference`
  );
  
  const benefitComparison = createComparison(
    BENEFIT_X,
    BAR_BOTTOM_Y - MAX_BENEFIT_HEIGHT - 140 * SCALE,
    BENEFIT_X - LAYOUT.barSpacing/2 + LAYOUT.barWidth/2,
    BAR_BOTTOM_Y - DATA.mlu.benefit * BENEFIT_SCALE,
    BENEFIT_X + LAYOUT.barSpacing/2 - LAYOUT.barWidth/2,
    BAR_BOTTOM_Y - DATA.clu.benefit * BENEFIT_SCALE,
    `${BENEFIT_FACTOR}× Higher Benefit`
  );

  // ===== ADDING ELEMENTS TO SCENE =====
  
  // Add all elements to the scene in proper order
  view.add(
    <Node>
      {/* Title and subtitle */}
      <Txt
        ref={titleRef}
        text="Cost-Benefit Analysis"
        y={LAYOUT.titleY}
        opacity={0}
        fontSize={LAYOUT.titleFontSize}
        fontWeight={700}
        fill={COLORS.text}
        textAlign="center"
      />
      
      <Txt
        ref={subtitleRef}
        text="Midwife-Led vs Consultant-Led Care"
        y={LAYOUT.subtitleY}
        opacity={0}
        fontSize={LAYOUT.subtitleFontSize}
        fontWeight={500}
        fill={COLORS.text}
        textAlign="center"
      />
      
      {/* Section containers */}
      {costSection.container}
      {benefitSection.container}
      
      {/* Section titles */}
      {costSection.titleBox}
      {benefitSection.titleBox}
      
      {/* Cost bars and labels */}
      {mluCostBar.bar}
      {cluCostBar.bar}
      {mluCostBar.label}
      {cluCostBar.label}
      {mluCostBar.valueLabel}
      {cluCostBar.valueLabel}
      
      {/* Benefit bars and labels */}
      {mluBenefitBar.bar}
      {cluBenefitBar.bar}
      {mluBenefitBar.label}
      {cluBenefitBar.label}
      {mluBenefitBar.valueLabel}
      {cluBenefitBar.valueLabel}
      
      {/* Comparisons */}
      {costComparison.line}
      {costComparison.box}
      {benefitComparison.line}
      {benefitComparison.box}
      
      {/* Final conclusion */}
      <Rect
        ref={conclusionBoxRef}
        width={880 * SCALE}
        height={90 * SCALE}
        fill={COLORS.comparisonBg}
        stroke={COLORS.accent}
        lineWidth={3}
        radius={35}
        y={LAYOUT.conclusionY}
        opacity={0}
        shadowColor={COLORS.shadow}
        shadowBlur={20}
        shadowOffset={[0, 5]}
      >
        <Txt
          ref={conclusionTextRef}
          text="Midwife-led care delivers 12× higher net benefit while costing 42% less than 
          consultant-led care"
          fontSize={LAYOUT.conclusionFontSize}
          fontWeight={700}
          fill={COLORS.text}
          textAlign="center"
          width={860 * SCALE}
        />
      </Rect>
    </Node>
  );
  
  // ===== ANIMATION SEQUENCE =====
  
  yield* sequence(TIMING.initialDelay,
    // Title animation with subtle bounce
    all(
      titleRef().opacity(1, TIMING.titleFadeDuration, easeOutQuad),
      titleRef().y(LAYOUT.titleY - 10 * SCALE, 0).to(LAYOUT.titleY, TIMING.titleFadeDuration, easeOutBack),
      subtitleRef().opacity(1, TIMING.titleFadeDuration, easeOutQuad),
      subtitleRef().y(LAYOUT.subtitleY - 5 * SCALE, 0).to(LAYOUT.subtitleY, TIMING.titleFadeDuration, easeOutBack),
    ),
    
    waitFor(TIMING.titleWait),
    
    // Containers fade in with scale effect
    all(
      costSection.refs.container().opacity(1, TIMING.containerFadeDuration, easeOutQuad),
      benefitSection.refs.container().opacity(1, TIMING.containerFadeDuration, easeOutQuad),
      costSection.refs.container().scale(0.95, 0).to(1, TIMING.containerFadeDuration, easeOutBack),
      benefitSection.refs.container().scale(0.95, 0).to(1, TIMING.containerFadeDuration, easeOutBack),
    ),
    
    // Section titles with staggered animation
    costSection.refs.titleBox().opacity(1, TIMING.containerFadeDuration, easeOutQuad),
    waitFor(TIMING.staggerDelay),
    benefitSection.refs.titleBox().opacity(1, TIMING.containerFadeDuration, easeOutQuad),
    
    waitFor(TIMING.sectionWait),
    
    // Show care type labels first with staggered animation
    all(
      mluCostBar.refs.label().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
      cluCostBar.refs.label().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
    ),
    waitFor(TIMING.staggerDelay),
    all(
      mluBenefitBar.refs.label().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
      cluBenefitBar.refs.label().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
    ),
    
    waitFor(TIMING.staggerDelay),
    
    // Fade in bars
    all(
      mluCostBar.refs.bar().opacity(1, TIMING.containerFadeDuration/2),
      cluCostBar.refs.bar().opacity(1, TIMING.containerFadeDuration/2),
      mluBenefitBar.refs.bar().opacity(1, TIMING.containerFadeDuration/2),
      cluBenefitBar.refs.bar().opacity(1, TIMING.containerFadeDuration/2),
    ),
    
    // Grow all bars with subtle staggering
    mluCostHeight(DATA.mlu.cost * COST_SCALE, TIMING.barGrowDuration, easeInOutCubic),
    waitFor(TIMING.staggerDelay/2),
    cluCostHeight(DATA.clu.cost * COST_SCALE, TIMING.barGrowDuration, easeInOutCubic),
    waitFor(TIMING.staggerDelay/2),
    mluBenefitHeight(DATA.mlu.benefit * BENEFIT_SCALE, TIMING.barGrowDuration, easeInOutCubic),
    waitFor(TIMING.staggerDelay/2),
    cluBenefitHeight(DATA.clu.benefit * BENEFIT_SCALE, TIMING.barGrowDuration, easeInOutCubic),
    
    // Show value labels after bars grow
    all(
      mluCostBar.refs.valueLabel().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
      waitFor(TIMING.staggerDelay/4),
      cluCostBar.refs.valueLabel().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
      waitFor(TIMING.staggerDelay/4),
      mluBenefitBar.refs.valueLabel().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
      waitFor(TIMING.staggerDelay/4),
      cluBenefitBar.refs.valueLabel().opacity(1, TIMING.titleFadeDuration/2, easeOutQuad),
    ),
    
    waitFor(TIMING.comparisonWait),
    
    // Show cost comparison
    all(
      costComparison.refs.line().opacity(1, TIMING.containerFadeDuration/2, easeOutQuad),
      costComparison.refs.box().opacity(1, TIMING.containerFadeDuration/2, easeOutQuad),
      costComparison.refs.box().scale(0.9, 0).to(1, TIMING.containerFadeDuration/2, easeOutBack),
    ),
    
    waitFor(TIMING.staggerDelay),
    
    // Show benefit comparison
    all(
      benefitComparison.refs.line().opacity(1, TIMING.containerFadeDuration/2, easeOutQuad),
      benefitComparison.refs.box().opacity(1, TIMING.containerFadeDuration/2, easeOutQuad),
      benefitComparison.refs.box().scale(0.9, 0).to(1, TIMING.containerFadeDuration/2, easeOutBack),
    ),
    
    waitFor(TIMING.conclusionWait),
    
    // Conclusion with more dramatic animation
    all(
      conclusionBoxRef().opacity(1, TIMING.conclusionDuration, easeOutQuad),
      conclusionBoxRef().scale(0.9, 0).to(1, TIMING.conclusionDuration, easeOutElastic),
    ),
    
    // Add subtle pulse animation to conclusion for emphasis
    loop(2, () => 
      all(
        conclusionBoxRef().scale(1, 0).to(1.02, 0.6, easeInOutCubic).to(1, 0.6, easeInOutCubic),
      )
    ),
    
    waitFor(TIMING.finalWait)
  );
});