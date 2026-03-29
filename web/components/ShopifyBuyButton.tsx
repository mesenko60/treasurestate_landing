import React, { useEffect, useRef } from 'react';

type ShopifyBuyButtonProps = {
  productId: string;
  shopDomain?: string; // e.g. shop.treasurestate.com
  storefrontAccessToken?: string; 
};

export default function ShopifyBuyButton({ 
  productId, 
  shopDomain = 'shop.treasurestate.com', 
  storefrontAccessToken = 'YOUR_STOREFRONT_TOKEN_HERE' // Placeholder
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any previous button renders
    containerRef.current.innerHTML = '';

    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    const loadShopify = () => {
      if ((window as any).ShopifyBuy) {
        if ((window as any).ShopifyBuy.UI) {
          ShopifyBuyInit();
        } else {
          loadScript();
        }
      } else {
        loadScript();
      }
    };

    const loadScript = () => {
      const script = document.createElement('script');
      script.async = true;
      script.src = scriptURL;
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
      script.onload = ShopifyBuyInit;
    };

    const ShopifyBuyInit = () => {
      const client = (window as any).ShopifyBuy.buildClient({
        domain: shopDomain,
        storefrontAccessToken: storefrontAccessToken,
      });

      (window as any).ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent('product', {
          id: productId,
          node: containerRef.current,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  '@media (min-width: 601px)': {
                    'max-width': 'calc(25% - 20px)',
                    'margin-left': '20px',
                    'margin-bottom': '50px'
                  }
                },
                button: {
                  'font-family': 'Montserrat, sans-serif',
                  'font-weight': 'bold',
                  'font-size': '16px',
                  'padding-top': '16px',
                  'padding-bottom': '16px',
                  'color': '#ffffff',
                  ':hover': {
                    'color': '#ffffff',
                    'background-color': '#7a4f10'
                  },
                  'background-color': '#925f14',
                  ':focus': {
                    'background-color': '#7a4f10'
                  },
                  'border-radius': '4px'
                },
                title: {
                  'color': '#204051'
                },
                price: {
                  'color': '#333333'
                }
              },
              text: {
                button: 'Add to cart'
              }
            },
            cart: {
              styles: {
                button: {
                  'font-family': 'Montserrat, sans-serif',
                  'font-weight': 'bold',
                  'font-size': '16px',
                  'padding-top': '16px',
                  'padding-bottom': '16px',
                  'color': '#ffffff',
                  ':hover': {
                    'color': '#ffffff',
                    'background-color': '#7a4f10'
                  },
                  'background-color': '#925f14',
                  ':focus': {
                    'background-color': '#7a4f10'
                  },
                  'border-radius': '4px'
                },
                title: {
                  'color': '#204051'
                }
              },
              text: {
                total: 'Subtotal',
                button: 'Checkout'
              }
            },
            toggle: {
              styles: {
                toggle: {
                  'font-family': 'Montserrat, sans-serif',
                  'background-color': '#925f14',
                  ':hover': {
                    'background-color': '#7a4f10'
                  },
                  ':focus': {
                    'background-color': '#7a4f10'
                  }
                }
              }
            }
          }
        });
      });
    };

    loadShopify();
  }, [productId, shopDomain, storefrontAccessToken]);

  return <div ref={containerRef} className="shopify-buy-button-container" style={{ margin: '2rem 0' }}></div>;
}
