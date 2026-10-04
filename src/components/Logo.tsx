import React from 'react'

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
      <svg
        viewBox="0 0 860 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '140px',
          height: 'auto',
          display: 'block',
          color: 'var(--theme-text, #ffffff)',
        }}
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M812.246 1.56348L780.009 88.4476H792.473L799.184 69.6327L802.899 59.2066L818.957 13.907L835.256 59.2066L839.091 69.6327L845.922 88.4476H859.104L826.388 1.56348H812.246Z" fill="currentColor" />
        <path d="M708.681 1.56348L676.755 88.4476H663.552L695.479 1.56348H708.681Z" fill="currentColor" />
        <path d="M559.278 1.56348H571.502V88.4476H559.278V49.0202H513.619V88.4476H501.395V1.56348H513.619V38.4743H559.278V1.56348Z" fill="currentColor" />
        <path d="M393.199 60.759H405.063C401.228 79.9334 386.248 90 367.433 90C342.507 90 328.006 71.3049 328.006 44.8202C328.006 17.8562 343.825 0 368.392 0C386.368 0 400.869 10.6658 404.584 29.241H392.72C390.083 18.4554 381.694 10.3063 367.793 10.3063C352.453 10.3063 340.469 22.2903 340.469 44.8202C340.469 66.751 351.974 79.6937 368.152 79.6937C381.934 79.6937 390.443 71.9041 393.199 60.759Z" fill="currentColor" />
        <path d="M219.192 88.4476L200.377 51.7765C198.22 51.8964 196.063 51.8964 193.786 51.8964H178.447V88.4476H166.223V1.56348H193.786C214.998 1.56348 229.978 5.75788 229.978 26.6101C229.978 40.3917 223.387 46.9829 212.721 49.8591L232.854 88.4476H219.192ZM194.745 11.8697H178.447V41.5901H194.745C207.448 41.5901 217.395 40.2719 217.395 26.8498C217.395 13.4277 207.448 11.8697 194.745 11.8697Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M32.237 1.56348L0 88.4476H12.4634L19.1744 69.6327L22.8895 59.2066L38.9481 13.907L55.2463 59.2066L59.0812 69.6327L65.9121 88.4476H79.0946L46.3782 1.56348H32.237Z" fill="currentColor" />
      </svg>
      <span
        style={{
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--theme-elevation-500, #888)',
          borderLeft: '1px solid var(--theme-elevation-200, rgba(255,255,255,0.15))',
          paddingLeft: '12px',
          lineHeight: '1.2',
        }}
      >
        Studio CMS
      </span>
    </div>
  )
}

export default Logo
