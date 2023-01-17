import { useState } from "react"
import {
  createStyles,
  Navbar,
  Group,
  Button,
  ActionIcon,
  TextInput,
} from "@mantine/core"
import useGetMeals from "../../hooks/useGetMeals"
import { db } from "../../firebase"
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, } from "firebase/firestore"
import { useAuthContext } from "../../context/AuthContext"
import {
  IconSwitchHorizontal,
  IconLogout,
  IconSearch,
  IconArrowRight,
} from "@tabler/icons"
import FoodArticle from "../../Components/FoodArticle"
import FoodAPI from "../../services/FoodAPI"
import useGetMeal from '../../hooks/useGetMeals'
import Link from "next/link"

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
  const { docs: meals } = useGetMeals()
  const { currentUser } = useAuthContext()

  return (
    <div className="flex">
      <Navbar height={700} width={{ sm: 300 }} p="md">
        <Navbar.Section grow>
          {meals &&
            meals.map((item) => (
              <Link
                href={`/meals/${item.name}`}
                className={cx(classes.link)}
                key={item.id}
              >
                <span>{item.name}</span>
              </Link>
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
    </div>
  )
}

export default meals
