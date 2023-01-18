import { Container } from "@mantine/core"
import { useRouter } from "next/router"
import useGetDay from "../../hooks/useGetDay"

const day = () => {
  const router = useRouter()
  const { id } = router.query
  const { docs: day } = useGetDay(id)

  console.log(day)

  return (
    <Container>
      <div>
        <p>Total macros</p>
        {day && (
          <ul>
            <li>{day.total?.calories}</li>
          </ul>
        )}
      </div>
    </Container>
  )
}

export default day
