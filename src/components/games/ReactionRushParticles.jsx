import React, { useState, useEffect, useRef } from "react";

const ReactionRushParticles = ({
  particles = [],
  particleType = "spark",
  onParticleComplete = () => {},
}) => {
  const [activeParticles, setActiveParticles] = useState([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (particles.length > 0) {
      setActiveParticles((prev) => [...prev, ...particles]);
    }
  }, [particles]);

  useEffect(() => {
    const animate = () => {
      setActiveParticles((prevParticles) => {
        const updatedParticles = prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY,
            velocityY: particle.velocityY + particle.gravity,
            life: particle.life - 1,
            opacity: Math.max(0, particle.life / particle.maxLife),
            scale: particle.scale * (particle.life / particle.maxLife),
          }))
          .filter((particle) => particle.life > 0);

        // Call completion callback for finished particles
        const finishedParticles = prevParticles.filter(
          (p) =>
            p.life <= 1 &&
            // eslint-disable-next-line no-mixed-operators
            updatedParticles.find((up) => up.id === p.id)?.life > 0 === false
        );
        finishedParticles.forEach((p) => onParticleComplete(p));

        return updatedParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (activeParticles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeParticles.length, onParticleComplete]);

  const getParticleStyle = (particle) => {
    const baseStyle = {
      position: "absolute",
      left: particle.x - particle.size / 2,
      top: particle.y - particle.size / 2,
      width: particle.size,
      height: particle.size,
      opacity: particle.opacity,
      transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
      pointerEvents: "none",
      zIndex: 1500,
    };

    switch (particleType) {
      case "juice":
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${particle.color}80 0%, ${particle.color}40 50%, transparent 100%)`,
          borderRadius: "50%",
          filter: `blur(1px)`,
        };
      case "explosion":
        return {
          ...baseStyle,
          background: particle.color,
          borderRadius: "2px",
          filter: `drop-shadow(0 0 3px ${particle.color})`,
        };
      case "spark":
      default:
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: `drop-shadow(0 0 2px ${particle.color})`,
        };
    }
  };

  return (
    <div className="particles-container">
      {activeParticles.map((particle) => (
        <div
          key={particle.id}
          style={getParticleStyle(particle)}
          className={`particle particle-${particleType}`}
        />
      ))}
    </div>
  );
};

export default ReactionRushParticles;
