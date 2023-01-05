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
import { useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Router from 'next/router'
  
  function Register() {
    const nameRef = useRef();
    const lastnameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
    const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { signup } = useAuthContext();


    const handleSubmit = async (e) => {
		e.preventDefault();

		//checks for matching passwords
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("The passwords does not match");
		}

		setError(null);
		try {
			setLoading(true);
			await signup(
				emailRef.current.value,
				passwordRef.current.value,
				lastnameRef.current.value,
				nameRef.current.value,
                );

			Router.push("/");

			setLoading(false);
		} catch (err) {
			setError(err.message);
			setLoading(false);
			console.log(err);
		}
	};


    return (
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome to MacroMascot!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already registerd?{" "}
          <Link href="/login" size="sm" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </Text>
  
        <form onSubmit={handleSubmit}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput ref={emailRef} label="Email" placeholder="you@mantine.dev" required />
            <PasswordInput
                label="Password"
                ref={passwordRef}
                placeholder="Your password"
                required
                mt="md"
            />
            <PasswordInput
                label="Confirm Password"
                ref={passwordConfirmRef}
                placeholder="Enter password again"
                required
                mt="md"
            />
            <TextInput ref={nameRef} label="First Name" placeholder="Name..." required mt="md" />
            <TextInput ref={lastnameRef} label="Last Name" placeholder="Lastname..." required mt="md" />
            <Button type="submit" className="bg-blue-500 text-white hover:text-black" variant="default"  fullWidth mt="xl">
                Sign Up!
            </Button>
            </Paper>
        </form>
        {loading && (
				<div>
					Loading...
				</div>
			)}

      </Container>
    )
  }
  
  export default Register
  