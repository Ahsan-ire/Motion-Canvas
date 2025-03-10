# Law Body Policy Animation

This project uses [Motion Canvas](https://motioncanvas.io/) to create animated visualizations for law and policy data comparisons. The animations include:

- Intervention rates comparison between MLU (Medical Law Unit) and CLU (Criminal Law Unit)
- Cost-benefit analysis for healthcare interventions
- Legislative gap visualizations

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

## Development

To start the development server:
```
npm start
```

This will launch the Motion Canvas editor where you can preview and edit animations.

## Building

To build the animations:
```
npm run build
```

## Project Structure

- `src/scenes/` - Contains the animation scenes:
  - `interventionRates.tsx` - Visualizes intervention rates comparison
  - `costBenefit.tsx` - Displays cost-benefit analysis for healthcare interventions
  - `legislativeGap.tsx` - Shows legislative gap visualizations
  - `example.tsx` - Example scene template

## Dependencies

This project uses:
- Motion Canvas Core (v3.17.2)
- Motion Canvas 2D (v3.17.2)
- Motion Canvas FFMPEG (v1.1.0)

## License

Private project - All rights reserved 