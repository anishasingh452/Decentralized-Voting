import React from 'react';
import './aurora-background.css';

export const AuroraBackground = ({
    children,
    showRadialGradient = true,
    className = ""
}) => {
    return (
        <div className={`aurora-container ${className}`}>
            <div className="aurora-wrapper">
                <div
                    className={`aurora-effect ${showRadialGradient ? 'radial-mask' : ''}`}
                />
            </div>
            <div className="aurora-content">
                {children}
            </div>
        </div>
    );
};
