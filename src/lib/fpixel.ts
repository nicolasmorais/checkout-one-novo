
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export const pageview = () => {
  window.fbq('track', 'PageView')
}

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name: string, options = {}) => {
  window.fbq('track', name, options)
}

// Add a declaration for the fbq function to the window object
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

// Initializes the Facebook Pixel
export const init = (pixelId: string) => {
    if (window.fbq) {
        window.fbq('init', pixelId);
    }
}
