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

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Make an fetch request with the query and headers
    const response = await fetch(
      `https://api.api-ninjas.com/v1/nutrition?query=${query}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": `${process.env.NEXT_PUBLIC_FOODNINJA_API_KEY}`,
        },
      }
    )
    const data = await response.json()

    // Do something with the data
    console.log(data)
    setFoodData(data)
  }

  const clearData = () => {
    setFoodData(null)

  }

  return (
    <div height={"100vh"} className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome Back{" "}
          <Text component="span" inherit className={classes.highlight}>
            Robin
          </Text>
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

        <div>{foodData && <FoodArticle food={foodData} clear={clearData}/>}</div>
      </div>
    </div>
  )
}
