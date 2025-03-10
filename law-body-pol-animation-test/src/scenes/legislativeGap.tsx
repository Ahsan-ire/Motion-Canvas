import {makeScene2D} from '@motion-canvas/2d';
import {Rect, Txt, Line, Circle} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {all, waitFor, sequence} from '@motion-canvas/core';
import {easeInOutCubic, easeOutBack, easeInOutQuad} from '@motion-canvas/core';
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
//   success: '#4CAF50',
//   warning: '#FFC107',
//   error: '#F44336',
// };

export default makeScene2D(function* (view) {
  // Set background color
  view.fill(colors.background);
  
  // Create title and subtitle
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  
  view.add(
    <Txt
      ref={title}
      text="Obstetric Violence Legislation"
      y={-250}
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
      text="Timeline of Global Legislative Developments"
      y={-200}
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
  
  // Create timeline
  const timeline = createRef<Line>();
  const timelineBg = createRef<Rect>();
  
  // Add timeline background
  view.add(
    <Rect
      ref={timelineBg}
      width={1100}
      height={60}
      fill={colors.darkBackground}
      radius={30}
      y={0}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.2)'}
      shadowBlur={15}
      shadowOffset={[0, 3]}
    />
  );
  
  // Add timeline
  view.add(
    <Line
      ref={timeline}
      points={[[-500, 0], [500, 0]]}
      stroke={colors.accent}
      lineWidth={5}
      opacity={0}
    />
  );
  
  // Fade in timeline
  yield* all(
    timelineBg().opacity(1, 0.8),
    timeline().opacity(1, 0.8)
  );
  
  // Add years
  const years = [2007, 2009, 2015, 2023, 2025];
  const yearRefs = years.map(y => createRef<Txt>());
  const yearPos = [-400, -200, 0, 200, 400]; // X positions - more spread out
  const yearCircles = years.map(y => createRef<Circle>());
  
  // Add year markers and labels
  years.forEach((year, i) => {
    // Add year marker circles
    view.add(
      <Circle
        ref={yearCircles[i]}
        x={yearPos[i]}
        y={0}
        width={24}
        height={24}
        fill={colors.background}
        stroke={colors.neutral}
        lineWidth={3}
        opacity={0}
      />
    );
    
    // Add year labels
    view.add(
      <Txt
        ref={yearRefs[i]}
        text={year.toString()}
        x={yearPos[i]}
        y={40}
        opacity={0}
        fontSize={26}
        fontWeight={700}
        fill={colors.text}
        textAlign="center"
      />
    );
  });
  
  // Animate year markers and labels appearing
  for (let i = 0; i < years.length; i++) {
    yield* all(
      yearCircles[i]().opacity(1, 0.3),
      yearRefs[i]().opacity(1, 0.3),
      yearCircles[i]().scale(0.5, 0).to(1, 0.4, easeOutBack)
    );
    yield* waitFor(0.1);
  }
  
  // Add legislation dots and labels
  const venDot = createRef<Circle>();
  const venBox = createRef<Rect>();
  const venLabel = createRef<Txt>();
  
  const argDot = createRef<Circle>();
  const argBox = createRef<Rect>();
  const argLabel = createRef<Txt>();
  
  const ireDot1 = createRef<Circle>();
  const ireBox1 = createRef<Rect>();
  const ireLabel1 = createRef<Txt>();
  
  const ireDot2 = createRef<Circle>();
  const ireBox2 = createRef<Rect>();
  const ireLabel2 = createRef<Txt>();
  
  const currentDot = createRef<Circle>();
  const currentBox = createRef<Rect>();
  const currentLabel = createRef<Txt>();
  
  // Venezuela 2007 - above timeline
  view.add(
    <Circle ref={venDot} x={yearPos[0]} y={0} width={30} height={30} fill={colors.accent} opacity={0} />
  );
  
  view.add(
    <Rect
      ref={venBox}
      width={220}
      height={80}
      fill={`rgba(112,82,82,0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={yearPos[0]}
      y={-100}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.15)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt 
      ref={venLabel} 
      text="Venezuela: 
      First specific O.V law" 
      x={yearPos[0]} 
      y={-100} 
      opacity={0} 
      fontSize={18} 
      fontWeight={600}
      textAlign="center"
      width={200}
      fill={colors.text}
    />
  );
  
  // Argentina 2009 - below timeline
  view.add(
    <Circle ref={argDot} x={yearPos[1]} y={0} width={30} height={30} fill={colors.accent} opacity={0} />
  );
  
  view.add(
    <Rect
      ref={argBox}
      width={240}
      height={80}
      fill={`rgba(112,82,82,0.1)`}
      stroke={colors.accent}
      lineWidth={2}
      radius={10}
      x={yearPos[1]}
      y={100}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.15)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt 
      ref={argLabel} 
      text="Argentina:
      Violence Against Women law" 
      x={yearPos[1]} 
      y={100} 
      opacity={0} 
      fontSize={17} 
      fontWeight={600}
      textAlign="center"
      width={280}
      fill={colors.text}
    />
  );
  
  // Ireland 2015 - above timeline
  view.add(
    <Circle ref={ireDot1} x={yearPos[2]} y={0} width={30} height={30} fill={colors.warning} opacity={0} />
  );
  
  view.add(
    <Rect
      ref={ireBox1}
      width={280}
      height={80}
      fill={`rgba(226,137,137,0.1)`}
      stroke={colors.warning}
      lineWidth={2}
      radius={10}
      x={yearPos[2]}
      y={-100}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.15)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt 
      ref={ireLabel1} 
      text="Ireland: 
    Assisted Decision-Making Act" 
      x={yearPos[2]} 
      y={-100} 
      opacity={0} 
      fontSize={18} 
      fontWeight={600}
      textAlign="center"
      width={320}
      fill={colors.text}
    />
  );
  
  // Ireland 2023 - below timeline
  view.add(
    <Circle ref={ireDot2} x={yearPos[3]} y={0} width={30} height={30} fill={colors.warning} opacity={0} />
  );
  
  view.add(
    <Rect
      ref={ireBox2}
      width={230}
      height={80}
      fill={`rgba(226,137,137,0.1)`}
      stroke={colors.warning}
      lineWidth={2}
      radius={10}
      x={yearPos[3]}
      y={100}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.15)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt 
      ref={ireLabel2} 
      text="Ireland: Patient Safety Act" 
      x={yearPos[3]} 
      y={100} 
      opacity={0} 
      fontSize={18} 
      fontWeight={600}
      textAlign="center"
      width={220}
      fill={colors.text}
    />
  );
  
  // Current gap 2025 - above timeline
  view.add(
    <Circle ref={currentDot} x={yearPos[4]} y={0} width={30} height={30} fill={colors.primary} opacity={0} />
  );
  
  view.add(
    <Rect
      ref={currentBox}
      width={260}
      height={80}
      fill={`rgba(204,90,90,0.1)`}
      stroke={colors.primary}
      lineWidth={2}
      radius={10}
      x={yearPos[4]}
      y={-100}
      opacity={0}
      shadowColor={'rgba(112,82,82,0.15)'}
      shadowBlur={10}
      shadowOffset={[0, 2]}
    />
  );
  
  view.add(
    <Txt 
      ref={currentLabel} 
      text="Currently no specific 
      O.V legislation in Ireland" 
      x={yearPos[4]} 
      y={-100} 
      opacity={0} 
      fontSize={18} 
      fontWeight={600}
      textAlign="center"
      width={230}
      fill={colors.text}
    />
  );
  
  // Animate dots and labels appearing with better timing
  // Venezuela
  yield* all(
    venDot().opacity(1, 0.5),
    venDot().scale(0.5, 0).to(1, 0.5, easeOutBack)
  );
  yield* all(
    venBox().opacity(1, 0.5),
    venLabel().opacity(1, 0.5),
    venBox().position.y(-110, 0.4).to(-100, 0.3)
  );
  yield* waitFor(0.3);
  
  // Argentina
  yield* all(
    argDot().opacity(1, 0.5),
    argDot().scale(0.5, 0).to(1, 0.5, easeOutBack)
  );
  yield* all(
    argBox().opacity(1, 0.5),
    argLabel().opacity(1, 0.5),
    argBox().position.y(110, 0.4).to(100, 0.3)
  );
  yield* waitFor(0.3);
  
  // Ireland 2015
  yield* all(
    ireDot1().opacity(1, 0.5),
    ireDot1().scale(0.5, 0).to(1, 0.5, easeOutBack)
  );
  yield* all(
    ireBox1().opacity(1, 0.5),
    ireLabel1().opacity(1, 0.5),
    ireBox1().position.y(-110, 0.4).to(-100, 0.3)
  );
  yield* waitFor(0.3);
  
  // Ireland 2023
  yield* all(
    ireDot2().opacity(1, 0.5),
    ireDot2().scale(0.5, 0).to(1, 0.5, easeOutBack)
  );
  yield* all(
    ireBox2().opacity(1, 0.5),
    ireLabel2().opacity(1, 0.5),
    ireBox2().position.y(110, 0.4).to(100, 0.3)
  );
  yield* waitFor(0.3);
  
  // Current gap 2025
  yield* all(
    currentDot().opacity(1, 0.5),
    currentDot().scale(0.5, 0).to(1, 0.5, easeOutBack)
  );
  yield* all(
    currentBox().opacity(1, 0.5),
    currentLabel().opacity(1, 0.5),
    currentBox().position.y(-110, 0.4).to(-100, 0.3)
  );
  
  // Highlight the gap - draw an attention circle
  const gapHighlight = createRef<Circle>();
  view.add(
    <Circle 
      ref={gapHighlight} 
      x={yearPos[4]} 
      y={0} 
      width={60} 
      height={60} 
      stroke={colors.error} 
      lineWidth={3} 
      fill="rgba(0,0,0,0)" 
      opacity={0} 
    />
  );
  
  yield* waitFor(0.5);
  yield* gapHighlight().opacity(1, 0.3);
  yield* gapHighlight().scale(1.2, 0.5, easeInOutCubic);
  yield* gapHighlight().scale(1, 0.5, easeInOutCubic);
  
  // Show the conclusion
  const conclusionBox = createRef<Rect>();
  const conclusion = createRef<Txt>();
  
  view.add(
    <Rect
      ref={conclusionBox}
      width={900}
      height={100}
      fill={`rgba(244, 67, 54, 0.1)`}
      stroke={colors.error}
      lineWidth={2}
      radius={15}
      y={240}
      opacity={0}
      shadowColor={'rgba(0,0,0,0.3)'}
      shadowBlur={15}
      shadowOffset={[0, 3]}
    />
  );
  
  view.add(
    <Txt
      ref={conclusion}
      text="Ireland still lacks specific legislation addressing obstetric violence, 
      unlike South American countries who are pioneers in this area"
      y={240}
      opacity={0}
      fontSize={26}
      fontWeight={600}
      fill={colors.text}
      textAlign="center"
      width={850}
    />
  );
  
  yield* all(
    conclusionBox().opacity(1, 0.8),
    conclusion().opacity(1, 1)
  );
  
  yield* waitFor(2);
}); 