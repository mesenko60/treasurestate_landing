import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtag from '../lib/gtag'
import GlobalSchema from '../components/GlobalSchema'
import MobileBottomNav from '../components/MobileBottomNav'
import PWAInstallPrompt from '../components/PWAInstallPrompt'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    gtag.initScrollTracking()
    gtag.initReadTracking()
    gtag.initOutboundTracking()

    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
      gtag.resetScrollTracking()
      gtag.clearReadTracking()
      gtag.initReadTracking()
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
      gtag.clearReadTracking()
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Treasure State" />
        <meta property="og:locale" content="en_US" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" href="/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/opensans-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="stylesheet" href="/css/modern-style.css" />
        <style dangerouslySetInnerHTML={{ __html: `
body{font-family:'Arial',sans-serif;margin:0;padding:0;background-color:#f4f4f4;color:#333;line-height:1.6;font-size:16px;overflow-x:hidden}
.hero-section{position:relative;height:70vh;min-height:400px;color:#fff;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;overflow:hidden}
header.hero-section.hero-section--small{height:35vh!important;min-height:200px!important}
.hero-image{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;filter:brightness(0.6)}
.hero-image--small{height:100%;min-height:180px}
.hero-text{z-index:1;width:100%;max-width:1000px;box-sizing:border-box;padding:2rem;text-align:center}
.hero-text--small h1{font-size:2rem}
.hero-text--small p{font-size:1rem}
.hero-text h1{font-size:3rem;line-height:1.1;margin-bottom:0.5rem;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.7);text-align:center}
.hero-text p{font-size:1.5rem;text-shadow:1px 1px 3px rgba(0,0,0,0.7);text-align:center;max-width:40rem;margin-left:auto;margin-right:auto;line-height:1.45}
@media(min-width:1200px){.hero-section--small .hero-text h1{white-space:normal}}
main{max-width:960px;margin:2rem auto;padding:0 1rem}
.content-section{background-color:#fff;padding:2rem;margin-bottom:2rem;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
.content-section h2{font-size:2rem;color:#2c3e50;margin-bottom:1rem;text-align:center;border-bottom:2px solid #e0e0e0;padding-bottom:0.5rem}
footer{background-color:#2c3e50;color:#fff;text-align:center;padding:1.5rem 0;font-size:0.9rem}
footer p{margin:0.3rem 0}
.banner-section{min-height:90px;background-color:#fff;padding:1rem;margin-bottom:2rem;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);text-align:center}
@media(max-width:768px){.hero-text h1{font-size:2.5rem}.hero-text p{font-size:1.2rem}.content-section h2{font-size:1.8rem}main{margin:1rem auto}}
@media(max-width:480px){.hero-text h1{font-size:2rem}.hero-text p{font-size:1rem}.content-section{padding:1.5rem}.content-section h2{font-size:1.5rem}}
        ` }} />
      </Head>

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              content_group: (function() {
                var p = window.location.pathname;
                if (p === '/') return 'home';
                if (p === '/montana-towns' || p === '/montana-towns/') return 'directory';
                if (/^\\/montana-towns\\/[^/]+\\/[^/]+/.test(p)) return 'topic';
                if (/^\\/montana-towns\\/[^/]+/.test(p)) return 'hub';
                if (/^\\/guides\\//.test(p)) return 'guide';
                if (p === '/best-of' || p === '/best-of/') return 'rankings_index';
                if (/^\\/best-of\\//.test(p)) return 'ranking';
                if (p === '/compare' || p === '/compare/') return 'compare_tool';
                if (/^\\/compare\\//.test(p)) return 'comparison';
                return 'other';
              })(),
            });
          `,
        }}
      />

      <GlobalSchema />
      <Component {...pageProps} />
      <MobileBottomNav />
      <PWAInstallPrompt />
    </>
  )
}
