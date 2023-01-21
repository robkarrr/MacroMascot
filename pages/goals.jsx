import { useState } from "react"
import {
  Button,
  Container,
  createStyles,
  NumberInput,
  Slider,
  Title,
} from "@mantine/core"
import { useAuthContext } from "../context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import withAuth from "../middlewares/withAuth"
import useGetUser from "../hooks/useGetUser"

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 22,
    paddingBottom: 3,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },

  slider: {
    position: "absolute",
    width: "100%",
    bottom: -1,
  },

  thumb: {
    width: 16,
    height: 16,
  },

  track: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}))

const goals = () => {
  const { classes } = useStyles()
  const { currentUser } = useAuthContext()
  const { data: userGoal } = useGetUser(currentUser.uid)
  const [value, setValue] = useState('')

  const newGoal = async () => {
    const ref = doc(db, `users/${currentUser.uid}`)
    await updateDoc(ref, {
      calorie_goal: value,
    })
  }

  return (
    <Container>
      <Title mt={"md"} align="center">
        Your Goal
      </Title>
      {userGoal.calorie_goal && (
        <>
          <div className={classes.wrapper}>
            <NumberInput
              mt={"md"}
              value={value}
              onChange={setValue}
              label="What is your Goal"
              placeholder="2200 is an average value"
              defaultValue={userGoal.calorie_goal}
              step={50}
              min={0}
              max={5000}
              hideControls
              classNames={{ input: classes.input, label: classes.label }}
            />
            <Slider
              max={5000}
              step={50}
              min={0}
              value={value}
              defaultValue={userGoal.calorie_goal}
              onChange={setValue}
              size={2}
              radius={0}
              className={classes.slider}
              classNames={{ thumb: classes.thumb, track: classes.track }}
            />
          </div>
          <div align="center">
            <Button mt={"md"} onClick={() => newGoal()} className="bg-blue-600">
              Save!
            </Button>
          </div>
        </>
      )}
    </Container>
  )
}

export default withAuth(goals)
