const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 800;
const height = 600;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

function drawLeaf(x, y) {
    context.beginPath();
    context.arc(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5, 4, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
}

function drawTree(x1, y1, angle, depth, branchWidth) {
    if (depth !== 0) {
        const x2 = x1 + (Math.cos(angle * Math.PI / 180) * depth * 6.0);
        const y2 = y1 + (Math.sin(angle * Math.PI / 180) * depth * 6.0);
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = branchWidth;
        context.stroke();

        if (Math.random() < 0.5) {
            drawLeaf(x1, y1);
        }

        let newDepth = depth - Math.random() - 0.7;
        if (newDepth < 0) {
            newDepth = 0;
        }

        // Random branching factor
        let branches = Math.random() > 0.5 ? 2 : 3;
        for (let i = 0; i < branches; i++) {
            // Adjust angles to make the first couple of branches spread wider
            let baseAngle = depth > 9 ? 60 : (depth > 7 ? 45 : (branches === 2 ? 20 : 30));  // make first couple of branches wider
            let newAngle = angle - baseAngle + Math.random() * 2 * baseAngle;
            drawTree(x2, y2, newAngle, newDepth, branchWidth * 0.7);
        }

        // Add apricots
        if (depth <= 2 && Math.random() < 0.3) {
            context.beginPath();
            context.arc(x2, y2, 5, 0, 2 * Math.PI, false);
            context.fillStyle = 'orange';
            context.fill();
        }
    }
}

context.strokeStyle = 'brown';
context.lineWidth = 30;  // Make the trunk thicker
context.beginPath();
context.moveTo(400, 500);
context.lineTo(400, 450);
context.stroke();

context.strokeStyle = 'green';
drawTree(400, 450, -90, 11, 8);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./tree.png', buffer);
