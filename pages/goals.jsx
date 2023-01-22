import { useState } from "react"
import {
  Button,
  Card,
  Container,
  createStyles,
  NumberInput,
  Progress,
  Slider,
  Text,
  Title,
} from "@mantine/core"
import { useAuthContext } from "../context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import withAuth from "../middlewares/withAuth"
import useGetUser from "../hooks/useGetUser"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useGetDay from "../hooks/useGetDay"
import moment from "moment"

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

const Goals = () => {
  const { classes } = useStyles()
  const { currentUser } = useAuthContext()
  const { data: userGoal } = useGetUser(currentUser.uid)
  const [value, setValue] = useState(userGoal.calorie_goal)
  const currentDate = moment().format("DD-MM-YY")
  const { docs: day } = useGetDay(currentDate)


  const newGoal = async () => {
    const ref = doc(db, `users/${currentUser.uid}`)
    try {
      await updateDoc(ref, {
        calorie_goal: value,
      })

      toast.success("🎯 Goal saved!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    } catch (err) {
      toast.error(`❌ ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
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
              min={1}
              max={5000}
              hideControls
              classNames={{ input: classes.input, label: classes.label }}
            />
            <Slider
              max={5000}
              step={50}
              min={1}
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

          {userGoal.calorie_goal && day.total && (
                <Card
                  mt={'lg'}
                  withBorder
                  radius="md"
                  p="xl"
                  sx={(theme) => ({
                    backgroundColor:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[7]
                        : theme.white,
                  })}
                >
                  <Text
                    size="xs"
                    transform="uppercase"
                    weight={700}
                    color="dimmed"
                  >
                    Daily Goal
                  </Text>
                  <Text size="lg" weight={500}>
                    {day.total.calories} / {userGoal.calorie_goal}
                  </Text>
                  <Progress
                    value={Math.ceil(
                      (day.total.calories / userGoal.calorie_goal) * 100
                    )}
                    mt="md"
                    size="lg"
                    radius="xl"
                  />
                </Card>
              )}
        </>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </Container>
  )
}

export default withAuth(Goals)
