import { doc, setDoc } from "@firebase/firestore"
import { Button, Container, Group, NavLink, Title } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons"
import Link from "next/link"
import { useAuthContext } from "../../context/AuthContext"
import { db } from "../../firebase"
import useGetDays from "../../hooks/useGetDays"
import moment from "moment"

const index = () => {
  const { docs: days } = useGetDays()
  const { currentUser } = useAuthContext()
  const date = moment().format("DD-MM-YY")

  const newDay = async () => {
    await setDoc(doc(db, `users/${currentUser.uid}/days/${date}`), {
      id: date,
    })
  }

  return (
    <Container size="sm">
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
        <ul>
          {days &&
            days.map((day) => (
              <Link href={`/days/${day.id}`}>
                <NavLink
                  label={`${day.id}`}
                  rightSection={<IconChevronRight size={12} stroke={1.5} />}
                  className="bg-blue-500 rounded-md text-white hover:bg-blue-600"
                  mt={"md"}
                />
              </Link>
            ))}
        </ul>
      </div>
    </Container>
  )
}

export default index
