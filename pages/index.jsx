import {
  Title,
  Text,
  Container,
  Button,
  TextInput,
  ActionIcon,
  Overlay,
  createStyles,
  Group,
} from "@mantine/core"
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons"
import { useState } from "react"
import FoodArticle from "../Components/FoodArticle"
import FoodAPI from "../services/FoodAPI"
import { useAuthContext } from "../context/AuthContext"
import moment from "moment"
import { arrayUnion, doc, increment, updateDoc } from "@firebase/firestore"
import { db } from "../firebase"
import withAuth from "../middlewares/withAuth"
import { AnimatePresence, motion } from "framer-motion"

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    height: "100vh",
    paddingTop: 180,
    backgroundImage:
      "url(https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141353.jpg?w=1480&t=st=1674345777~exp=1674346377~hmac=c3da9a8bba3708794721f22db7d9162fa3f70a9ea1cbb48b00ab546b246834a2)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    paddingBottom: 130,

    "@media (max-width: 520px)": {
      paddingTop: 80,
      paddingBottom: 50,
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: "center",

    "@media (max-width: 520px)": {
      fontSize: theme.fontSizes.md,
      textAlign: "left",
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 1.5,
    display: "flex",
    justifyContent: "center",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    "@media (max-width: 720px)": {
      flexDirection: "column",
    },
  },

  control: {
    height: 42,
    fontSize: theme.fontSizes.md,

    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  secondaryControl: {
    color: theme.white,
    backgroundColor: "rgba(255, 255, 255, .4)",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, .45) !important",
    },
  },
}))

function homepage() {
  const { classes, cx } = useStyles()
  const [query, setQuery] = useState("")
  const [foodData, setFoodData] = useState(null)
  const { currentUser } = useAuthContext()
  const currentDay = moment().format("DD-MM-YY")

  const handleSubmit = async (event) => {
    event.preventDefault()

    const data = await FoodAPI.getFoodData(query)

    setFoodData(data)

    console.log(currentUser)
  }

  const clearData = () => {
    setFoodData(null)
  }

  const addProduct = async (name, srv, c, p, f, s) => {
    const dayRef = doc(
      db,
      "users",
      `${currentUser.uid}`,
      "days",
      `${currentDay}`
    )
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

  console.log(foodData)

  return (
    <div height={"100vh"} className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome Back{" "}
          {currentUser && (
            <Text component="span" inherit className={classes.highlight}>
              {currentUser.displayName}
            </Text>
          )}
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}></Text>
        </Container>

        <div className={classes.controls}>
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
                  className="bg-blue-500"
                >
                  <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
              }
              placeholder="Search questions"
              rightSectionWidth={42}
            />
          </form>
        </div>

        <Group position="center" mt={"xl"}>
          <AnimatePresence>
            {foodData &&
              foodData.map((f) => (
                <FoodArticle
                  food={f}
                  key="foodarticle"
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
      </div>
    </div>
  )
}

export default withAuth(homepage)
