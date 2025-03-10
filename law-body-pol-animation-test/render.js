const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the scene name from command line arguments
const args = process.argv.slice(2);
const sceneArg = args.find(arg => arg.startsWith('--scene='));
const scene = sceneArg ? sceneArg.split('=')[1] : null;

if (!scene) {
  console.error('Please specify a scene using --scene=sceneName');
  process.exit(1);
}

console.log(`Rendering scene: ${scene}`);

// Start the vite development server
const vite = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

// Wait for the server to start
setTimeout(() => {
  // Open the browser with the render URL that specifically targets just one scene
  // Using the renderOnly parameter to ensure only the selected scene is rendered
  const url = `http://localhost:9002/?scene=${scene}&render=true&renderOnly=true`;
  
  // On macOS, use the 'open' command to open the URL in the default browser
  const open = spawn('open', [url], {
    stdio: 'inherit',
    shell: true
  });
  
  console.log(`Opening ${url} in your browser`);
  console.log('Please wait for the rendering to complete...');
  console.log('The video will be saved in the output directory.');
  console.log('To keep things clean:');
  console.log('1. Wait for the scene to finish rendering (progress bar will complete)');
  console.log('2. Close the browser window when rendering is complete');
  console.log('3. Press Ctrl+C to stop the script when done');
  
  // Keep the script running until the user terminates it
  process.stdin.resume();
}, 2000);

// Handle cleanup
process.on('SIGINT', () => {
  vite.kill();
  process.exit();
}); 