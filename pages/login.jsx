import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core"
import Link from "next/link"
import Router from "next/router"
import { useRef, useState } from "react"
import {
  ScaleLoader,
} from "react-spinners"
import { useAuthContext } from "../context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [loading, setLoading] = useState(false)
  const { login } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      Router.push("/")
    } catch (err) {
      toast.error(`${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })

      setLoading(false)
    }
  }
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Link
          href="/register"
          size="sm"
          className="text-blue-500 hover:underline"
        >
          Create account
        </Link>
      </Text>

      <form onSubmit={handleSubmit}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            ref={emailRef}
            label="Email"
            placeholder="you@mantine.dev"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            ref={passwordRef}
          />
          <Group position="apart" mt="lg">
            <Anchor
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Group position="center">
            {loading ? (
              <ScaleLoader
                color={"#3b82f6"}
                loading={loading}
                cssOverride={{
                  display: "block",
                  maring: "0 auto",
                  borderColor: "red",
                }}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <Button
                className="bg-blue-500 text-white hover:text-black"
                variant="default"
                fullWidth
                mt="xl"
                type="submit"
              >
                Sign in
              </Button>
            )}
          </Group>
        </Paper>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Container>
  )
}

export default Login
