import { useAuthContext } from "../context/AuthContext"
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { collection } from '@firebase/firestore'
import { db } from '../firebase'

const useGetMealProducts = (meal) => {
    const { currentUser } = useAuthContext()
    const query = collection(db, `users/${currentUser.uid}/meals/${meal}/products`)
    const [docs, loading, error] = useCollectionData(query)

    return {
        docs,
        loading,
        error
    }
}

export default useGetMealProducts