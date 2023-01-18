import { useState } from "react"
import { Button, createStyles, NumberInput, Slider } from "@mantine/core"
import { useAuthContext } from "../context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"

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
  const [value, setValue] = useState(2200)
  const { currentUser } = useAuthContext()


  const newGoal = async (e) => {
    e.preventDefault()
    const ref = doc(db, `users/${currentUser.uid}`)
    await updateDoc(ref, {
      calorie_goal: value,
    })
  }

  return (
    <>
      <form onSubmit={newGoal}>
        <div className={classes.wrapper}>
          <NumberInput
            value={value}
            onChange={setValue}
            label="What is your Goal"
            placeholder="2200 is an average value"
            step={50}
            min={0}
            max={8000}
            hideControls
            classNames={{ input: classes.input, label: classes.label }}
          />
          <Slider
            max={8000}
            step={50}
            min={0}
            label={null}
            value={value}
            onChange={setValue}
            size={2}
            radius={0}
            className={classes.slider}
            classNames={{ thumb: classes.thumb, track: classes.track }}
          />
        </div>
        <div>
          <Button type="submit" className="bg-blue-600">Save!</Button>
        </div>
      </form>
    </>
  )
}

export default goals
