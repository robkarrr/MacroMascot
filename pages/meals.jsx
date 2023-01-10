import { useState } from "react"
import {
  createStyles,
  Navbar,
  Group,
  Button,
  ActionIcon,
  TextInput,
} from "@mantine/core"
import useGetMeals from "../hooks/useGetMeals"
import { db } from "../firebase"
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, } from "firebase/firestore"
import { useAuthContext } from "../context/AuthContext"
import {
  IconSwitchHorizontal,
  IconLogout,
  IconSearch,
  IconArrowRight,
} from "@tabler/icons"
import FoodArticle from "../Components/FoodArticle"
import FoodAPI from "../services/FoodAPI"
import useGetMealProducts from "../hooks/useGetMealProdcuts"

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon")
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  }
})

function meals() {
  const { classes, cx } = useStyles()
  const [active, setActive] = useState("meal1")
  const { docs: meals } = useGetMeals()
  const { docs: mealProducts } = useGetMealProducts(active)
  const [query, setQuery] = useState("")
  const [foodData, setFoodData] = useState()
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
    console.log(foodData.name)

    const mealRef = doc(db, 'users', `${currentUser.uid}`, 'meals', `meal1`);

    await updateDoc(mealRef, {
      products: arrayUnion(
        {
          name,
          serving_size: srv,
          calories: c,
          protein: p,
          fat: f,
          sugar: s,
        }
      )
    })
    
  }

  // const newMeal = async () => {}

  console.log(meals)

  return (
    <div className="flex">
      <Navbar height={700} width={{ sm: 300 }} p="md">
        <Navbar.Section grow>
          <Group className={classes.header} position="apart">
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
            {foodData?.map((f) => (
              <FoodArticle
              food={f}
              clear={clearData}
              add={() => AddToMeal(f.name, f.serving_size_g, f.calories, f.protein_g, f.fat_total_g, f.sugar_g)}
            />
            ))}
          </Group>
          {meals &&
            meals.map((item) => (
              <a
                className={cx(classes.link, {
                  [classes.linkActive]: item.name === active,
                })}
                key={item.id}
                onClick={(event) => {
                  event.preventDefault()
                  setActive(item.name)
                }}
              >
                <span>{item.name}</span>
              </a>
            ))}
          <Button className={cx(classes.link)}>New meal +</Button>
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
          <a
            href="#"
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <span>Change account</span>
          </a>

          <a
            href="#"
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </Navbar.Section>
      </Navbar>

      <div>
        <ul>
          {mealProducts &&
            mealProducts.map((p) => <li key={p.id}>{p.name}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default meals
