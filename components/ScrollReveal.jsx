'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  threshold = 0.1,
  triggerOnce = true,
  delay = 0,
  className = '',
  ...props
}) {
  const [ref, isVisible] = useScrollAnimation(threshold, triggerOnce);

  const animationClasses = {
    'fade-up': 'scroll-hidden',
    'fade-down': 'scroll-hidden-up',
    'fade-left': 'scroll-hidden-left',
    'fade-right': 'scroll-hidden-right',
    'scale': 'scroll-hidden-scale',
    'slide-left': 'scroll-hidden-left',
    'bounce': 'scroll-hidden-scale',
  };

  const visibleClasses = {
    'fade-up': 'scroll-visible',
    'fade-down': 'scroll-visible-up',
    'fade-left': 'scroll-visible-left',
    'fade-right': 'scroll-visible-right',
    'scale': 'scroll-visible-scale',
    'slide-left': 'scroll-visible-left',
    'bounce': 'scroll-visible-scale',
  };

  const baseClass = animationClasses[animation] || 'scroll-hidden';
  const visibleClass = visibleClasses[animation] || 'scroll-visible';

  return (
    <div
      ref={ref}
      className={`${baseClass} ${isVisible ? visibleClass : ''} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}s` : undefined,
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
