import { useState } from "react"
import {
  Group,
  Button,
  ActionIcon,
  TextInput,
  NavLink,
  Container,
  Title,
  ScrollArea,
} from "@mantine/core"
import useGetMeals from "../../hooks/useGetMeals"
import { db } from "../../firebase"
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"
import { useAuthContext } from "../../context/AuthContext"
import {
  IconSearch,
  IconArrowRight,
  IconChevronRight,
  IconTrash,
} from "@tabler/icons"
import Link from "next/link"
import withAuth from "../../middlewares/withAuth"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function meals() {
  const { docs: meals } = useGetMeals()
  const [query, setQuery] = useState("")
  const { currentUser } = useAuthContext()

  const newMeal = async (e) => {
    e.preventDefault()

    const checkMeal = await getDoc(
      doc(db, `users/${currentUser.uid}/meals/${query}`)
    )
    if (checkMeal.exists()) {
      toast.error(`❌ This meal already exists`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    } else {
      await setDoc(doc(db, `users/${currentUser.uid}/meals/${query}`), {
        name: query,
      })
    }
  }

  const deleteMeal = async (meal) => {
    await deleteDoc(doc(db, "users", `${currentUser.uid}`, "meals", `${meal}`))
  }

  return (
    <Container size="sm">
      <Title mt={"md"} align="center">
        Your Meals
      </Title>

      <div>
        <form onSubmit={newMeal}>
          <Group mt={"md"}>
            <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
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
        <ScrollArea mt={"md"} type={"auto"} style={{ height: "50vh" }}>
          {meals && (
            <ul>
              {meals.map((meal) => (
                <Group className="align-middle mt-5">
                  <Link
                    className="bg-blue-500 p-2 rounded-md text-white w-11/12 hover:bg-blue-600"
                    href={`/meals/${meal.name}`}
                  >
                    <li>{meal.name}</li>
                  </Link>

                  <ActionIcon onClick={() => deleteMeal(meal.name)}>
                    <IconTrash />
                  </ActionIcon>
                </Group>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>

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
      {/* Same as */}
      <ToastContainer />
    </Container>
  )
}

export default withAuth(meals)
