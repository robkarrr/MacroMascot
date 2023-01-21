import { deleteDoc, doc, setDoc } from "@firebase/firestore"
import {
  ActionIcon,
  Button,
  Container,
  Group,
  NavLink,
  ScrollArea,
  Title,
} from "@mantine/core"
import { IconChevronRight, IconTrash } from "@tabler/icons"
import Link from "next/link"
import { useAuthContext } from "../../context/AuthContext"
import { db } from "../../firebase"
import useGetDays from "../../hooks/useGetDays"
import moment from "moment"
import withAuth from "../../middlewares/withAuth"

const index = () => {
  const { currentUser } = useAuthContext()
  const { docs: days } = useGetDays()
  const date = moment().format("DD-MM-YY")

  const newDay = async () => {
      await setDoc(doc(db, `users/${currentUser.uid}/days/${date}`), {
        id: date,
      })
  }

  const deleteDay = async (day) => {
    await deleteDoc(doc(db, 'users', `${currentUser.uid}`, 'days', `${day}`))
}

  return (
    <Container size="sm">

      {!currentUser && ( 
        <Title mt={'mt'} align="center">
          You need to be logged in to view this
        </Title>
      )}


      <Title mt={"md"} align="center">
        See the days you tracked
      </Title>



      <div>
        <Group mt={"md"}>
          <Button
            onClick={() => newDay()}
            className="bg-blue-500 hover:bg-blue-600"
            type="submit"
          >
            New Day +
          </Button>
        </Group>
        <ScrollArea mt={'md'} type={'auto'} style={{height: '50vh'}}>
          {days && (
            <ul>
              {days.map((day) => (
                <Group className='align-middle mt-5'>
                  <Link className='bg-blue-500 p-2 rounded-md text-white w-11/12 hover:bg-blue-600' href={`/days/${day.id}`}>
                    <li >{day.id}</li>
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
    </Container>
  )
}

export default withAuth(index)
