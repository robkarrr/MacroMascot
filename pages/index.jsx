import {
  Title,
  Text,
  Container,
  Button,
  TextInput,
  ActionIcon,
  Overlay,
  createStyles,
} from "@mantine/core"
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons"
import { useState } from "react"
import FoodArticle from "../Components/FoodArticle"
import FoodAPI from "../services/FoodAPI"
import { useAuthContext } from "../context/AuthContext"
import moment from "moment"
import { arrayUnion, doc, updateDoc } from "@firebase/firestore"
import { db } from "../firebase"

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    height: "100vh",
    paddingTop: 180,
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

export default function HeroImageBackground() {
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
    const dayRef = doc(db, "users", `${currentUser.uid}`, "days", `${currentDay}`)
    await updateDoc(dayRef, {
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
      </div>
    </div>
  )
}
