import { deleteDoc, doc, getDoc, setDoc } from "@firebase/firestore"
import {
  ActionIcon,
  Button,
  Container,
  Group,
  ScrollArea,
  TextInput,
  Title,
} from "@mantine/core"
import { IconChevronRight, IconTrash } from "@tabler/icons"
import Link from "next/link"
import { useAuthContext } from "../../context/AuthContext"
import { db } from "../../firebase"
import useGetDays from "../../hooks/useGetDays"
import moment from "moment"
import withAuth from "../../middlewares/withAuth"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { DateInput } from "@mantine/dates"
import { useState } from "react"

const Days = () => {
  const { currentUser } = useAuthContext()
  const { docs: days } = useGetDays()
  const date = moment().format("DD-MM-YY")
  const [value, setValue] = useState()

  const newDay = async (e) => {
    e.preventDefault()
    const checkDay = await getDoc(
      doc(db, `users/${currentUser.uid}/days/${moment(value).format("DD-MM-YY")}`)
    )

    if (checkDay.exists()) {
      toast.error(`📝 You are already tracking Today!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    } else {
      await setDoc(doc(db, `users/${currentUser.uid}/days/${moment(value).format("DD-MM-YY")}`), {
        id: moment(value).format("DD-MM-YY"),
      })
    }
  }

  const deleteDay = async (day) => {
    await deleteDoc(doc(db, "users", `${currentUser.uid}`, "days", `${day}`))
  }

  return (
    <Container size="sm">
      {!currentUser && (
        <Title mt={"mt"} align="center">
          You need to be logged in to view this
        </Title>
      )}

      <Title mt={"md"} align="center">
        See the days you tracked
      </Title>

      <div>
        <form onSubmit={newDay}>
          <Group mt={"md"}>
            <Button className="bg-blue-500 hover:bg-blue-600" type="submit">
              New Meal +
            </Button>

            <DateInput
              value={value}
              valueFormat="YYYY-MM-DD"
              onChange={setValue}
              placeholder="Date input"
            />
          </Group>
        </form>
        <ScrollArea mt={"md"} type={"auto"} style={{ height: "50vh" }}>
          {days && (
            <ul>
              {days.map((day) => (
                <Group key={day.id} className="align-middle mt-5">
                  <Link
                    className="bg-blue-500 p-2 rounded-md text-white w-11/12 hover:bg-blue-600"
                    href={`/days/${day.id}`}
                  >
                    <li>{day.id}</li>
                  </Link>

                  <ActionIcon onClick={() => deleteDay(day.id)}>
                    <IconTrash />
                  </ActionIcon>
                </Group>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
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

export default withAuth(Days)
