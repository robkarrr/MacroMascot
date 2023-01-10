function FoodArticle({ food, clear, add }) {
  return (
    <div>
      <ul>
        <div key={food.id}>
          <li>{food.name}</li>
          <li>{food.calories}</li>
          <li>{food.protein_g}</li>
          <li>{food.serving_size_g}</li>
        </div>
      </ul>

      <div>
        <button onClick={clear}>Clear</button>
        <button onClick={add}>Add</button>
      </div>
    </div>
  )
}

export default FoodArticle
