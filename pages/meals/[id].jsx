import { arrayUnion, doc, updateDoc } from "@firebase/firestore"
import { ActionIcon, Container, Group, TextInput, Title } from "@mantine/core"
import { IconArrowRight, IconSearch } from "@tabler/icons"
import { useRouter } from "next/router"
import { useState } from "react"
import FoodArticle from "../../Components/FoodArticle"
import FoodAPI from "../../services/FoodAPI"
import useGetMeal from "../../hooks/useGetMeal"
import { db } from "../../firebase"
import { useAuthContext } from "../../context/AuthContext"
import BackButton from '../../components/BackButton'

function meal() {
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

  const AddToMeal = async (name, srv, p, c, f, s) => {
    const mealRef = doc(db, "users", `${currentUser.uid}`, "meals", `${id}`)
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
  }

  return (
    <Container>
       <Title mb={"sm"} className="text-blue-500">
        {meal && meal.name}
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
              AddToMeal(
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
        {meal && (
          <>
            <p>{meal?.name}</p>
            <ul>
              {meal.products?.map((p) => (
                <li>{p.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Container>
  )
}

export default meal
