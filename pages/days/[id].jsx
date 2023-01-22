import {
  arrayUnion,
  doc,
  increment,
  updateDoc,
  arrayRemove,
} from "@firebase/firestore"
import {
  Accordion,
  ActionIcon,
  Box,
  Card,
  Container,
  Group,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { IconArrowRight, IconSearch, IconTrash } from "@tabler/icons"
import { useRouter } from "next/router"
import { useState } from "react"
import FoodArticle from "../../Components/FoodArticle"
import { db } from "../../firebase"
import useGetDay from "../../hooks/useGetDay"
import FoodAPI from "../../services/FoodAPI"
import { useAuthContext } from "../../context/AuthContext"
import BackButton from "../../Components/BackButton"
import withAuth from "../../middlewares/withAuth"
import useGetUser from "../../hooks/useGetUser"
import { AnimatePresence } from "framer-motion"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, toast } from "react-toastify"

const Day = () => {
  const router = useRouter()
  const { id } = router.query
  const { currentUser } = useAuthContext()
  const { docs: day } = useGetDay(id)
  const [query, setQuery] = useState("")
  const [foodData, setFoodData] = useState()
  const { data: userGoal } = useGetUser(currentUser.uid)

  const addProduct = async (name, srv, c, p, f, s) => {
    const dayRef = doc(db, "users", `${currentUser.uid}`, "days", `${id}`)
    try {
      await updateDoc(dayRef, {
        products: arrayUnion({
          name,
          serving_size: srv,
          calories: c,
          protein: p,
          fat: f,
          sugar: s,
        }),

        "total.calories": increment(c),
        "total.protein": increment(p),
        "total.fat": increment(f),
        "total.sugar": increment(s),
      })

      setFoodData(null)
    } catch (err) {
      toast.error(`❌ ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = await FoodAPI.getFoodData(query)
    setFoodData(data)
  }

  const clearData = () => {
    setFoodData(null)
  }

  const deleteProduct = async (prod) => {
    const dayRef = doc(db, "users", `${currentUser.uid}`, "days", `${id}`)
    await updateDoc(dayRef, {
      products: arrayRemove(prod),

      "total.calories": increment(-prod.calories),
      "total.protein": increment(-prod.protein),
      "total.fat": increment(-prod.fat),
      "total.sugar": increment(-prod.sugar),
    })
  }

  return (
    <Container mt={"md"}>
      <Title mb={"sm"} className="text-blue-500">
        {day && day.id}
      </Title>
      <Group>
        <BackButton />
        <form onSubmit={handleSubmit}>
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
                className="bg-blue-500 hover:bg-blue-600"
                type="submit"
              >
                <IconArrowRight size={18} stroke={1.5} />
              </ActionIcon>
            }
            placeholder="Add products"
            rightSectionWidth={42}
          />
        </form>
      </Group>
      <Group mt={"lg"}>
        <AnimatePresence>
          {foodData?.map((f) => (
            <FoodArticle
              key="food"
              food={f}
              clear={clearData}
              add={() =>
                addProduct(
                  f.name,
                  Math.ceil(f.serving_size_g),
                  Math.ceil(f.calories),
                  Math.ceil(f.protein_g),
                  Math.ceil(f.fat_total_g),
                  Math.ceil(f.sugar_g)
                )
              }
            />
          ))}
        </AnimatePresence>
      </Group>
      <div>
        {day && (
          <>
            <Group position="apart">
              <div>
                <Title mt={"lg"}>Producuts</Title>
                <ScrollArea type="auto" style={{ height: "30vh" }}>
                  <Accordion sx={{ minWidth: "400px" }}>
                    {day.products &&
                      day.products.map((p) => (
                        <Accordion.Item key={p.name} value={p.name}>
                          <Accordion.Control>{p.name}</Accordion.Control>
                          <Accordion.Panel>
                            <ul>
                              <li>
                                <strong>Serving size: </strong>
                                {p.serving_size}g
                              </li>
                              <li>
                                <strong>Calories: </strong>
                                {p.calories}
                              </li>
                              <li>
                                <strong>Protein: </strong>
                                {p.protein}g
                              </li>
                              <li>
                                <strong>Fat: </strong>
                                {p.fat}g
                              </li>
                              <li>
                                <strong>Sugar: </strong>
                                {p.sugar}g
                              </li>
                            </ul>

                            <ActionIcon onClick={() => deleteProduct(p)}>
                              <IconTrash />
                            </ActionIcon>
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                </ScrollArea>
              </div>
              {userGoal.calorie_goal && day.total && (
                <Card
                  withBorder
                  radius="md"
                  p="xl"
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white,

                    minWidth: "400px",
                  })}
                >
                  <Text
                    size="xs"
                    transform="uppercase"
                    weight={700}
                    color="dimmed"
                  >
                    Daily Goal
                  </Text>
                  <Text size="lg" weight={500}>
                    {day.total.calories} / {userGoal.calorie_goal}
                  </Text>
                  <Progress
                    value={Math.ceil(
                      (day.total.calories / userGoal.calorie_goal) * 100
                    )}
                    mt="md"
                    size="lg"
                    radius="xl"
                  />
                </Card>
              )}
            </Group>

            <Box mt={"lg"}>
              <Title>Total</Title>
              {day.total && (
                <SimpleGrid
                  cols={4}
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <Paper withBorder radius="md" p="xs">
                    <Group>
                      <div>
                        <Text
                          color="dimmed"
                          size="xs"
                          transform="uppercase"
                          weight={700}
                        >
                          Calories
                        </Text>
                        <Text weight={700} size="xl">
                          {day.total.calories}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                  <Paper withBorder radius="md" p="xs">
                    <Group>
                      <div>
                        <Text
                          color="dimmed"
                          size="xs"
                          transform="uppercase"
                          weight={700}
                        >
                          Protein
                        </Text>
                        <Text weight={700} size="xl">
                          {day.total.protein}g
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                  <Paper withBorder radius="md" p="xs">
                    <Group>
                      <div>
                        <Text
                          color="dimmed"
                          size="xs"
                          transform="uppercase"
                          weight={700}
                        >
                          Fat
                        </Text>
                        <Text weight={700} size="xl">
                          {day.total.fat}g
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                  <Paper withBorder radius="md" p="xs">
                    <Group>
                      <div>
                        <Text
                          color="dimmed"
                          size="xs"
                          transform="uppercase"
                          weight={700}
                        >
                          Sugar
                        </Text>
                        <Text weight={700} size="xl">
                          {day.total.sugar}g
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                </SimpleGrid>
              )}
            </Box>
          </>
        )}
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

export default withAuth(Day)
