import PropTypes from 'prop-types';
import SVG_SPRITES from '../data/svgSprites.js';

function SvgIcon({ name, className = '', size = 24, color = 'currentColor', ...props }) {
  const svgContent = SVG_SPRITES[name];

  if (!svgContent) {
    console.warn(`SVG icon "${name}" not found`);
    return null;
  }

  return (
    <div
      className={`svg-icon ${className}`}
      style={{
        width: size,
        height: size,
        color,
        display: 'inline-block',
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  );
}

SvgIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};

export default SvgIcon;
