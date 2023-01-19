import { Button } from "@mantine/core"
import { IconChevronLeft } from "@tabler/icons"
import { useRouter } from "next/router"

const BackButton = () => {
    const router = useRouter() 
  return (
    <Button
      leftIcon={<IconChevronLeft size={12} stroke={1.5} />}
      className="bg-blue-500 hover:bg-blue-600"
      onClick={() => router.back()}
    >
      Back
    </Button>
  )
}

export default BackButton
