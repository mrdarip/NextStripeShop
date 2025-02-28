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

        const startDrawing = (event: MouseEvent | TouchEvent) => {
            drawing = true;
            draw(event);
        };

        const endDrawing = () => {
            drawing = false;
            context.beginPath();
        };

        const draw = (event: MouseEvent | TouchEvent) => {
            if (!drawing) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = ((event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - rect.left) * scaleX;
            const y = ((event instanceof MouseEvent ? event.clientY : event.touches[0].clientY) - rect.top) * scaleY;
            setStrokes(prevStrokes => [...prevStrokes, { x, y, isDrawing: drawing, color }]);

            context.lineWidth = 5;
            context.lineCap = 'round';
            context.strokeStyle = color;

            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);
        };

        const preventScroll = (event: TouchEvent) => {
            if (event.target === canvas) {
                event.preventDefault();
            }
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchend', endDrawing);
        canvas.addEventListener('touchmove', draw);
        //on exit of the canvas, stop drawing
        canvas.addEventListener('mouseleave', endDrawing);
        //on enter of the canvas, evaluate if the mouse is down and start drawing
        canvas.addEventListener('mouseenter', (event) => {
            if (event.buttons === 1) {
                startDrawing(event);
            }
        }
        );
        document.body.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mouseup', endDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchend', endDrawing);
            canvas.removeEventListener('touchmove', draw);
            document.body.removeEventListener('touchmove', preventScroll);
        };
    }, [color]);

    return (
        <div>
            <input type="color" id="color" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
            
            <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black', width:'100%', aspectRatio: '1/1' }} />
            
            <button onClick={() => console.log(strokes)}>Log Strokes</button>
        </div>
    );
};

export default Canvas;
