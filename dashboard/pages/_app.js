import '../styles/globals.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const { locale } = router

  useEffect(() => {
    // Set HTML dir attribute for RTL support
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale])

  return <Component {...pageProps} />
}
