import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedSwitch } from 'react-router-transition';

const fadeAndSlideUp = y => ({
  '0%': {
    transform: `translateY(${y}px)`,
    opacity: 0,
  },

  '100%': {
    transform: 'translateY(0)',
    opacity: 1,
  },
});

const fadeAndScaleIn = scale => ({
  '0%': {
    transform: `scale(${scale})`,
    opacity: 0,
  },

  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
});

/* common animations used in the application */
export const keyframes = {
  fadeAndSlideUp: ({ y = 20, speed = 0.5, delay = 0 }) => ({
    opacity: 0,
    animationName: fadeAndSlideUp(y),
    animationDuration: `${speed}s`,
    animationDelay: `${delay}s`,
    animationFillMode: 'forwards',
    animationTimingFunction: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
  }),
  fadeAndScaleIn: ({ scale = 0, speed = 0.5, delay = 0 }) => ({
    opacity: 0,
    animationName: fadeAndScaleIn(scale),
    animationDuration: `${speed}s`,
    animationDelay: `${delay}s`,
    animationFillMode: 'forwards',
    animationTimingFunction: 'cubic-bezier(0.175,  0.885, 0.320, 1.275)',
  }),
};

/* screen transitions used by React Router Transition */
export const verticalTransitionStyle = transition => ({
  transform: `translate(0, ${transition.offset}px)`,
  opacity: transition.opacity,
});

export const pushTransitionStyle = transition => ({
  transform: transition.offset !== 0 ? `translateX(${transition.offset}px)` : null,
  opacity: transition.opacity,
});

export const VerticalAnimatedSwitch = props => {
  return (
    <AnimatedSwitch
      atEnter={{ opacity: 0, offset: window.innerHeight }}
      atLeave={{ opacity: 0, offset: -window.innerHeight * 0.25 }}
      atActive={{ opacity: 1, offset: 0 }}
      mapStyles={verticalTransitionStyle}
      className='route-wrapper'>
      {props.children}
    </AnimatedSwitch>
  );
};

export const HorizontalAnimatedSwitch = props => {
  return (
    <AnimatedSwitch
      atEnter={{ opacity: 1, offset: window.innerWidth }}
      atLeave={{ opacity: 0, offset: -window.innerWidth * 0.75 }}
      atActive={{ opacity: 1, offset: 0 }}
      mapStyles={pushTransitionStyle}
      className='route-wrapper'>
      {props.children}
    </AnimatedSwitch>
  );
};

VerticalAnimatedSwitch.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.element])
    .isRequired,
};

HorizontalAnimatedSwitch.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.element])
    .isRequired,
};
