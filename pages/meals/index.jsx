import { useState } from "react"
import {
  Group,
  Button,
  ActionIcon,
  TextInput,
  NavLink,
  Container,
  Title,
} from "@mantine/core"
import useGetMeals from "../../hooks/useGetMeals"
import { db } from "../../firebase"
import { doc, setDoc } from "firebase/firestore"
import { useAuthContext } from "../../context/AuthContext"
import { IconSearch, IconArrowRight, IconChevronRight } from "@tabler/icons"
import Link from "next/link"

function meals() {
  const { docs: meals } = useGetMeals()
  const [query, setQuery] = useState(null)
  const { currentUser } = useAuthContext()

  const newMeal = async (e) => {
    e.preventDefault()
    await setDoc(doc(db, `users/${currentUser.uid}/meals/${query}`), {
      name: query,
    })
  }

  return (
    <Container size="sm">
      <Title mt={"md"} align="center">
        Your Meals
      </Title>

      <div>
        <form onSubmit={newMeal}>
          <Group mt={"md"}>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              type="submit"
            >
              New Meal +
            </Button>

            <TextInput
              icon={<IconSearch size={18} stroke={1.5} />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              radius="xl"
              size="md"
              rightSection={
                <ActionIcon
                  size={32}
                  radius="xl"
                  variant="filled"
                  className="bg-blue-500"
                >
                  <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
              }
              placeholder="Meal name..."
              rightSectionWidth={42}
              required={true}
            />
          </Group>
        </form>
        <ul>
          {meals &&
            meals.map((meal) => (
              <Link href={`/meals/${meal.name}`}>
                <NavLink
                  label={`${meal.name}`}
                  rightSection={<IconChevronRight size={12} stroke={1.5} />}
                  className="bg-blue-500 rounded-md text-white hover:bg-blue-600"
                  mt={"md"}
                />
              </Link>
            ))}
        </ul>
      </div>
    </Container>
  )
}

export default meals
