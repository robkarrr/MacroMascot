import '../styles/globals.css'
import Layout from '../Components/Layout'
import AuthContextProvider from '../context/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  )
}
