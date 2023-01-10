function FoodArticle({ food, clear }) {
    return (
        <div>
            <ul>
                {food.map((f) => (
                    <div key={f.id}>
                        <li>{f.name}</li>
                        <li>{f.calories}</li>
                        <li>{f.protein_g}</li>
                        <li>{f.serving_size_g}</li>
                    </div>
                ))}
            </ul>

            <div>
                <button onClick={clear}>
                    Clear
                </button>
                <button>
                    Add
                </button>
            </div>
        </div>
    );
}

export default FoodArticle;