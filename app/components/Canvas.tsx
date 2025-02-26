"use client";

import React, { useRef, useEffect, useState } from 'react';

interface Stroke {
    x: number;
    y: number;
    isDrawing: boolean;
    color: string;
}

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [color, setColor] = useState<string>('black');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        let drawing = false;

        const startDrawing = (event: MouseEvent) => {
            drawing = true;
            draw(event);
        };

        const endDrawing = () => {
            drawing = false;
            context.beginPath();
        };

        const draw = (event: MouseEvent) => {
            if (!drawing) return;
            const x = event.clientX - canvas.offsetLeft;
            const y = event.clientY - canvas.offsetTop;
            setStrokes(prevStrokes => [...prevStrokes, { x, y, isDrawing: drawing, color }]);

            context.lineWidth = 5;
            context.lineCap = 'round';
            context.strokeStyle = color;

            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mousemove', draw);
        //on exit of the canvas, stop drawing
        canvas.addEventListener('mouseleave', endDrawing);
        //on enter of the canvas, evaluate if the mouse is down and start drawing
        canvas.addEventListener('mouseenter', (event) => {
            if (event.buttons === 1) {
                startDrawing(event);
            }
        }
        );

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mouseup', endDrawing);
            canvas.removeEventListener('mousemove', draw);
        };
    }, [color]);

    return (
        <div>
            <input type="color" id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
            
            <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />
            
            <button onClick={() => console.log(strokes)}>Log Strokes</button>
        </div>
    );
};

export default Canvas;
