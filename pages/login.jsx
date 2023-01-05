import {
  TextInput,
  PasswordInput,
  Checkbox,
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
import { useRef, useState } from 'react'
import { useAuthContext } from '../context/AuthContext'

function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      Router.push("/")
    } catch (err) {
      setError(err.message)
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
          <TextInput ref={emailRef} label="Email" placeholder="you@mantine.dev" required />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            ref={passwordRef}
          />
          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
            <Anchor
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button
            className="bg-blue-500 text-white hover:text-black"
            variant="default"
            fullWidth
            mt="xl"
            type="submit"
          >
            Sign in
          </Button>
        </Paper>
      </form>

      {loading && <p>Loading...</p>}
    </Container>
  )
}

export default Login
