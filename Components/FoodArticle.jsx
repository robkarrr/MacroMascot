import {
  createStyles,
  Text,
  Card,
  RingProgress,
  Group,
  Button,
  ActionIcon,
} from "@mantine/core"
import { IconPlus, IconTrash } from "@tabler/icons"
import { motion, AnimatePresence } from "framer-motion"

function FoodArticle({ food, clear, add }) {
  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 1 }}
      key="food"
    >
      <Card className="max-w-md" withBorder p="md" radius="md">
        <div>
          <div>
            <Text size="xl">
              {food.serving_size_g}g {food.name}
            </Text>
            <div>
              <Text className="font-bold text-xl">{food.calories}</Text>
              <Text size="xs" color="dimmed">
                Calories
              </Text>
            </div>
            <Group position={"apart"} mt="md">
              <div>
                <Text className="text-bold">{food.protein_g}g</Text>
                <Text size="xs" color="dimmed">
                  Protein
                </Text>
              </div>

              <div>
                <Text className="text-bold">{food.fat_total_g}g</Text>
                <Text size="xs" color="dimmed">
                  Fat
                </Text>
              </div>

              <div>
                <Text className="text-bold">{food.sugar_g}g</Text>
                <Text size="xs" color="dimmed">
                  Sugar
                </Text>
              </div>

              <Group>
                <ActionIcon onClick={add}>
                  <IconPlus />
                </ActionIcon>

                <ActionIcon onClick={clear}>
                  <IconTrash />
                </ActionIcon>
              </Group>
            </Group>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default FoodArticle
