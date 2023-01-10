

const getFoodData = async (query) => {
   // Make an fetch request with the query and headers
   const response = await fetch(
    `https://api.api-ninjas.com/v1/nutrition?query=${query}`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": `${process.env.NEXT_PUBLIC_FOODNINJA_API_KEY}`,
      },
    }
  )
  const data = await response.json()

  return data
}

export default {
    getFoodData
}