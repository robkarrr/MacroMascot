import { useAuthContext } from "../context/AuthContext"
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc } from '@firebase/firestore'
import { db } from '../firebase'

const useGetMeal = (meal) => {
    const { currentUser } = useAuthContext()
    const query = doc(db, `users/${currentUser.uid}/meals/${meal}`)
    const [docs, loading, error] = useDocumentData(query)

    return {
        docs,
        loading,
        error
    }
}

export default useGetMeal