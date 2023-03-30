import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "@firebase/firestore"
import {
  Accordion,
  ActionIcon,
  Box,
  Container,
  Group,
  Paper,
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
import FoodAPI from "../../services/FoodAPI"
import useGetMeal from "../../hooks/useGetMeal"
import { db } from "../../firebase"
import { useAuthContext } from "../../context/AuthContext"
import BackButton from '../../Components/BackButton'
import withAuth from "../../middlewares/withAuth"
import { AnimatePresence } from "framer-motion"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


function Meal() {
  const router = useRouter()
  const { id } = router.query
  const [query, setQuery] = useState("")
  const [foodData, setFoodData] = useState()
  const { docs: meal } = useGetMeal(id)
  const { currentUser } = useAuthContext()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = await FoodAPI.getFoodData(query)
    setFoodData(data)
    console.log(data)
  }

  const clearData = () => {
    setFoodData(null)
  }

  const addProduct = async (name, srv, c, p, f, s) => {
    const mealRef = doc(db, "users", `${currentUser.uid}`, "meals", `${id}`)

    try {
      await updateDoc(mealRef, {
        products: arrayUnion({
          name,
          serving_size: srv,
          calories: c,
          protein: p,
          fat: f,
          sugar: s,
        }),
      })

      setFoodData(null)
      const docSnap = await getDoc(mealRef)
      const products = docSnap.data().products
      await updateDoc(mealRef, {
        "total.calories": products.reduce((total, product) => total + product.calories, 0),
        "total.protein": products.reduce((total, product) => total + product.protein, 0),
        "total.fat": products.reduce((total, product) => total + product.fat, 0),
        "total.sugar": products.reduce((total, product) => total + product.sugar, 0),
      })
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

  const deleteProduct = async (prod) => {
    const mealRef = doc(db, "users", `${currentUser.uid}`, "meals", `${id}`)

    try {
      await updateDoc(mealRef, {
        products: arrayRemove(prod),
      })

      const docSnap = await getDoc(mealRef)
      const products = docSnap.data().products
      await updateDoc(mealRef, {
        "total.calories": products.reduce((total, product) => total + product.calories, 0),
        "total.protein": products.reduce((total, product) => total + product.protein, 0),
        "total.fat": products.reduce((total, product) => total + product.fat, 0),
        "total.sugar": products.reduce((total, product) => total + product.sugar, 0),
      })
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

  return (
    <Container>
      <Title mb={"sm"} className="text-blue-500">
        {meal && meal.name}
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
              >
                <IconArrowRight size={18} stroke={1.5} />
              </ActionIcon>
            }
            placeholder="Search questions"
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
        {meal && (
          <>
            <Group position="apart">
              <div>
                <Title mt={"md"}>Products</Title>
                <ScrollArea type="auto" style={{ height: "40vh" }}>
                  <Accordion sx={{ minWidth: "400px" }}>
                    {meal.products &&
                      meal.products.map((m) => (
                        <Accordion.Item key={m.name} value={m.name}>
                          <Accordion.Control>{m.name}</Accordion.Control>
                          <Accordion.Panel>
                            <ul>
                              <li>
                                <strong>Serving size: </strong>
                                {m.serving_size}g
                              </li>
                              <li>
                                <strong>Calories: </strong>
                                {m.calories}
                              </li>
                              <li>
                                <strong>Protein: </strong>
                                {m.mrotein}g
                              </li>
                              <li>
                                <strong>Fat: </strong>
                                {m.fat}g
                              </li>
                              <li>
                                <strong>Sugar: </strong>
                                {m.sugar}g
                              </li>
                            </ul>

                            <ActionIcon onClick={() => deleteProduct(m)}>
                              <IconTrash />
                            </ActionIcon>
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                </ScrollArea>
              </div>
              <Box mt={"lg"}>
                <Title>Total</Title>
                {meal.total && (
                  <SimpleGrid
                    sx={{ minWidth: "400px" }}
                    cols={1}
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
                            {meal.total.calories}
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
                            {meal.total.protein}g
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
                            {meal.total.fat}g
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
                            {meal.total.sugar}g
                          </Text>
                        </div>
                      </Group>
                    </Paper>
                  </SimpleGrid>
                )}
              </Box>
            </Group>
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

export default withAuth(Meal)
