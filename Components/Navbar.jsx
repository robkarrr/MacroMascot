import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  ScrollArea,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"
import { useAuthContext } from "../context/AuthContext"

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}))

export default function Navbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false)

  const { classes, theme } = useStyles()
  const { currentUser, logout } = useAuthContext()

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Link href="/">
            <h1>MacroMascot</h1>
          </Link>

          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <Link href="/meals" className={classes.link}>
              Meals
            </Link>
            <Link href="/goals" className={classes.link}>
              Goals
            </Link>
            <Link href="/track" className={classes.link}>
              Track
            </Link>
          </Group>

          <Group className={classes.hiddenMobile}>
            {currentUser ? (
              <Button onClick={() => logout()} variant="default">
                Log Out
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="default">Log in</Button>
                </Link>
                <Link href="register">
                  <Button className="bg-blue-500">Sign up</Button>
                </Link>
              </>
            )}
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
            </Center>
          </UnstyledButton>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="md">
          {currentUser ? (
              <Button onClick={() => logout()} variant="default">
                Log Out
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="default">Log in</Button>
                </Link>
                <Link href="register">
                  <Button className="bg-blue-500">Sign up</Button>
                </Link>
              </>
            )}
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  )
}
