
'use client';

// Declaração para a interface global do Window
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

// Função para inicializar o pixel do Facebook
export const init = (pixelId: string) => {
  if (window.fbq) {
    console.log("FB Pixel already initialized.");
    return;
  }
  // Cria a função fbq e a fila de eventos se não existirem
  const fbq = function(...args: any[]) {
    // @ts-ignore
    (fbq.queue = fbq.queue || []).push(args);
  };
  window.fbq = fbq as any;
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};


// Função para disparar um evento de PageView
export const pageview = () => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Função para disparar um evento customizado
export const event = (name: string, options = {}) => {
  if (window.fbq) {
    window.fbq('track', name, options);
  }
};
