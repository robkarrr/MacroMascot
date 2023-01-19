import {
  arrayUnion,
  doc,
  FieldValue,
  increment,
  updateDoc,
} from "@firebase/firestore"
import {
  ActionIcon,
  Button,
  Container,
  Group,
  TextInput,
  Title,
} from "@mantine/core"
import { IconArrowRight, IconChevronLeft, IconSearch } from "@tabler/icons"
import { useRouter } from "next/router"
import { useState } from "react"
import FoodArticle from "../../Components/FoodArticle"
import { db } from "../../firebase"
import useGetDay from "../../hooks/useGetDay"
import FoodAPI from "../../services/FoodAPI"
import { useAuthContext } from "../../context/AuthContext"
import BackButton from "../../Components/BackButton"

const day = () => {
  const router = useRouter()
  const { id } = router.query
  const { currentUser } = useAuthContext()
  const { docs: day } = useGetDay(id)
  const [query, setQuery] = useState("")
  const [foodData, setFoodData] = useState()

  const addProduct = async (name, srv, c, p, f, s) => {
    const dayRef = doc(db, "users", `${currentUser.uid}`, "days", `${id}`)
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
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = await FoodAPI.getFoodData(query)
    setFoodData(data)
  }

  const clearData = () => {
    setFoodData(null)
  }

  console.log(day)

  return (
    <Container mt={"md"}>
      <Title mb={"sm"} className="text-blue-500">
        {day && day.id}
      </Title>
      <Group>
        <BackButton/>
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
      <div>
        {foodData?.map((f) => (
          <FoodArticle
            food={f}
            clear={clearData}
            add={() =>
              addProduct(
                f.name,
                f.serving_size_g,
                f.calories,
                f.protein_g,
                f.fat_total_g,
                f.sugar_g
              )
            }
          />
        ))}
      </div>
      <div>
        {day && (
          <>
            <div>
              <p>Producuts</p>
              {day.products && (
                <ul>
                  {day.products.map((p) => (
                    <li>{p.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p>Total</p>
              {day.total && (
                <ul>
                  <li>{day.total.calories}</li>
                  <li>{day.total.protein}</li>
                  <li>{day.total.fat}</li>
                  <li>{day.total.sugar}</li>
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

export default day
