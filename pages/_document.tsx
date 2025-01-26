import Document, { Html, Head, Main, NextScript } from 'next/document';
import { SpeedInsights } from "@vercel/speed-insights/next"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">{/* TODO: change lang */}
        <Head>
          {/* TODO: add meta tags, fonts, or other head elements here */}
        </Head>
        <body>
          <Main />
          <NextScript />
          <SpeedInsights />
        </body>
      </Html>
    );
  }
}

export default MyDocument;