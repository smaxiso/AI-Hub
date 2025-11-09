import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

/**
 * SafeHTML component that sanitizes HTML content before rendering
 * Uses DOMPurify to prevent XSS attacks
 */
const SafeHTML = ({ html, allowedTags, allowedAttributes, component: Component = 'div', ...props }) => {
  const sanitizedHTML = React.useMemo(() => {
    const config = {
      ALLOWED_TAGS: allowedTags || ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'span'],
      ALLOWED_ATTR: allowedAttributes || ['href', 'title', 'target', 'rel', 'class'],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'], // Allow target for links
      ADD_TAGS: [], // Additional tags if needed
    };

    return DOMPurify.sanitize(html, config);
  }, [html, allowedTags, allowedAttributes]);

  return (
    <Component 
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }} 
    />
  );
};

SafeHTML.propTypes = {
  html: PropTypes.string.isRequired,
  allowedTags: PropTypes.arrayOf(PropTypes.string),
  allowedAttributes: PropTypes.arrayOf(PropTypes.string),
  component: PropTypes.elementType,
};

SafeHTML.defaultProps = {
  allowedTags: undefined,
  allowedAttributes: undefined,
  component: 'div',
};

export default React.memo(SafeHTML);
