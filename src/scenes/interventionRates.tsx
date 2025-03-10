import {makeScene2D} from '@motion-canvas/2d';
import {Rect, Txt, Line, Circle} from '@motion-canvas/2d';
import {createRef, createSignal, Signal} from '@motion-canvas/core';
import {all, waitFor, sequence, loop} from '@motion-canvas/core';
import {easeInOutCubic, easeOutBack, easeOutQuad, easeOutElastic} from '@motion-canvas/core';

// Define TypeScript interfaces for data
interface InterventionData {
  category: string;
  mluRate: number;
  cluRate: number;
  showDifference?: boolean;
}

interface HeaderConfig {
  text: string;
  color: string;
  bgColor: string;
  x: number;
}

// Define a consistent color palette
const COLORS = {
  primary: '#4285F4',      // MLU color (blue)
  secondary: '#DB4437',    // CLU color (red)
  accent: '#34A853',       // Green for highlights
  neutral: '#94a3b8',
  background: '#1e293b',   // Dark navy background
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
  view.fill(COLORS.background);
  
  // ===== CONFIGURATION =====
  
  // Scaling factor for responsive design
  const SCALE = 1.0;
  
  // Data for interventions
  const INTERVENTIONS: InterventionData[] = [
    {
      category: "Electronic Fetal Monitoring",
      mluRate: 36.1,
      cluRate: 56.7,
      showDifference: true
    },
    {
      category: "Labor Augmentation",
      mluRate: 39.6,
      cluRate: 56.9,
      showDifference: true
    },
    {
      category: "Cesarean Section",
      mluRate: 14.8,
      cluRate: 15.2,
      showDifference: false
    },
    {
      category: "Episiotomy",
      mluRate: 11.4,
      cluRate: 12.3,
      showDifference: false
    }
  ];
  
  // Layout measurements
  const LAYOUT = {
    titleY: -400 * SCALE,
    subtitleY: -350 * SCALE,
    startY: -120 * SCALE,      // Starting Y position for first bar
    barSpacing: 140 * SCALE,   // Increased spacing between bars
    barHeight: 30 * SCALE,
    barScale: 2.5,             // Scaling factor for bar width based on percentage
    barGap: 50 * SCALE,        // Gap between MLU and CLU bars
    headerY: -230 * SCALE,     // Moved headers higher (was -70 relative to startY)
    diffBoxOffset: 50 * SCALE, // Increased distance of difference boxes from bars
    categoryX: -400 * SCALE,   // Moved categories further left
    categoryWidth: 300 * SCALE,
    mluX: -150 * SCALE,        // Adjusted position for MLU header and bars
    cluX: 150 * SCALE,         // Adjusted position for CLU header and bars
    barBgWidth: 170 * SCALE,
    percentLabelOffset: 120 * SCALE,
    conclusionY: 420 * SCALE,
  };
  
  // Animation timing constants
  const TIMING = {
    titleFadeDuration: 0.8,
    headerFadeDuration: 0.5,
    barGrowDuration: 0.8,
    labelFadeDuration: 0.3,
    barDelay: 0.2,
    diffDelay: 0.5,
    diffShowDuration: 0.5,
    conclusionDelay: 0.5,
    conclusionDuration: 0.8,
    staggerDelay: 0.1,
    finalWait: 2.0
  };
  
  // ===== COMPONENT CREATION FUNCTIONS =====
  
  // Create a header with background
  function createHeader(config: HeaderConfig) {
    const bgRef = createRef<Rect>();
    const textRef = createRef<Txt>();
    
    return {
      background: (
        <Rect
          ref={bgRef}
          width={200 * SCALE}
          height={50 * SCALE}
          fill={`rgba(${config.bgColor}, 0.1)`}
          stroke={config.color}
          lineWidth={2}
          radius={10}
          x={config.x}
          y={LAYOUT.headerY}
          opacity={0}
          shadowColor={'rgba(0,0,0,0.2)'}
          shadowBlur={10}
          shadowOffset={[0, 2]}
        />
      ),
      text: (
        <Txt
          ref={textRef}
          text={config.text}
          x={config.x}
          y={LAYOUT.headerY}
          opacity={0}
          fontSize={20 * SCALE}
          fontWeight={700}
          fill={config.color}
          textAlign="center"
        />
      ),
      refs: {
        background: bgRef,
        text: textRef
      }
    };
  }
  
  // Create a bar pair (MLU and CLU) for an intervention
  function createInterventionBarPair(intervention: InterventionData, index: number) {
    const y = LAYOUT.startY + index * LAYOUT.barSpacing;
    const mluBarWidth = intervention.mluRate * LAYOUT.barScale;
    const cluBarWidth = intervention.cluRate * LAYOUT.barScale;
    
    const categoryRef = createRef<Txt>();
    const mluBarRef = createRef<Rect>();
    const cluBarRef = createRef<Rect>();
    const mluLabelRef = createRef<Txt>();
    const cluLabelRef = createRef<Txt>();
    
    let diffBoxRef = null;
    let diffLabelRef = null;
    
    // Create difference box if needed
    if (intervention.showDifference) {
      diffBoxRef = createRef<Rect>();
      diffLabelRef = createRef<Txt>();
      
      const diff = Math.abs(intervention.cluRate - intervention.mluRate).toFixed(1);
      
      return {
        categoryBg: (
          <Rect
            width={1000 * SCALE}
            height={80 * SCALE}
            fill={index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.1)'}
            radius={5}
            y={y}
            opacity={0.8}
          />
        ),
        category: (
          <Txt
            ref={categoryRef}
            text={intervention.category}
            x={LAYOUT.categoryX}
            y={y}
            opacity={0}
            fontSize={20 * SCALE}
            width={LAYOUT.categoryWidth}
            fontWeight={600}
            fill={COLORS.text}
            textAlign="center"
          />
        ),
        mluBarBg: (
          <Rect
            height={LAYOUT.barHeight}
            width={LAYOUT.barBgWidth}
            fill={`rgba(66, 133, 244, 0.2)`}
            x={LAYOUT.mluX}
            y={y}
            radius={4}
            opacity={0.8}
          />
        ),
        cluBarBg: (
          <Rect
            height={LAYOUT.barHeight}
            width={LAYOUT.barBgWidth}
            fill={`rgba(219, 68, 55, 0.2)`}
            x={LAYOUT.cluX}
            y={y}
            radius={4}
            opacity={0.8}
          />
        ),
        mluBar: (
          <Rect
            ref={mluBarRef}
            height={LAYOUT.barHeight}
            width={0}
            fill={COLORS.primary}
            x={LAYOUT.mluX - LAYOUT.barBgWidth/2 + mluBarWidth/2}
            y={y}
            radius={4}
          />
        ),
        cluBar: (
          <Rect
            ref={cluBarRef}
            height={LAYOUT.barHeight}
            width={0}
            fill={COLORS.secondary}
            x={LAYOUT.cluX - LAYOUT.barBgWidth/2 + cluBarWidth/2}
            y={y}
            radius={4}
          />
        ),
        mluLabel: (
          <Txt
            ref={mluLabelRef}
            text={`${intervention.mluRate}%`}
            x={LAYOUT.mluX + LAYOUT.percentLabelOffset}
            y={y}
            opacity={0}
            fontSize={20 * SCALE}
            fontWeight={700}
            fill={COLORS.primary}
          />
        ),
        cluLabel: (
          <Txt
            ref={cluLabelRef}
            text={`${intervention.cluRate}%`}
            x={LAYOUT.cluX + LAYOUT.percentLabelOffset}
            y={y}
            opacity={0}
            fontSize={20 * SCALE}
            fontWeight={700}
            fill={COLORS.secondary}
          />
        ),
        diffBox: (
          <Rect
            ref={diffBoxRef}
            width={220 * SCALE}
            height={40 * SCALE}
            fill={`rgba(52, 168, 83, 0.1)`}
            stroke={COLORS.accent}
            lineWidth={2}
            radius={10}
            x={0}
            y={y - LAYOUT.diffBoxOffset}
            opacity={0}
            shadowColor={'rgba(0,0,0,0.2)'}
            shadowBlur={10}
            shadowOffset={[0, 2]}
          />
        ),
        diffLabel: (
          <Txt
            ref={diffLabelRef}
            text={`${diff}% difference`}
            x={0}
            y={y - LAYOUT.diffBoxOffset}
            opacity={0}
            fontSize={18 * SCALE}
            fontWeight={700}
            fill={COLORS.accent}
            textAlign="center"
          />
        ),
        refs: {
          category: categoryRef,
          mluBar: mluBarRef,
          cluBar: cluBarRef,
          mluLabel: mluLabelRef,
          cluLabel: cluLabelRef,
          diffBox: diffBoxRef,
          diffLabel: diffLabelRef
        }
      };
    }
    
    // No difference box needed
    return {
      categoryBg: (
        <Rect
          width={1000 * SCALE}
          height={80 * SCALE}
          fill={index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.1)'}
          radius={5}
          y={y}
          opacity={0.8}
        />
      ),
      category: (
        <Txt
          ref={categoryRef}
          text={intervention.category}
          x={LAYOUT.categoryX}
          y={y}
          opacity={0}
          fontSize={20 * SCALE}
          width={LAYOUT.categoryWidth}
          fontWeight={600}
          fill={COLORS.text}
          textAlign="center"
        />
      ),
      mluBarBg: (
        <Rect
          height={LAYOUT.barHeight}
          width={LAYOUT.barBgWidth}
          fill={`rgba(66, 133, 244, 0.2)`}
          x={LAYOUT.mluX}
          y={y}
          radius={4}
          opacity={0.8}
        />
      ),
      cluBarBg: (
        <Rect
          height={LAYOUT.barHeight}
          width={LAYOUT.barBgWidth}
          fill={`rgba(219, 68, 55, 0.2)`}
          x={LAYOUT.cluX}
          y={y}
          radius={4}
          opacity={0.8}
        />
      ),
      mluBar: (
        <Rect
          ref={mluBarRef}
          height={LAYOUT.barHeight}
          width={0}
          fill={COLORS.primary}
          x={LAYOUT.mluX - LAYOUT.barBgWidth/2 + mluBarWidth/2}
          y={y}
          radius={4}
        />
      ),
      cluBar: (
        <Rect
          ref={cluBarRef}
          height={LAYOUT.barHeight}
          width={0}
          fill={COLORS.secondary}
          x={LAYOUT.cluX - LAYOUT.barBgWidth/2 + cluBarWidth/2}
          y={y}
          radius={4}
        />
      ),
      mluLabel: (
        <Txt
          ref={mluLabelRef}
          text={`${intervention.mluRate}%`}
          x={LAYOUT.mluX + LAYOUT.percentLabelOffset}
          y={y}
          opacity={0}
          fontSize={20 * SCALE}
          fontWeight={700}
          fill={COLORS.primary}
        />
      ),
      cluLabel: (
        <Txt
          ref={cluLabelRef}
          text={`${intervention.cluRate}%`}
          x={LAYOUT.cluX + LAYOUT.percentLabelOffset}
          y={y}
          opacity={0}
          fontSize={20 * SCALE}
          fontWeight={700}
          fill={COLORS.secondary}
        />
      ),
      refs: {
        category: categoryRef,
        mluBar: mluBarRef,
        cluBar: cluBarRef,
        mluLabel: mluLabelRef,
        cluLabel: cluLabelRef
      }
    };
  }
  
  // ===== ELEMENT REFERENCES =====
  
  // Create references for title and conclusion
  const titleRef = createRef<Txt>();
  const subtitleRef = createRef<Txt>();
  const conclusionBoxRef = createRef<Rect>();
  const conclusionRef = createRef<Txt>();
  
  // Create headers
  const mluHeader = createHeader({
    text: "Midwife-Led Care",
    color: COLORS.primary,
    bgColor: "66, 133, 244",
    x: LAYOUT.mluX
  });
  
  const cluHeader = createHeader({
    text: "Consultant-Led Care",
    color: COLORS.secondary,
    bgColor: "219, 68, 55",
    x: LAYOUT.cluX
  });
  
  // Create intervention bars
  const interventionBars = INTERVENTIONS.map((intervention, index) => 
    createInterventionBarPair(intervention, index)
  );
  
  // ===== ADDING ELEMENTS TO SCENE =====
  
  // Add title and subtitle
  view.add(
    <>
      <Txt
        ref={titleRef}
        text="Intervention Rates"
        y={LAYOUT.titleY}
        opacity={0}
        fontSize={44 * SCALE}
        fontWeight={700}
        fill={COLORS.text}
        textAlign="center"
      />
      
      <Txt
        ref={subtitleRef}
        text="Midwife-Led vs Consultant-Led Care"
        y={LAYOUT.subtitleY}
        opacity={0}
        fontSize={32 * SCALE}
        fontWeight={600}
        fill={COLORS.neutral}
        textAlign="center"
      />
    </>
  );
  
  // Add headers
  view.add(
    <>
      {mluHeader.background}
      {cluHeader.background}
      {mluHeader.text}
      {cluHeader.text}
    </>
  );
  
  // Add intervention bars and labels
  interventionBars.forEach(barPair => {
    view.add(
      <>
        {barPair.categoryBg}
        {barPair.category}
        {barPair.mluBarBg}
        {barPair.cluBarBg}
        {barPair.mluBar}
        {barPair.cluBar}
        {barPair.mluLabel}
        {barPair.cluLabel}
        {barPair.diffBox && barPair.diffBox}
        {barPair.diffLabel && barPair.diffLabel}
      </>
    );
  });
  
  // Add conclusion
  view.add(
    <>
      <Rect
        ref={conclusionBoxRef}
        width={900 * SCALE}
        height={100 * SCALE}
        fill={`rgba(52, 168, 83, 0.1)`}
        stroke={COLORS.accent}
        lineWidth={2}
        radius={15}
        y={LAYOUT.conclusionY}
        opacity={0}
        shadowColor={'rgba(0,0,0,0.3)'}
        shadowBlur={15}
        shadowOffset={[0, 3]}
      />
      
      <Txt
        ref={conclusionRef}
        text="Midwife-led care significantly reduces unnecessary interventions while 
        maintaining comparable safety outcomes"
        y={LAYOUT.conclusionY}
        opacity={0}
        fontSize={26 * SCALE}
        fontWeight={600}
        fill={COLORS.text}
        textAlign="center"
        width={850 * SCALE}
      />
    </>
  );
  
  // ===== ANIMATION SEQUENCE =====
  
  // Fade in title and subtitle
  yield* all(
    titleRef().opacity(1, TIMING.titleFadeDuration, easeOutQuad),
    titleRef().y(LAYOUT.titleY - 10, 0).to(LAYOUT.titleY, TIMING.titleFadeDuration, easeOutBack),
    subtitleRef().opacity(1, TIMING.titleFadeDuration, easeOutQuad)
  );
  
  // Animate in headers
  yield* all(
    mluHeader.refs.background().opacity(1, TIMING.headerFadeDuration),
    cluHeader.refs.background().opacity(1, TIMING.headerFadeDuration),
    mluHeader.refs.background().scale(0.95, 0).to(1, TIMING.headerFadeDuration, easeOutBack),
    cluHeader.refs.background().scale(0.95, 0).to(1, TIMING.headerFadeDuration, easeOutBack)
  );
  
  yield* all(
    mluHeader.refs.text().opacity(1, TIMING.headerFadeDuration),
    cluHeader.refs.text().opacity(1, TIMING.headerFadeDuration)
  );
  
  // Animate in category labels with staggered animation
  for (let i = 0; i < interventionBars.length; i++) {
    yield* interventionBars[i].refs.category().opacity(1, TIMING.labelFadeDuration);
    yield* waitFor(TIMING.staggerDelay);
  }
  
  // Animate in bars and labels
  for (let i = 0; i < interventionBars.length; i++) {
    const mluBarWidth = INTERVENTIONS[i].mluRate * LAYOUT.barScale;
    const cluBarWidth = INTERVENTIONS[i].cluRate * LAYOUT.barScale;
    
    // Grow bars
    yield* all(
      interventionBars[i].refs.mluBar().width(mluBarWidth, TIMING.barGrowDuration, easeInOutCubic),
      interventionBars[i].refs.cluBar().width(cluBarWidth, TIMING.barGrowDuration, easeInOutCubic)
    );
    
    // Show labels
    yield* all(
      interventionBars[i].refs.mluLabel().opacity(1, TIMING.labelFadeDuration),
      interventionBars[i].refs.cluLabel().opacity(1, TIMING.labelFadeDuration)
    );
    
    yield* waitFor(TIMING.barDelay);
  }
  
  // Show difference indicators
  yield* waitFor(TIMING.diffDelay);
  
  // Loop through interventions that need difference indicators
  for (let i = 0; i < interventionBars.length; i++) {
    if (INTERVENTIONS[i].showDifference && 
        interventionBars[i].refs.diffBox && 
        interventionBars[i].refs.diffLabel) {
      
      yield* all(
        interventionBars[i].refs.diffBox().opacity(1, TIMING.diffShowDuration),
        interventionBars[i].refs.diffBox().scale(0.9, 0).to(1, TIMING.diffShowDuration, easeOutBack),
        interventionBars[i].refs.diffLabel().opacity(1, TIMING.diffShowDuration)
      );
      
      yield* waitFor(TIMING.staggerDelay * 3);
    }
  }
  
  // Show conclusion
  yield* waitFor(TIMING.conclusionDelay);
  
  yield* all(
    conclusionBoxRef().opacity(1, TIMING.conclusionDuration),
    conclusionBoxRef().scale(0.95, 0).to(1, TIMING.conclusionDuration, easeOutBack),
    conclusionRef().opacity(1, TIMING.conclusionDuration)
  );
  
  // Add subtle pulse animation to conclusion for emphasis
  yield* loop(2, () => 
    all(
      conclusionBoxRef().scale(1, 0).to(1.02, 0.6, easeInOutCubic).to(1, 0.6, easeInOutCubic),
    )
  );
  
  yield* waitFor(TIMING.finalWait);
});