const BRUSH_TIME = 1500;
const activeToolEl = document.getElementById('active-tool');
const brushColorBtn = document.getElementById('brush-color');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColorBtn = document.getElementById('bucket-color');
const eraser = document.getElementById('eraser');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveStorageBtn = document.getElementById('save-storage');
const loadStorageBtn = document.getElementById('load-storage');
const clearStorageBtn = document.getElementById('clear-storage');
const downloadBtn = document.getElementById('download');
const { body } = document;

//some confusion with the switching between the eraser and brush
// Global Variables
const canvas = document.createElement('canvas');
canvas.id='canvas';
const context = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor = '#A51DAB';
let isEraser = false;
 let isMouseDown = false;
 let drawnArray = [];

// setting the brush settimeout
const brushResetter=ms=> setTimeout(switchToBrush,ms)
// Formatting Brush Size
 function displayBrushSize() {
brushSize.textContent = brushSlider.value<10?'0'+brushSlider.value:brushSlider.value;
 }

// Setting Brush Size
 brushSlider.addEventListener('change', () => {
currentSize= brushSlider.value;
displayBrushSize();
console.log(currentSize)

 });
 
//Setting Brush Color
brushColorBtn.addEventListener('change', () => {
  isEraser=false;
  currentColor= `#${brushColorBtn.value}`; 

});

// Setting Background Color
 bucketColorBtn.addEventListener('change', () => {
bucketColor=`#${bucketColorBtn.value}`
createCanvas();
restoreCanvas();
 });

// Eraser
 eraser.addEventListener('click', () => {
  isEraser=true;
  brushIcon.style.color = 'white';
   eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';
  currentColor=bucketColor;
  currentSize= 50;
  console.log(currentSize)
 });

 // Switch back to Brush
 function switchToBrush() {
   isEraser = false;
   activeToolEl.textContent = 'Brush';
   brushIcon.style.color = 'black';
   eraser.style.color = 'white';
   currentColor = `#${brushColorBtn.value}`;
   currentSize = 10;
   brushSlider.value= 10;
   displayBrushSize();
  console.log(currentSize)

 }

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0,0,canvas.width,canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

 // Clear Canvas
 clearCanvasBtn.addEventListener('click', () => {
   createCanvas();
   drawnArray = [];
   // Active Tool
   activeToolEl.textContent = 'Canvas Cleared';
   brushResetter(BRUSH_TIME);
 });

 // Draw what is stored in DrawnArray
 function restoreCanvas() {
   for (let i = 1; i < drawnArray.length; i++) {
     context.beginPath();
     context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
     context.lineWidth = drawnArray[i].size;
     context.lineCap = 'round';
     if (drawnArray[i].erase) {
       context.strokeStyle = bucketColor;
     } else {
       context.strokeStyle = drawnArray[i].color;
     }
     context.lineTo(drawnArray[i].x, drawnArray[i].y);
     context.stroke();
   }
 }

 // Store Drawn Lines in DrawnArray
 function storeDrawn(x, y, size, color, erase) {
   const line = {
    x,
     y,
    size,
   color,
     erase,
   };
   console.log(line);
   drawnArray.push(line);
 }

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  console.log('mouse is clicked', currentPosition);
   context.moveTo(currentPosition.x, currentPosition.y);
   context.beginPath();
   context.lineWidth = currentSize;
   context.lineCap = 'round';
   context.strokeStyle = currentColor;
});

// Mouse Move
canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    console.log('mouse is moving', currentPosition);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
   storeDrawn(
       currentPosition.x,
       currentPosition.y,
       currentSize,
       currentColor,
       isEraser,
     );
   }
   else {
    storeDrawn(undefined);
  }
});

// Mouse Up
window.addEventListener('mouseup', () => {
  isMouseDown = false; 
  console.log('mouse is unclicked');
});

 // Save to Local Storage
 saveStorageBtn.addEventListener('click', () => {
 localStorage.setItem('savedCanvas',JSON.stringify(drawnArray));
  // Active Tool
   activeToolEl.textContent = 'Canvas Saved';
   brushResetter(BRUSH_TIME)
 });

 // Load from Local Storage
 loadStorageBtn.addEventListener('click', () => {
   if (localStorage.getItem('savedCanvas')) {
     drawnArray = JSON.parse(localStorage.getItem('savedCanvas'));
     restoreCanvas();
   // Active Tool
     activeToolEl.textContent = 'Canvas Loaded';
     brushResetter(BRUSH_TIME)
   
   } 
   else{
    activeToolEl.textContent = 'Canvas Not found';
    brushResetter(BRUSH_TIME)
   }

 });

 // Clear Local Storage
 clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');
   // Active Tool
   activeToolEl.textContent = 'Local Storage Cleared';
   brushResetter(BRUSH_TIME)
 }); 

 // Download Image
 downloadBtn.addEventListener('click', () => {
downloadBtn.href= canvas.toDataURL('image/jpeg',1);
downloadBtn.download = "paint-example.jpg";
   // Active Tool
   activeToolEl.textContent = 'Image File Saved';
   brushResetter(BRUSH_TIME)
 });

// Event Listener
 brushIcon.addEventListener('click', switchToBrush);

// On Load
createCanvas();
