import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="google-site-verification"
          content="At3RZ4YGQtXrtPbI2UKNk1aKwGJ5P7goMttGiLMTaT4"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link
          rel="apple-touch-icon"
          href="https://games-gold-nu.vercel.app/logosmall.webp"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://games-gold-nu.vercel.app/",
              logo: "https://games-gold-nu.vercel.app/logo.webp",
            }),
          }}
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
