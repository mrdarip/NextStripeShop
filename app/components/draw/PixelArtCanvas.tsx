"use client";

import React, { useState } from 'react';
import styles from './Canvas.module.css';

const PixelArtCanvas: React.FC = () => {
    const [grid, setGrid] = useState<string[][]>(Array(16).fill(Array(16).fill('white')));
    const [selectedColor, setSelectedColor] = useState<string>('black');

    const handleCellClick = (row: number, col: number) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            newGrid[row][col] = selectedColor;
            return newGrid;
        });
    };

    return (
        <div className={styles.pixelArtWrapper}>
            <div className={styles.controls}>
                <input 
                    type="color" 
                    value={selectedColor} 
                    onChange={(e) => setSelectedColor(e.target.value)} 
                    className={styles.colorPicker}
                />
            </div>
            <div className={styles.pixelGrid}>
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.pixelRow}>
                        {row.map((color, colIndex) => (
                            <div 
                                key={colIndex} 
                                className={styles.pixelCell} 
                                style={{ backgroundColor: color }} 
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PixelArtCanvas;